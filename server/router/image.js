import express from "express"
import OpenAiService from "../services/open-ai-service.js";
import NovitaAiService from "../services/novita-ai-service.js";
import taskManager from "../services/task-manager.js";

const router = express.Router();

router.post("/api/image", async (req, res) => {
    console.log(req.body, "route: /api/image")
    try {
        const imageUrl = await OpenAiService.requestImage(req.body)

        res.status(200).json(imageUrl)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

router.post("/api/cancel-task", (req, res) => {
    const {task_id} = req.body;
    taskManager.cancelTask(task_id);
    res.json({success: true, message: `Task ${task_id} has been canceled.`});
});

router.post("/api/task-image-progress", async (req, res) => {
    const {task_id} = req.body;

    try {
        const response = await NovitaAiService.checkImageGenerationProgress(task_id);

        if (response?.success && response?.images) {
            console.log("Images generated successfully:", response.images);
            res.status(200).json(response);
        } else if (!response?.success) {
            res.status(400).json({
                success: false,
                message: "Task was canceled or failed.",
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Task is still in progress.",
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error checking task progress.",
        });
    }
});

router.post("/api/task-image-v2", async (req, res) => {
    try {
        console.log(req.body.data)
        const response = await NovitaAiService.startImageGeneration(req.body?.data);

        if (response?.task_id) {
            return res.status(200).json(response);
        } else {
            return res.status(500).json(response);
        }

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Error initiating the Image Generation Service",
            error
        });
    }
});

export {router}