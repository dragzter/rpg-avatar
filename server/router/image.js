import express from "express"
import OpenAiService from "../services/open-ai-service.js";
import NovitaAiService from "../services/novita-ai-service.js";
import taskManager, {ApiTaskStatus} from "../services/task-manager.js";

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

router.post("/api/task-status", (req, res) => {
    const {task_id} = req.body;
    const task = taskManager.getTaskStatus(task_id);

    if (task.status === ApiTaskStatus.COMPLETE) {
        const result = NovitaAiService.getFinishedImages(task_id);
        console.log(result)
        taskManager.removeTask(task_id);
        return res.json({...result});

    } else if (task.canceled) {
        return res.status(400).json({
            success: false,
            message: `Task ${task_id} has been canceled.`
        });
    } else {
        return res.json({success: true, status: task.status, task_id: task.task_id});
    }
})

router.post("/api/task-image-v2", async (req, res) => {
    try {
        const response = await NovitaAiService.startImageGeneration(req.body?.data);


        NovitaAiService.startTaskStatusPolling(response.task_id).then((_resp) => {
            taskManager.activeTasks[_resp.task_id].status = "complete";
        })

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