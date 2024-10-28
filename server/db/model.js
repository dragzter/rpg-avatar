import mongoose from "mongoose";
import {
    DeletionRequestSchema,
    GalleryImageSchema,
    PassCodeSchema,
    PromptSchema,
    TokenCodeSchema,
    TokenTrackingSchema,
    UserSchema,
} from "./schema.js";

export const UserModel = mongoose.model("User", UserSchema);
export const TokenTrackingModel = mongoose.model(
    "TokenTracking",
    TokenTrackingSchema
);
export const PromptModel = mongoose.model("Prompt", PromptSchema);
export const PassCodeModel = mongoose.model("PassCode", PassCodeSchema);
export const TokenCodeModel = mongoose.model("TokenCode", TokenCodeSchema);
export const DeletionRequestModel = mongoose.model(
    "DeletionRequest",
    DeletionRequestSchema
);
export const GalleryImageModel = mongoose.model(
    "GalleryImageSchema",
    GalleryImageSchema
);
