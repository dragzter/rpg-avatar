import mongoose from "mongoose"
import {PromptSchema, UserSchema} from "./schema.js"


export const UserModel = mongoose.model("User", UserSchema);
export const PromptModel = mongoose.model("Prompt", PromptSchema)

