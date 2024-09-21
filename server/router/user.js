import express from "express"
import UserService from "../services/user-service.js";
import {v4 as uuidv4} from "uuid"
import crypto from "crypto"
import {DeletionRequestModel} from "../db/model.js";

const router = express.Router();

/**
 * Function to parse the signed request from Facebook.
 * This ensures the request was sent by Facebook.
 */
function parseSignedRequest(signed_request) {
    const [encodedSig, payload] = signed_request.split('.', 2);
    const secret = process.env.FACEBOOK_APP_SECRET;

    const sig = base64UrlDecode(encodedSig);
    const data = JSON.parse(base64UrlDecode(payload));

    // Verify the signature
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('base64');
    if (sig !== expectedSig) {
        throw new Error('Invalid signature');
    }

    return data;
}

/**
 * Helper function to decode base64 URLs.
 */
function base64UrlDecode(input) {
    return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}


/**
 * Data Deletion Callback Route
 * Handles Facebook data deletion requests.
 */
router.post("/api/facebook/data-deletion-callback", async (req, res) => {
    const { signed_request } = req.body;

    console.log("Data deletion request received:", signed_request, req.body);

    try {
        // Step 1: Parse the signed request to get the Facebook user ID
        const data = parseSignedRequest(signed_request);

        console.log(data, "data")

        if (!!data?.user_id) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const facebookUserId = data.user_id; // Extracted Facebook user ID

        // Step 2: Delete the user data from MongoDB (using the Facebook user ID)
        const deleteUserResult = await UserService.deleteFBUser(facebookUserId); // Ensure UserService.deleteUser deletes by Facebook user_id

        if (!deleteUserResult) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step 3: Generate a confirmation code and save the deletion request
        const confirmationCode = uuidv4();
        const deletionRequest = new DeletionRequestModel({
            confirmationCode,
            userId: facebookUserId,
            status: "Deleted",
        });

        await deletionRequest.save();

        const statusUrl = `https://rpgavatar.com/deletion-status/${confirmationCode}`;
        return res.json({
            url: statusUrl,
            confirmation_code: confirmationCode,
        });

    } catch (error) {
        console.error("Error processing data deletion request:", error);
        return res.status(500).json({ message: "Failed to process data deletion request" });
    }
});


/**
 * Data Deletion Status Check Route
 * Allows users to check the status of their data deletion request by confirmation code.
 */
router.get("/api/deletion-status/:confirmationCode", async (req, res) => {
    const { confirmationCode } = req.params;

    try {
        // Step 1: Find the deletion request by the confirmation code
        const deletionRequest = await DeletionRequestModel.findOne({ confirmationCode });

        if (!deletionRequest) {
            return res.status(404).json({ message: "Deletion request not found" });
        }

        // Step 2: Return the status of the deletion request
        return res.status(200).json({
            confirmationCode: deletionRequest.confirmationCode,
            userId: deletionRequest.userId,
            status: deletionRequest.status,
            createdAt: deletionRequest.createdAt,
        });

    } catch (error) {
        console.error("Error fetching deletion status:", error);
        return res.status(500).json({ message: "Failed to retrieve deletion status" });
    }
});


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

router.post("/api/user/delete", async (req, res) => {
    try {
        console.log(req.body, "req.body")
        if (!req.body?.userId) {
            return res.status(400).json({error: "User id not sent."});
        }
        const {userId} = req.body;
        const response = await UserService.deleteUser(userId)

        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})


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
                email: providedUser.email || "No email provided",
                id: providedUser.sub,
                name: providedUser.name,
                nickname: providedUser.nickname,
                email_verified: providedUser.email_verified,
                admin: false,
                image_count: 0,
                image_storage_cap: 300
            }

            if (providedUser.sub.includes("facebook")) {
                newUser.facebook_user_id = providedUser.sub.split("|")[1]
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