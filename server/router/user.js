import express from "express";
import UserService from "../services/user-service.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import {
    DeletionRequestModel,
    GalleryImageModel,
    PromptModel,
} from "../db/model.js";
import BackblazeStorageService from "../services/backblaze-storage-service.js";

const router = express.Router();

/**
 * Function to parse the signed request from Facebook. This
 * ensures the request was sent by Facebook.
 */
function parseSignedRequest(signed_request) {
    const [encodedSig, payload] = signed_request.split(".", 2);
    const secret = process.env.FACEBOOK_APP_SECRET;

    const sig = base64UrlDecode(encodedSig);
    const data = JSON.parse(base64UrlDecode(payload));

    // Verify the signature
    const expectedSig = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("base64");
    if (sig !== expectedSig) {
        throw new Error("Invalid signature");
    }

    return data;
}

/**
 * Helper function to decode base64 URLs.
 */
function base64UrlDecode(input) {
    return Buffer.from(
        input.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
    ).toString("utf8");
}

/**
 * Data Deletion Callback Route Handles Facebook
 * data deletion requests.
 */
router.post("/api/facebook/data-deletion-callback", async (req, res) => {
    const { signed_request } = req.body;

    console.log("Data deletion request received:", signed_request, req.body);

    try {
        // Step 1: Parse the signed request to get the Facebook user ID
        const data = parseSignedRequest(signed_request);

        console.log(data, "data");

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
        return res
            .status(500)
            .json({ message: "Failed to process data deletion request" });
    }
});

/**
 * Data Deletion Status Check Route Allows users to check the status of
 * their data deletion request by confirmation code.
 */
router.get("/api/deletion-status/:confirmationCode", async (req, res) => {
    const { confirmationCode } = req.params;

    try {
        // Step 1: Find the deletion request by the confirmation code
        const deletionRequest = await DeletionRequestModel.findOne({
            confirmationCode,
        });

        if (!deletionRequest) {
            return res
                .status(404)
                .json({ message: "Deletion request not found" });
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
        return res
            .status(500)
            .json({ message: "Failed to retrieve deletion status" });
    }
});

router.post("/api/user", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "User object not sent." });
        }
        const userObject = { ...req.body };
        userObject.local_id = uuidv4(); // Save user with new local id
        return await UserService.saveUser(userObject);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post("/api/user/delete", async (req, res) => {
    try {
        console.log(req.body, "req.body");
        if (!req.body?.userId) {
            return res.status(400).json({ error: "User id not sent." });
        }
        const { userId } = req.body;
        const response = await UserService.deleteUser(userId);

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// Log in, create new user if not found
router.post("/api/user/:userId", async (req, res) => {
    const { userId } = req.params; // Get userId from URL
    const providedUser = req.body; //

    try {
        const user = await UserService.getUserById(userId);

        if (user) {
            if (user.disabled) {
                console.log("User is disabled", user.id);
                return res
                    .status(400)
                    .json({ message: "User account is disabled" });
            }

            await UserService.getAndUpdateUserImageCount(user.id);

            return res.status(200).json(user);
        } else {
            const hasReceivedInitialTokens =
                await UserService.hasReceivedFirstTimeTokenReward(
                    providedUser.sub
                );

            const newUser = {
                token_balance: hasReceivedInitialTokens ? 0 : 10, // No initial tokens if they
                // received before
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
                image_storage_cap: 400,
            };

            if (providedUser.sub.includes("facebook")) {
                newUser.facebook_user_id = providedUser.sub.split("|")[1];
            }

            await UserService.saveUser(newUser);

            // Log initial token grant if this is their first time receiving it
            if (!hasReceivedInitialTokens) {
                await UserService.logInitialTokenGrant(providedUser.sub);
            }

            return res.status(200).json(newUser);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get("/api/prompt/:promptId", async (req, res) => {
    const { promptId } = req.params; // Get userId from URL

    try {
        const prompt = await UserService.getPromptById(promptId);

        return res.status(200).json(prompt);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post("/api/prompt/delete", async (req, res) => {
    const { prompt_id } = req.body; // Get userId from URL

    try {
        const prompt = await PromptModel.findOne({
            prompt_id,
        }).exec();

        const published_images = prompt.published_images;
        if (published_images.length > 0) {
            await GalleryImageModel.deleteMany({
                file_key: { $in: published_images },
            }).exec();
        }

        const filesToDelete = [...prompt.file_names, ...prompt.thumbnails];
        const [userResponse, backBlazeResponse] = await Promise.all([
            UserService.deletePrompt(prompt_id),
            BackblazeStorageService.deleteMany(filesToDelete, prompt.user_id),
        ]);

        return res.status(200).json({
            success: true,
            message:
                "Prompt and all associated images have been deleted successfully",
            image_count: backBlazeResponse.image_count,
            deleted_files: filesToDelete,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post("/api/prompts/delete", async (req, res) => {
    const { user_id, prompt_ids } = req.body; // Get userId from URL

    try {
        const prompts = await PromptModel.find({
            prompt_id: { $in: prompt_ids },
        }).exec();

        // Get all published images from prompts so we can delete them from the
        // gallery of published images
        const published_images_file_keys = prompts.reduce((acc, prompt) => {
            return [...acc, ...prompt.published_images];
        }, []);

        if (published_images_file_keys.length > 0) {
            await GalleryImageModel.deleteMany({
                file_key: { $in: published_images_file_keys },
            }).exec();
        }

        const file_keys = prompts.reduce((acc, prompt) => {
            return [...acc, ...prompt.file_names, ...prompt.thumbnails];
        }, []);

        const [userResponse, backBlazeResponse] = await Promise.all([
            UserService.deleteManyPrompts(prompt_ids),
            BackblazeStorageService.deleteMany(file_keys, user_id),
        ]);

        return res.status(200).json({
            success: true,
            message:
                "Prompts and all associated images have been deleted successfully",
            image_count: backBlazeResponse.image_count,
            deleted_files: file_keys,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post("/api/image/publish", async (req, res) => {
    try {
        const { prompt_id, file_key, user_id } = req.body;
        const response = await UserService.addPublishedImage({
            prompt_id,
            file_key,
            user_id,
        });
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post("/api/image/unpublish", async (req, res) => {
    try {
        const { file_key, prompt_id } = req.body;
        const response = await UserService.removePublishedImage({
            file_key,
            prompt_id,
        });

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.delete("/users/delete-empty-prompts/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await UserService.deleteEmptyPrompts(userId);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json({
                message: result.message,
                error: result.error,
            });
        }
    } catch (error) {
        console.error("Error deleting empty prompts:", error);
        res.status(500).json({
            message:
                "An error occurred while deleting empty prompts. This is likely a network" +
                " error.",
            error,
        });
    }
});

router.get("/api/user/prompts/:user_id", async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const response = await UserService.getUserPrompts(user_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.patch("/api/user/disable", async (req, res) => {
    // TODO Disable user
});

router.patch("/api/user/sign-disclaimer", async (req, res) => {
    // TODO Disable user
    const { userId } = req.body; // Get userId from URL

    try {
        const user = await UserService.getUserById(userId);

        if (user) {
            user.disclaimer_signed = true;
            user.disclaimer_signed_on_date = new Date().toDateString();

            await UserService.saveUser(user);

            return res.status(200).json({
                success: true,
                message: "Disclaimer signed",
            });
        } else {
            return res.status(201).json({
                success: false,
                message: "Action aborted.  User not found.",
            });
        }
    } catch (error) {
        return res
            .status(400)
            .json("There was an error completing your request.");
    }
});

export { router };
