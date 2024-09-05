import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";
import UserService from "./user-service.js"; // Assuming you have a User model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CodeRedemptionService {
    constructor() {
        this.CODES_PATH = path.join(__dirname, "../keys/codes.json");
        this.CODES = this.getCodes();
    }

    // Load the codes from the JSON file
    getCodes() {
        const data = fs.readFileSync(this.CODES_PATH, "utf8");
        return JSON.parse(data).keys;
    }

    // Save the updated codes back to the JSON file
    updateCodeFile(codes) {
        const data = JSON.stringify({keys: codes}, null, 2);
        fs.writeFileSync(this.CODES_PATH, data, "utf8");
    }

    // Check if the code exists, then remove it
    isValidCode(code) {
        const index = this.CODES.indexOf(code);
        if (index !== -1) {
            this.CODES.splice(index, 1); // Remove the code from the list
            this.updateCodeFile(this.CODES); // Update the JSON file
            return true;
        }
        return false;
    }

    // Add tokens to the user
    async assignTokensToUser(userId, tokensToAdd) {

        const user = await UserService.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Update the token balance
        user.token_balance += tokensToAdd;
        await UserService.saveUser(user);

        return user.token_balance;
    }
}

export default new CodeRedemptionService();
