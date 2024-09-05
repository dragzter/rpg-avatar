import express from "express"
import UserService from "../services/user-service.js";
import {v4 as uuidv4} from "uuid"
import CodeRedemptionService from "../services/code-redemption-service.js";

const router = express.Router();

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

    console.log(req.body)
    try {
        const user = await UserService.getUserById(userId)


        if (user) {
            console.log("got one!")
            if (user.disabled) {
                console.log("User is disabled", user.id)
                return res.status(400).json({message: "User account is disabled"})
            }

            return res.status(200).json(user)
        } else {
            console.log("gonna have to make one")

            const newUser = {
                token_balance: 1,
                nsfw_pass: false,
                prompts: [],
                disabled: false,
                custom_attributes: {},
                email: providedUser.email,
                id: providedUser.sub,
                name: providedUser.name,
                nickname: providedUser.nickname,
                email_verified: providedUser.email_verified
            }

            console.log(newUser)
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

router.patch("/api/redeem", async (req, res) => {
    const {code, userId} = req.body;
    const TOKEN_AWARD = 100


    try {
        if (!code || code === " ") {
            return res.status(400).json({
                message: `No code provided.`,
                success: false
            });
        }

        // Check if the code is valid and remove it if it is
        const isValid = CodeRedemptionService.isValidCode(code);


        if (!isValid) {
            return res.status(400).json({
                message: `The provided code '${code}' is invalid`,
                success: false
            });
        }

        // Assign tokens to the user (e.g., 100 tokens for a valid code)
        const newBalance = await CodeRedemptionService.assignTokensToUser(userId, TOKEN_AWARD);

        return res.status(200).json({
            message: "Code redeemed successfully",
            success: true,
            newBalance: newBalance
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error redeeming code",
            error: error.message
        });
    }
});

export {router}