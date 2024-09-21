import {
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client
} from '@aws-sdk/client-s3';
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import "../config.js"
import express from "express"
import sharp from "sharp";

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

    async getPresignedUrl(fileName) {
        const command = new GetObjectCommand({
            Bucket: this.bucket_name,
            Key: fileName,
        });
        return await getSignedUrl(this.s3_client, command, {expiresIn: 86400});
    }

    // Maybe this is also useful -- Not being used as of 9/20/2021
    // Decided that getting thumbnails and images is better done together
    // Since the max is 300 images and this is pretty fast already.
    async fetchImageThumbnails(user_id) {
        try {
            const params = {
                Bucket: this.bucket_name,
                Prefix: `${user_id.replace("|", "")}/thumbnails/`,
            };

            const command = new ListObjectsV2Command(params);
            const response = await this.s3_client.send(command);

            const images = await Promise.all(response.Contents.map(async item => {
                return {
                    key: item.Key,
                    url: await this.getPresignedUrl(item.Key),
                };
            }));

            return {
                success: true,
                requested_on: new Date().toISOString(),
                images,
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            return {
                success: false,
                message: "Error fetching images",
            }
        }
    }

    async fetchImages(user_id) {
        let image_response = []
        let thumbnail_response = []

        // Attempt to get contents of the bucket
        try {
            const params = {
                Bucket: this.bucket_name,
                Prefix: `${user_id.replace("|", "")}/`,
            };

            const image_command = new ListObjectsV2Command(params);
            const image_contents_response = await this.s3_client.send(image_command)

            // sort the images into their own arrays
            image_contents_response.Contents.forEach(obj => {
                if (obj.Key.includes("thumbnails/")) {
                    thumbnail_response.push(obj.Key);
                } else {
                    image_response.push(obj.Key);
                }
            });

        } catch (error) {
            console.log(error)
        }

        // Get the presigned URLs for the images and thumbnails
        try {
            const [thumbnails, images] = await Promise.all([
                await Promise.all(thumbnail_response.map(async key => {
                    return {
                        key,
                        url: await this.getPresignedUrl(key),
                    };
                })),
                await Promise.all(image_response.map(async key => {
                    return {
                        key,
                        url: await this.getPresignedUrl(key),
                    };
                }))
            ])

            return {
                success: true,
                requested_on: new Date().toISOString(),
                thumbnails,
                images
            }
        } catch (error) {
            console.log(error)
            return {
                success: false,
                error,
            }
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
                .resize({width: 200})
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
                    const nonThumbnailObjects = response.Contents.filter(item => !item.Key.includes("/thumbnails/"));

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