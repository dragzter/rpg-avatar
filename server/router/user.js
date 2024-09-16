import express from "express"
import UserService from "../services/user-service.js";
import {v4 as uuidv4} from "uuid"

const router = express.Router();

/**
 * USER API routes
 */
router.post("/api/user", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({error: "User object not sent."});
        }
        const userObject = {...req.body};
        userObject.local_id = uuidv4(); // Save user with new local id
        return await UserService.saveUser(userObject)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
});

router.post("/api/user/:userId", async (req, res) => {
    const {userId} = req.params; // Get userId from URL
    const providedUser = req.body; //


    try {
        const user = await UserService.getUserById(userId)

        if (user) {
            if (user.disabled) {
                console.log("User is disabled", user.id)
                return res.status(400).json({message: "User account is disabled"})
            }

            await UserService.getAndUpdateUserImageCount(user.id)

            return res.status(200).json(user)
        } else {
            const newUser = {
                token_balance: 2,
                nsfw_pass: false,
                passes: [],
                prompts: [],
                disabled: false,
                custom_attributes: {},
                email: providedUser.email,
                id: providedUser.sub,
                name: providedUser.name,
                nickname: providedUser.nickname,
                email_verified: providedUser.email_verified,
                admin: false,
                image_count: 0
            }

            await UserService.saveUser(newUser)

            return res.status(200).json(newUser)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

router.patch("/api/user/disable", async (req, res) => {
    // TODO Disable user
})

router.patch("/api/user/sign-disclaimer", async (req, res) => {
    // TODO Disable user
    const {userId} = req.body; // Get userId from URL

    try {
        const user = await UserService.getUserById(userId)

        if (user) {
            user.disclaimer_signed = true
            user.disclaimer_signed_on_date = new Date().toDateString()

            await UserService.saveUser(user)

            return res.status(200).json({
                success: true,
                message: "Disclaimer signed"
            })
        } else {
            return res.status(201).json({
                success: false,
                message: "Action aborted.  User not found."
            })
        }
    } catch (error) {
        return res.status(400).json("There was an error completing your request.")
    }
})

export {router}