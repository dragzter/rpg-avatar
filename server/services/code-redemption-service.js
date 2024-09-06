import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";
import UserService from "./user-service.js"; // Assuming you have a User model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CodeRedemptionService {
    constructor() {
        this.CODES_PATHS = {
            tokens: path.join(__dirname, "../keys/codes.json"),
            nsfw: path.join(__dirname, "../keys/nsfw-codes.json")
        };
        this.CODES = {
            tokens: this.getCodes('tokens'),
            nsfw: this.getCodes('nsfw')
        };
    }

    // Load the codes from the JSON files
    getCodes(type) {
        const filePath = this.CODES_PATHS[type];
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data).keys;
    }

    // Save the updated codes back to the JSON file
    updateCodeFile(type, codes) {
        const filePath = this.CODES_PATHS[type];
        const data = JSON.stringify({keys: codes}, null, 2);
        fs.writeFileSync(filePath, data, "utf8");
    }

    // Check if the code exists, then remove it
    isValidCode(code, type) {
        const codes = this.CODES[type];
        const index = codes.indexOf(code);
        if (index !== -1) {
            codes.splice(index, 1); // Remove the code from the list
            this.updateCodeFile(type, codes); // Update the JSON file
            return true;
        }
        return false;
    }

    async assignTokensToUser(userId, tokensToAdd) {
        try {

            const user = await UserService.getUserById(userId);
            if (!user) {
                return {
                    message: "User not found",
                    success: false
                };
            }

            console.log("got this far", user)
            user.token_balance += tokensToAdd;
            await UserService.saveUser(user);

            return {
                message: "Code redeemed successfully.",
                success: true,
                token_balance: user.token_balance
            }
        } catch (error) {
            return {
                message: "Token balance update failed.",
                success: false,
                error: error.message,
            }
        }
    }

    async grantNSFWAccess(userId) {
        try {
            const user = await UserService.getUserById(userId);

            if (!user) {
                return {
                    message: "User not found",
                    success: false
                };
            }

            user.nsfw_pass = true;
            await UserService.saveUser(user);

            return {
                nsfw_pass: user.nsfw_pass,
                message: "NSFW content enabled.",
                success: true
            };
        } catch (error) {
            return {
                message: "NSFW update failed.",
                success: false,
                error: error.message,
            }
        }
    }

}

export default new CodeRedemptionService();
