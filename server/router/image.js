import express from "express"
import dotenv from "dotenv"
import OpenAiService from "../services/open-ai-service.js";
import NovitaAiService from "../services/novita-ai-service.js";
import UserService from "../services/user-service.js";

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
    try {
        const {user_id, count} = req.body.data
        const user = await UserService.getUserById(user_id)

        if (user?.token_balance >= count) {
            const response = await NovitaAiService.generateImage(req.body?.data)

            if (response?.length) {
                user.token_balance -= count
                await UserService.saveUser(user)

                res.status(200).json({
                    images: response,
                    success: true,
                    message: "Image generation successful.",
                    new_token_balance: user.token_balance
                })
            }

        } else {
            return res.status(201).json({
                message: "Not enough tokens for this request.",
                success: false,
            })
        }

    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})


export {router}