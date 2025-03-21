import express from "express";
import OpenAiService from "../services/open-ai-service.js";
import NovitaAiService from "../services/novita-ai-service.js";
import taskManager, { ApiTaskStatus } from "../utils/task-manager.js";
import { promptConstructor } from "../utils/prompt-constructor.js";
import BackblazeStorageService from "../services/backblaze-storage-service.js";
import axios from "axios";
import UserService from "../services/user-service.js";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.post("/api/image", async (req, res) => {
    try {
        const imageUrl = await OpenAiService.requestImage(req.body);

        res.status(200).json(imageUrl);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

router.post("/api/cancel-task", (req, res) => {
    const { task_id } = req.body;
    taskManager.cancelTask(task_id);
    res.json({ success: true, message: `Task ${task_id} has been canceled.` });
});

router.post("/api/task-status", (req, res) => {
    const { task_id } = req.body;
    const task = taskManager.getTaskStatus(task_id);

    if (task?.status === ApiTaskStatus.COMPLETE) {
        const result = NovitaAiService.getFinishedImages(task_id);
        taskManager.removeTask(task_id);
        return res.json({ ...result });
    } else if (task.canceled) {
        return res.status(400).json({
            success: false,
            message: `Task ${task_id} has been canceled.`,
        });
    } else {
        return res.json({
            success: true,
            status: task.status,
            task_id: task.task_id,
        });
    }
});

// Deprecated 9/17/2024
router.post("/api/random-prompt", async (req, res) => {
    try {
        const response = promptConstructor(req.body, true);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

router.get("/api/images/:user_id", async (req, res) => {
    try {
        const user_id = req.params.user_id;

        const response = await BackblazeStorageService.fetchImages(user_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get("/api/images-paginated/:user_id", async (req, res) => {
    try {
        const user_id = req.params.user_id;

        // Parse and validate pagination parameters with defaults
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 50;

        if (page <= 0 || limit <= 0) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be positive integers",
            });
        }

        // Fetch paginated images
        const response = await BackblazeStorageService.fetchImagesPaginated(
            user_id,
            {
                page,
                limit,
            }
        );
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching paginated images:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching paginated images",
            error: error.message,
        });
    }
});

// "Surprise Me"
router.post("/api/surprise-prompt", async (req, res) => {
    try {
        const { archetype, art_style, nsfw_pass } = req.body;

        const response = await OpenAiService.requestAiPromptV2({
            archetype,
            art_style,
            nsfw_pass,
        });

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get("/download-image", async (req, res) => {
    try {
        const imageUrl = req.query.url;
        const response = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "arraybuffer",
        });

        if (response.status !== 200) {
            return res.status(response.status).send("Error fetching image");
        }

        const contentType = response.headers["content-type"];
        const fileName = imageUrl.split("/").pop();

        res.setHeader("Content-Type", contentType);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );

        return res.send(response.data);
    } catch (err) {
        console.error("Error fetching the image:", err.message);
        return res.status(500).send("Error fetching the image");
    }
});

// DELETE endpoint for deleting an image and its thumbnail
router.post("/api/image/delete", async (req, res) => {
    const { file_key, user_id } = req.body;

    try {
        // First, remove all references to the image within the prompt document
        const response = await UserService.removeImage({ file_key, user_id });

        if (!response.success) {
            return res.status(404).json({
                message: response.message,
                success: false,
            });
        }

        // Then, delete the actual file and thumbnail from Backblaze
        const storageResponse =
            await BackblazeStorageService.deleteImageAndThumbnail(
                file_key,
                user_id
            );

        res.status(200).json(storageResponse);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error while deleting image",
            success: false,
            error: error.message,
        });
    }
});

router.post(
    "/api/image/avatar",
    upload.fields([{ name: "baseImage" }, { name: "faceImage" }]),
    async (req, res) => {
        try {
            const { cost, user_id } = req.body;

            // Ensure files are uploaded
            if (!req.files || !req.files.baseImage || !req.files.faceImage) {
                return res.status(400).json({
                    error: "Both baseImage and faceImage are required.",
                });
            }

            // Access the uploaded files from multer
            const baseImageFile =
                req.files.baseImage[0].buffer.toString("base64");
            const faceImageFile =
                req.files.faceImage[0].buffer.toString("base64");

            // Send these files to your avatar generation service
            const response = await NovitaAiService.startAvatarGeneration({
                cost,
                user_id,
                baseImage: baseImageFile,
                faceImage: faceImageFile,
            });

            console.log(response);

            res.status(200).json(response);
        } catch (error) {
            console.error("Error in avatar generation:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.post("/api/image/avatar-status", async (req, res) => {
    try {
        const { task_id } = req.body;

        const response = await NovitaAiService.checkAvatarStatus(task_id);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in avatar generation status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/api/image/avatar-download", async (req, res) => {
    try {
        const { task_id } = req.body;

        const response = await NovitaAiService.getAvatarImage(task_id);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in avatar download:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/api/task-image-v2", async (req, res) => {
    try {
        const response = await NovitaAiService.startImageGeneration(
            req.body?.data
        );

        NovitaAiService.startTaskStatusPolling(response.task_id)
            .then((_resp) => {
                taskManager.activeTasks[_resp.task_id].status = "complete";
            })
            .catch((err) => {
                console.log(err, "Task Status Polling Error");
                taskManager.activeTasks[response.task_id].status = "failed";
            });

        if (response?.task_id) {
            return res.status(200).json(response);
        } else {
            return res.status(500).json(response);
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Error initiating the Image Generation Service",
            error,
        });
    }
});

export { router };
