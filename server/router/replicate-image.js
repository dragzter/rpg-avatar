import express from "express";
import ReplicateAiService from "../services/replicate-ai-service.js";

const router = express.Router();

/**
 * This router will utilize the replicate api.
 * - https://replicate.com/docs/get-started/nodejs
 *
 * The models used:
 * 1.
 * 2. https://replicate.com/fofr/face-to-sticker
 *
 * 1. Routes and their purpose
 *     0. /api/repl/start-image-task -> POST: Start an image task using the replicate ai
 * service a. /api/repl/image -> POST: Create an image using the replicate ai service
 * This includes models such as flux-pro and flux-schnell and flux-dev b.
 * /api/repl/avatar -> POST: Create an img-to-img avatar using the replicate ai service,
 * request includes the style of the avatar as well as the prompt c. /api/repl/sticker ->
 * POST: Create a sticker from a face img using the replicate ai service
 */

router.post("/api/repl/start-image-task", async (req, res) => {
    try {
        const { data } = req.body;
        const response = await ReplicateAiService.startImageTask(data);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

router.post("/api/repl/image-status", async (req, res) => {
    try {
        const { task_id } = req.body;
        const response = await ReplicateAiService.checkStatus(task_id);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

export { router };