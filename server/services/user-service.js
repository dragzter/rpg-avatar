import { GalleryImageModel, PromptModel, UserModel } from "../db/model.js";
import BackblazeStorageService from "./backblaze-storage-service.js";
import { excerpt } from "../utils/helpers.js";
import { v4 as uuidv4 } from "uuid";

class UserService {
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
                    return {
                        prompt_id: p.prompt_id,
                        prompt_excerpt: excerpt(p.prompt, 30),
                        created: p.created,
                        thumbnails: p.thumbnails,
                        published_images: p.published_images,
                    };
                });
        } catch (err) {
            console.log(err);
        }
    }

    async getPromptById(promptId) {
        try {
            return await PromptModel.findOne({ prompt_id: promptId }).exec();
        } catch (err) {
            console.log(err);
        }
    }

    async savePrompt(userPrompt) {
        try {
            const _prompt = new PromptModel(userPrompt);
            await _prompt.save();
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

    async deleteUser(userId) {
        try {
            console.log("Deleting user", userId);
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