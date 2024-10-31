import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "../config.js";
import express from "express";
import sharp from "sharp";
import UserService from "./user-service.js";

const router = express.Router();

class BackblazeStorageService {
    bucket_name = process.env.BACKBLAZE_BUCKET_NAME;

    constructor() {
        this.s3_client = new S3Client({
            endpoint: "https://s3.us-east-005.backblazeb2.com",
            region: process.env.BACKBLAZE_REGION,
            credentials: {
                accessKeyId: process.env.BACKBLAZE_KEY_ID,
                secretAccessKey: process.env.BACKBLAZE_APP_KEY,
            },
        });
    }

    async deleteAllInFolder(userId) {
        try {
            // Sanitize the userId to remove any pipes
            const sanitizedUserId = userId.replace("|", "");
            const folderPath = `${sanitizedUserId}/`;

            let isTruncated = true;
            let continuationToken = null;
            const deletePromises = [];

            while (isTruncated) {
                const listParams = {
                    Bucket: this.bucket_name,
                    Prefix: folderPath, // Specify the folder path as the prefix
                    ContinuationToken: continuationToken,
                };

                const commandList = new ListObjectsV2Command(listParams);
                const response = await this.s3_client.send(commandList);

                // Collect all delete commands for the files in the folder
                response.Contents.forEach((file) => {
                    const deleteParams = {
                        Bucket: this.bucket_name,
                        Key: file.Key,
                    };
                    deletePromises.push(
                        this.s3_client.send(
                            new DeleteObjectCommand(deleteParams)
                        )
                    );
                });

                isTruncated = response.IsTruncated;
                continuationToken = response.NextContinuationToken;
            }

            // Execute all delete commands in parallel
            await Promise.all(deletePromises);

            const image_count =
                await UserService.getAndUpdateUserImageCount(userId);

            return {
                success: true,
                message: "All files in the folder deleted successfully",
                image_count,
            };
        } catch (error) {
            console.error("Error deleting files in folder:", error);
            return {
                success: false,
                message: "Error deleting files in folder",
                error,
            };
        }
    }

    async deleteMany(fileNames, userId) {
        try {
            const deletionPromises = fileNames.map(async (fileName) => {
                const deleteParams = {
                    Bucket: this.bucket_name,
                    Key: fileName,
                };

                const commandDelete = new DeleteObjectCommand(deleteParams);
                return this.s3_client.send(commandDelete);
            });

            const resp = await Promise.all(deletionPromises);

            const image_count =
                await UserService.getAndUpdateUserImageCount(userId);

            return {
                success: true,
                message: "Files deleted successfully",
                image_count,
            };
        } catch (error) {
            console.error("Error deleting files:", error);
            return {
                success: false,
                message: "Error deleting files",
                error,
            };
        }
    }

    async deleteImageAndThumbnail(fileName, userId) {
        const deleteImageParams = {
            Bucket: this.bucket_name,
            Key: fileName,
        };

        // image is userid/f45jk2h.image.jpeg
        // thumbnail is userid/thumbnails/f45jk2h.thumbnail.jpeg
        let thumbnailKey = fileName.replace("/", "/thumbnails/");
        thumbnailKey = thumbnailKey.replace(".image.", ".thumbnail.");
        const deleteThumbnailParams = {
            Bucket: this.bucket_name,
            Key: thumbnailKey,
        };

        try {
            const commandImageDelete = new DeleteObjectCommand(
                deleteImageParams
            );
            const commandThumbnailDelete = new DeleteObjectCommand(
                deleteThumbnailParams
            );

            const [image, thumbnail] = await Promise.all([
                this.s3_client.send(commandImageDelete),
                this.s3_client.send(commandThumbnailDelete),
            ]);

            const image_count =
                await UserService.getAndUpdateUserImageCount(userId);

            return {
                success: true,
                message: "File deleted successfully",
                image_count,
            };
        } catch (error) {
            console.error("Error deleting file:", error);
            return {
                success: false,
                message: "Error deleting file",
                error,
            };
        }
    }

    async getPresignedUrl(fileName) {
        const command = new GetObjectCommand({
            Bucket: this.bucket_name,
            Key: fileName,
        });
        return await getSignedUrl(this.s3_client, command, {
            expiresIn: 86400,
        });
    }

    // Maybe this is also useful -- Not being used as of 9/20/2021
    // Decided that getting thumbnails and images is better done together
    // Since the max is 400 images and this is pretty fast already.
    async fetchImageThumbnails(user_id) {
        try {
            const params = {
                Bucket: this.bucket_name,
                Prefix: `${user_id.replace("|", "")}/thumbnails/`,
            };

            const command = new ListObjectsV2Command(params);
            const response = await this.s3_client.send(command);

            const images = await Promise.all(
                response.Contents.map(async (item) => {
                    return {
                        key: item.Key,
                        url: await this.getPresignedUrl(item.Key),
                    };
                })
            );

            return {
                success: true,
                requested_on: new Date().toISOString(),
                images,
            };
        } catch (error) {
            console.error("Error fetching images:", error);
            return {
                success: false,
                message: "Error fetching images",
            };
        }
    }

    // This is somewhat deprecated as it fetches all images and thumbnails
    // Use fetchImagesPaginated instead to limit traffic and network loads.
    async fetchImages(user_id) {
        let allImages = []; // Collect all images across all pages
        let allThumbnails = []; // Collect all thumbnails across all pages

        try {
            const prefix = `${user_id.replace("|", "")}/`;
            let isTruncated = true;
            let continuationToken = null;

            // Loop to fetch all objects, bypassing the 1000-item limit
            while (isTruncated) {
                const params = {
                    Bucket: this.bucket_name,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                };

                const command = new ListObjectsV2Command(params);
                const response = await this.s3_client.send(command);

                // Collect all items in allImages and allThumbnails
                response.Contents.forEach((obj) => {
                    if (obj.Key.includes("thumbnails/")) {
                        allThumbnails.push(obj);
                    } else {
                        allImages.push(obj);
                    }
                });

                isTruncated = response.IsTruncated;
                continuationToken = response.NextContinuationToken;
            }

            // Sort all images and thumbnails by LastModified date in descending order
            const sortedImages = allImages.sort(
                (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
            );
            const sortedThumbnails = allThumbnails.sort(
                (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
            );

            // Get presigned URLs for the sorted images and thumbnails
            const [thumbnails, images] = await Promise.all([
                await Promise.all(
                    sortedThumbnails.map(async (item) => ({
                        key: item.Key,
                        url: await this.getPresignedUrl(item.Key),
                    }))
                ),
                await Promise.all(
                    sortedImages.map(async (item) => ({
                        key: item.Key,
                        url: await this.getPresignedUrl(item.Key),
                    }))
                ),
            ]);

            return {
                success: true,
                requested_on: new Date().toISOString(),
                thumbnails,
                images,
            };
        } catch (error) {
            console.error("Error fetching and sorting images:", error);
            return {
                success: false,
                message: "Error fetching and sorting images",
                error,
            };
        }
    }

    // Added on 10/30/2024 - This is the new way to fetch images with pagination
    async fetchImagesPaginated(user_id, { page = 1, limit = 50 }) {
        let allImages = [];
        let allThumbnails = [];

        try {
            const prefix = `${user_id.replace("|", "")}/`;
            let isTruncated = true;
            let continuationToken = null;

            // Fetch all objects in the bucket for the given user
            while (isTruncated) {
                const params = {
                    Bucket: this.bucket_name,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                };

                const command = new ListObjectsV2Command(params);
                const response = await this.s3_client.send(command);

                response.Contents?.forEach((obj) => {
                    if (obj.Key.includes("thumbnails/")) {
                        allThumbnails.push(obj);
                    } else {
                        allImages.push(obj);
                    }
                });

                isTruncated = response.IsTruncated;
                continuationToken = response.NextContinuationToken;
            }

            // Sort images and thumbnails by LastModified date
            const sortedImages = allImages.sort(
                (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
            );
            const sortedThumbnails = allThumbnails.sort(
                (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
            );

            // Return an empty response if there are no images
            if (sortedImages.length === 0) {
                return {
                    success: true,
                    requested_on: new Date().toISOString(),
                    page,
                    limit,
                    total_images: 0,
                    total_pages: 0,
                    thumbnails: [],
                    images: [],
                };
            }

            // Calculate total pages based on the number of images and limit
            const totalImages = sortedImages.length;
            const totalPages = Math.ceil(totalImages / limit);

            // Implement pagination by slicing sorted arrays based on page and limit
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const pagedImages = sortedImages.slice(startIndex, endIndex);
            const pagedThumbnails = sortedThumbnails.slice(
                startIndex,
                endIndex
            );

            // Retrieve presigned URLs for the paginated results
            const [thumbnails, images] = await Promise.all([
                Promise.all(
                    pagedThumbnails.map(async (item) => ({
                        key: item.Key,
                        url: await this.getPresignedUrl(item.Key),
                    }))
                ),
                Promise.all(
                    pagedImages.map(async (item) => ({
                        key: item.Key,
                        url: await this.getPresignedUrl(item.Key),
                    }))
                ),
            ]);

            return {
                success: true,
                requested_on: new Date().toISOString(),
                page,
                limit,
                total_images: totalImages,
                total_pages: totalPages,
                thumbnails,
                images,
            };
        } catch (error) {
            console.error(
                "Error fetching and sorting images with pagination:",
                error
            );
            return {
                success: false,
                message: "Error fetching and sorting images with pagination",
                error,
            };
        }
    }

    async upload(fileBuffer, key) {
        const uploadParams = {
            Bucket: this.bucket_name,
            Key: key, // the file name in the bucket
            Body: fileBuffer,
            ContentType: "image/jpeg", // you can change this based on the image type
        };

        try {
            const command = new PutObjectCommand(uploadParams);
            await this.s3_client.send(command);
        } catch (err) {
            console.error("Error uploading to Backblaze:", err);
        }
    }

    // Create and upload a thumbnail
    async createThumbnailAndUpload(imageBuffer, fileName) {
        try {
            const thumbnailBuffer = await sharp(imageBuffer)
                .resize({ width: 200 })
                .toBuffer();

            await this.upload(thumbnailBuffer, fileName);
        } catch (error) {
            console.error("Error creating thumbnail:", error);
        }
    }

    async getUserImageCount(user_id) {
        try {
            let isTruncated = true;
            let continuationToken = null;
            let imageCount = 0;
            user_id = user_id.replace("|", ""); // Backblaze doesnt like pipes

            while (isTruncated) {
                const params = {
                    Bucket: this.bucket_name,
                    Prefix: `${user_id}/`,
                    ContinuationToken: continuationToken,
                };

                const command = new ListObjectsV2Command(params);
                const response = await this.s3_client.send(command);

                if (response.Contents?.length) {
                    const nonThumbnailObjects = response.Contents.filter(
                        (item) => !item.Key.includes("/thumbnails/")
                    );

                    imageCount += nonThumbnailObjects.length;
                }

                console.log("Image count:", imageCount);
                isTruncated = response.IsTruncated;
                continuationToken = response.NextContinuationToken;
            }
            return imageCount;
        } catch (error) {
            console.error("Error getting user image count:", error);
        }
    }
}

export default new BackblazeStorageService();
