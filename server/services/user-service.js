import {
    GalleryImageModel,
    PromptModel,
    TokenTrackingModel,
    UserModel,
} from "../db/model.js";
import BackblazeStorageService from "./backblaze-storage-service.js";
import { v4 as uuidv4 } from "uuid";
import { excerpt } from "../utils/helpers.js";

class UserService {
    models = {
        flux_pro: "flux_pro",
        flux_dev: "flux_dev",
        flux_11_pro: "flux_11_pro",
        flux_schnell: "flux_schnell",
    };

    async getUserById(userId) {
        return await UserModel.findOne({ id: userId }).exec();
    }

    async findAndUpdateUser(userId, updatedUserObject) {
        try {
            return UserModel.findOneAndUpdate(
                { id: userId },
                updatedUserObject,
                { new: true }
            );
        } catch (err) {
            console.log(err);
        }
    }

    async saveUser(user) {
        try {
            const _user = new UserModel(user);
            await _user.save();
        } catch (err) {
            console.log(err);
        }
    }

    async getAndUpdateUserImageCount(user_id) {
        try {
            const image_count =
                await BackblazeStorageService.getUserImageCount(user_id);
            await UserModel.updateOne(
                { id: user_id },
                { $set: { image_count } }
            );

            return image_count;
        } catch (error) {
            console.error("Error updating user image count:", error);
        }
    }

    // Deprecated - this is not a reliable way to get image counts.  Need to get from
    // bucket
    async updateUserImageCount(user_id) {
        try {
            console.log("updating images");
            // Fetch all prompts for the user
            const prompts = await PromptModel.find({ user_id }).exec();

            // Calculate the total number of images across all prompts
            const image_count = prompts.reduce((total, promptItem) => {
                return total + (promptItem.file_names?.length || 0);
            }, 0);

            // Patch the user with the new image count
            console.log("Updating image count:", image_count);
            await UserModel.updateOne(
                { id: user_id },
                { $set: { image_count } }
            );
        } catch (error) {
            console.error("Error updating user image count:", error);
        }
    }

    async getUserPrompts(user_id) {
        try {
            const response = await PromptModel.find({ user_id }).exec();
            return response
                .sort((a, b) => new Date(b.created) - new Date(a.created))
                .map((p) => {
                    const aggregate = {
                        prompt_id: p.prompt_id,
                        created: p.created,
                        thumbnails: p.thumbnails,
                        published_images: p.published_images,
                    };

                    // find out of the prompt contains any one of the properties in models
                    const model = Object.keys(this.models).find(
                        (key) => p[key]
                    );

                    const prompt_text = model ? p[model].prompt : p.prompt;
                    aggregate.prompt_excerpt = excerpt(prompt_text, 30);

                    return aggregate;
                });
        } catch (err) {
            console.log(err);
        }
    }

    async getPromptById(promptId) {
        try {
            const _p = await PromptModel.findOne({
                prompt_id: promptId,
            }).exec();
            const model = Object.keys(this.models).find((key) => _p[key]);

            if (model) {
                _p.prompt = _p[model].prompt;
                _p.size = {
                    width: _p[model].width,
                    height: _p[model].height,
                };
                _p.adherence = _p[model].guidance;
                _p.model = model;
            }

            return _p;
        } catch (err) {
            console.log(err);
        }
    }

    async savePrompt(userPrompt) {
        try {
            const user = await this.getUserById(userPrompt.user_id);

            if (user.image_count < user.image_storage_cap || user.admin) {
                // Admin has no cap
                const _prompt = new PromptModel(userPrompt);
                await _prompt.save();
            }
        } catch (err) {
            console.log(err);
        }
    }

    async addPublishedImage({ user_id, prompt_id, file_key }) {
        try {
            // Add the file key to the prompt's published images
            const prompt = await this.getPromptById(prompt_id);
            const existingImage = await GalleryImageModel.findOne({
                file_key,
            }).exec();

            if (prompt.published_images.includes(file_key) || existingImage) {
                console.log("already puiblished");
                return {
                    success: false,
                    message: "Image already published",
                };
            }

            prompt.published_images.push(file_key);
            await prompt.save();

            await new GalleryImageModel({
                id: uuidv4(),
                user_id,
                prompt_id,
                file_key,
            }).save();

            return {
                success: true,
                message: "Published image added",
            };
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: "Failed to add published image",
                error,
            };
        }
    }

    async removePublishedImage({ file_key, prompt_id }) {
        try {
            const image = await GalleryImageModel.findOne({
                file_key,
            }).exec();

            if (!image) {
                return {
                    success: false,
                    message: "Image not found",
                };
            }
            console.log("Unpublishing image", file_key);

            const prompt = await this.getPromptById(prompt_id);
            prompt.published_images = prompt.published_images.filter(
                (image) => image !== file_key
            );
            await prompt.save();

            await GalleryImageModel.deleteOne({
                file_key,
            }).exec();

            return {
                success: true,
                message: "Published image removed",
            };
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: "Failed to remove published image",
                error,
            };
        }
    }

    // Check if a user has previously received initial tokens
    async hasReceivedFirstTimeTokenReward(userId) {
        try {
            const record = await TokenTrackingModel.findOne({ userId });
            return record !== null; // Returns true if the user has a record
        } catch (error) {
            console.error("Error checking token grant status:", error);
            throw error;
        }
    }

    // Log the user's initial token grant
    async logInitialTokenGrant(userId) {
        try {
            await TokenTrackingModel.create({ userId });
        } catch (error) {
            console.error("Error logging initial token grant:", error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            // delete images and prompts
            await Promise.all([
                PromptModel.deleteMany({ user_id: userId }).exec(),
                BackblazeStorageService.deleteAllInFolder(userId),
            ]);

            return await UserModel.deleteOne({ id: userId }).exec();
        } catch (err) {
            console.log(err);
        }
    }

    async deletePrompt(promptId) {
        try {
            const response = await PromptModel.deleteOne({
                prompt_id: promptId,
            }).exec();
            return {
                message: "Prompt deleted",
                success: true,
                response,
            };
        } catch (error) {
            return {
                message: "Prompt deletion failed",
                success: false,
                error,
            };
        }
    }

    async deleteManyPrompts(promptIds) {
        try {
            // Delete multiple prompts by their IDs
            const response = await PromptModel.deleteMany({
                prompt_id: { $in: promptIds },
            }).exec();

            return {
                message: "Prompts deleted",
                success: true,
                response,
            };
        } catch (error) {
            return {
                message: "Prompt deletion failed",
                success: false,
                error,
            };
        }
    }

    async deleteFBUser(userId) {
        try {
            return await UserModel.deleteOne({
                facebook_user_id: userId,
            }).exec();
        } catch (err) {
            console.log(err);
        }
    }
}

export default new UserService();
