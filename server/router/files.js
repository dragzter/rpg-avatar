import express from "express";
import multer from "multer";
import fs from "fs"; // Import fs for filesystem operations
import path from "path";
import BackblazeStorageService from "../services/backblaze-storage-service.js";
import {fileURLToPath} from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const upload = multer({storage: multer.memoryStorage()});

router.post("/api/upload", upload.array("files"), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({message: "No files provided"});
        }

        const uploadResults = await Promise.all(
            req.files.map((file) => BackblazeStorageService.upload(file))
        );

        req.files.forEach((file) => fs.unlinkSync(file.path));

        return res.status(200).json({
            message: "Files uploaded successfully",
            results: uploadResults,
        });
    } catch (err) {
        console.error("Error uploading files:", err);
        return res.status(500).json({message: "File upload failed", error: err});
    }
});

export {router};
