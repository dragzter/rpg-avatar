import {PromptModel, UserModel} from "../db/model.js";
import BackblazeStorageService from "./backblaze-storage-service.js";

class UserService {
    async getUserById(userId) {
        return await UserModel.findOne({id: userId}).exec();
    }


    async findAndUpdateUser(userId, updatedUserObject) {
        try {
            return UserModel.findOneAndUpdate({id: userId}, updatedUserObject, {new: true});
        } catch (err) {
            console.log(err)
        }
    }

    async saveUser(user) {
        try {
            const _user = new UserModel(user);
            await _user.save();
        } catch (err) {
            console.log(err)
        }
    }

    async getAndUpdateUserImageCount(user_id) {
        try {
            const image_count = await BackblazeStorageService.getUserImageCount(user_id);
            await UserModel.updateOne(
                {id: user_id},
                {$set: {image_count}}
            );
        } catch (error) {
            console.error("Error updating user image count:", error);
        }
    }

    // Deprecated - this is not a reliable way to get image counts.  Need to get from
    // bucket
    async updateUserImageCount(user_id) {
        try {
            console.log("updating images")
            // Fetch all prompts for the user
            const prompts = await PromptModel.find({user_id}).exec();

            // Calculate the total number of images across all prompts
            const image_count = prompts.reduce((total, promptItem) => {
                return total + (promptItem.file_names?.length || 0);
            }, 0);

            // Patch the user with the new image count
            console.log("Updating image count:", image_count);
            await UserModel.updateOne(
                {id: user_id},
                {$set: {image_count}}
            );
        } catch (error) {
            console.error("Error updating user image count:", error);
        }
    }

    async savePrompt(userPrompt) {
        try {
            const _prompt = new PromptModel(userPrompt)
            await _prompt.save()
        } catch (err) {
            console.log(err)
        }
    }
}

export default new UserService()