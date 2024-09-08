import {PromptModel, UserModel} from "../db/model.js";

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