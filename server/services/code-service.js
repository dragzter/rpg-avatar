import {PassCodeModel, TokenCodeModel, UserModel} from "../db/model.js";
import UserService from "./user-service.js";

class CodeService {
    ADMIN_IDS = []

    constructor() {
        this.ADMIN_IDS = process.env.ADMIN_IDS.split(",");
    }

    /**
     * Add a list of codes to the database - This is an admin-only operation
     * @param code_list {string[]} - List of codes to add
     * @param type {string} - Type of code
     * @param code_value {number} - Value of
     * @param pass_id the code id "NSFW", "FaceCrunch" etc.
     * @param admin_id {string} - Admin ID to authorize the code
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async addCodes({code_list, code_value, admin_id, type, pass_id}) {
        try {
            //console.log({code_list, code_value, admin_id, type, pass_id})

            //console.log(this.ADMIN_IDS, "this.ADMIN_IDS");
            if (!this.ADMIN_IDS.includes(admin_id)) {
                return {
                    success: false,
                    message: "You are not authorized to add codes."
                }
            }

            // Define the operations for each code type
            const code_operations = {
                token: async () => {
                    const token_code_list = code_list.map(code => ({
                        code: code.trim(),
                        redeemed: false,
                        user_id: "",
                        redeemed_at: "",
                        token_value: parseInt(code_value)
                    }));

                    try {
                        await TokenCodeModel.insertMany(token_code_list);
                        return {
                            success: true,
                            message: "Token Codes successfully added."
                        }
                    } catch {
                        return {
                            success: false,
                            message: "Error saving codes."
                        }
                    }
                },
                pass: async () => {
                    const pass_code_list = code_list.map(code => ({
                        code: code.trim(),
                        redeemed: false,
                        user_id: "",
                        redeemed_at: "",
                        pass_id: pass_id
                    }));

                    try {
                        await PassCodeModel.insertMany(pass_code_list);
                        return {
                            success: true,
                            message: "Pass Codes successfully added."
                        }
                    } catch {
                        return {
                            success: false,
                            message: "Error saving codes."
                        }
                    }
                }
            }

            if (type && code_operations[type]) {
                return await code_operations[type]();
            } else {
                return {
                    success: false,
                    message: "Invalid code type."
                }
            }

        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "Error adding codes."
            }
        }
    }

    /**
     *
     * @param code - Code to redeem
     * @param user_id - User ID to assign the code to
     * @param type
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async redeemCode({code, user_id, type}) {
        try {
            console.log({code, user_id, type}, "redeemCode");
            const user = await UserModel.findOne({id: user_id}).exec();

            if (!user) {
                console.log("User not found");
                return {
                    success: false,
                    message: "User not found."
                }
            }

            const code_redemption_operation = {
                token: async () => {
                    const code_doc = await TokenCodeModel.findOne({code}).exec();

                    if (!code_doc) {
                        console.log("Token code not found");
                        return {
                            success: false,
                            message: "Token Code not found."
                        }
                    }


                    if (code_doc?.redeemed) {
                        console.log("Token code already redeemed");
                        const redemption_date = code_doc?.redeemed_at || "((an unknown date))";

                        return {
                            success: false,
                            message: `Token Code already redeemed on ${redemption_date}.`
                        }
                    }

                    // Update the user's token balance
                    user.token_balance += code_doc.token_value;

                    code_doc.redeemed = true;
                    code_doc.user_id = user_id;
                    code_doc.redeemed_at = new Date().toLocaleString();

                    // Save the user and the code
                    await Promise.all([user.save(), code_doc.save()]);

                    console.log(`Redeemed ${code} for ${code_doc.token_value} tokens`);
                    return {
                        success: true,
                        token_balance: user.token_balance,
                        passes: user.passes,
                        amount_redeemed: code_doc.token_value,
                        message: `Token Code successfully redeemed for ${code_doc.token_value} tokens.`
                    }
                },
                pass: async () => {
                    const code_doc = await PassCodeModel.findOne({code}).exec();

                    if (!code_doc) {
                        console.log("Pass code not found");
                        return {
                            success: false,
                            message: "Pass Code not found."
                        }
                    }

                    if (code_doc?.redeemed) {
                        console.log("Pass code already redeemed");
                        const redemption_date = code_doc?.redeemed_at || "((an unknown date))";

                        return {
                            success: false,
                            message: `Pass Code already redeemed on ${redemption_date}.`
                        }
                    }

                    user.passes.push({
                        id: code_doc.pass_id,

                    });
                    code_doc.redeemed = true;
                    code_doc.user_id = user_id;
                    code_doc.redeemed_at = new Date().toLocaleString();

                    try {
                        await Promise.all([user.save(), code_doc.save()]);
                    } catch (error) {
                        return {
                            success: false,
                            message: "Error saving to DB."
                        }
                    }

                    return {
                        success: true,
                        passes: user.passes,
                        message: `(${code_doc.pass_id}) Pass Code successfully redeemed.`
                    }
                }
            }


            if (type && code_redemption_operation[type]) {
                return await code_redemption_operation[type]();
            } else {
                console.log("Invalid code type.");
                return {
                    success: false,
                    message: "Invalid code type."
                }
            }

        } catch (error) {
            console.log("Server Error", error);
            return {
                success: false,
                message: "Error redeeming code.  This is likely an issue with the database."
            }
        }
    }

    async getCodes(type) {
        try {
            const code_retrieval_operation = {
                token: async () => {
                    try {
                        // Find all token codes regardless of user
                        const codes = await TokenCodeModel
                            .find()
                            .exec();

                        console.log(codes);
                        return {
                            success: true,
                            codes
                        };
                    } catch (error) {
                        console.log(error);
                        return {
                            success: false,
                            message: "Error retrieving token codes."
                        };
                    }
                },
                pass: async () => {
                    try {
                        // Find all pass codes regardless of user
                        const codes = await PassCodeModel
                            .find() // Retrieve only redeemed codes, if necessary
                            .exec();

                        console.log(codes);
                        return {
                            success: true,
                            codes
                        };
                    } catch (error) {
                        console.log(error);
                        return {
                            success: false,
                            message: "Error retrieving pass codes."
                        };
                    }
                }
            };

            // Execute the operation based on type (either 'token' or 'pass')
            if (code_retrieval_operation[type]) {
                return await code_retrieval_operation[type]();
            } else {
                return {
                    success: false,
                    message: "Invalid code type provided."
                };
            }

        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "Error retrieving codes."
            };
        }
    }

    async assignPurchasedTokensToUser(userId, tokensToAdd) {
        try {

            const user = await UserService.getUserById(userId);
            if (!user) {
                return {
                    message: "User not found",
                    success: false
                };
            }

            user.token_balance += tokensToAdd;
            await UserService.saveUser(user);

            return {
                message: "Tokens purchased successfully.",
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

export default CodeService