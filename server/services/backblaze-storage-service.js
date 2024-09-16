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
        return getSignedUrl(this.s3_client, command, {expiresIn: 86400}); // 24 hours
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