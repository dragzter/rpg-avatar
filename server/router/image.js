import express from "express"
import dotenv from "dotenv"
import OpenAiService from "../services/open-ai-service.js";
import NovitaAiService from "../services/novita-ai-service.js";

dotenv.config()

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

router.post("/api/image-v2", async (req, res) => {
    console.log(req.body, "route: /api/image-v2")
    try {
        const imageUrl = await NovitaAiService.generateImage(req.body?.data || "a white rabbit")

        console.log(imageUrl)
        res.status(200).json(imageUrl)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})


export {router}