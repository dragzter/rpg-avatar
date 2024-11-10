import mongoose from "mongoose";

const { Schema } = mongoose;

export const TokenCodeSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: false,
        },
        redeemed_at: {
            type: String,
            required: false,
        },
        redeemed: {
            type: Boolean,
            required: false,
        },
        token_value: {
            type: Number,
            required: false,
        },
    },
    { collection: "token_codes" }
);

export const PassCodeSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: false,
        },
        redeemed_at: {
            type: String,
            required: false,
        },
        redeemed: {
            type: Boolean,
            required: true,
        },
        pass_id: {
            type: String,
            required: false,
        },
    },
    { collection: "pass_codes" }
);

const FluxPro11UltraSchema = new Schema({
    prompt: {
        type: String,
        required: false,
    },
    output_format: {
        type: String,
        required: false,
    },
    aspect_ratio: {
        type: String,
        required: false,
    },
    safety_tolerance: {
        type: Number,
        required: false,
    },
    raw: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const FluxPro11Schema = new Schema({
    prompt: {
        type: String,
        required: false,
    },
    disable_safety_checker: {
        type: Boolean,
        required: false,
    },
    output_quality: {
        type: Number,
        required: false,
    },
    output_format: {
        type: String,
        required: false,
    },
    width: {
        type: Number,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    aspect_ratio: {
        type: String,
        required: false,
    },
    safety_tolerance: {
        type: Number,
        required: false,
    },
    prompt_upsampling: {
        type: Boolean,
        required: false,
    },
});

const FluxSchnellSchema = new Schema({
    prompt: {
        type: String,
        required: false,
    },
    go_fast: {
        type: Boolean,
        required: false,
    },
    width: {
        type: Number,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    megapixels: {
        type: String,
        required: false,
    },
    num_outputs: {
        type: Number,
        required: false,
    },
    aspect_ratio: {
        type: String,
        required: false,
    },
    output_format: {
        type: String,
        required: false,
    },
    output_quality: {
        type: Number,
        required: false,
    },
    num_inference_steps: {
        type: Number,
        required: false,
    },
    disable_safety_checker: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const FluxProSchema = new Schema({
    prompt: {
        type: String,
        required: false,
    },
    disable_safety_checker: {
        type: Boolean,
        required: false,
    },
    output_quality: {
        type: Number,
        required: false,
    },
    output_format: {
        type: String,
        required: false,
    },
    steps: {
        type: Number,
        required: false,
    },
    width: {
        type: Number,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    guidance: {
        type: Number,
        required: false,
    },
    interval: {
        type: Number,
        required: false,
    },
    aspect_ratio: {
        type: String,
        required: false,
    },
    safety_tolerance: {
        type: Number,
        required: false,
    },
    prompt_upsampling: {
        type: Boolean,
        required: false,
    },
});

export const GalleryImageSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        prompt_id: {
            type: String,
            required: true,
        },
        file_key: {
            type: String,
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "gallery" }
);

export const TokenTrackingSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    grantedOn: { type: Date, default: Date.now },
});

// This is based on a typescript type in types.ts in the client folder.
export const PromptSchema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        prompt_id: {
            type: String,
            required: true,
        },
        published_images: {
            type: Array,
            required: false,
            default: [],
        },
        prompt: {
            type: String,
            required: false,
        },
        archetype: {
            type: String,
            required: false,
        },
        art_style: {
            type: String,
            required: false,
        },
        preset: {
            type: Boolean,
            required: false,
        },
        rpg_presets: {
            type: Boolean,
            required: false,
        },
        nsfw_pass: {
            type: Boolean,
            required: false,
        },
        size: {
            width: {
                type: Number,
                required: false,
            },
            height: {
                type: Number,
                required: false,
            },
        },
        negative_prompt: {
            type: String,
            required: false,
        },
        steps: {
            type: Number,
            required: false,
        },
        file_names: {
            type: Array,
            required: false,
        },
        model: {
            type: String,
            required: false,
        },
        count: {
            type: Number,
            required: false,
        },
        thumbnails: {
            type: Array,
            required: false,
        },
        adherence: {
            type: Number,
            required: false,
        },
        created: {
            type: Date,
            default: Date.now,
        },
        flux_pro: {
            type: FluxProSchema,
            required: false,
        },
        flux_schnell: {
            type: FluxSchnellSchema,
            required: false,
        },
        flux_11_pro: {
            type: FluxPro11Schema,
            required: false,
        },
        flux_pro_ultra: {
            type: FluxPro11UltraSchema,
            required: false,
        },
    },
    { collection: "prompts" }
);

export const ImagesSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
});

export const PassSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
});

export const DeletionRequestSchema = new mongoose.Schema({
    confirmationCode: String,
    userId: String,
    status: { type: String, default: "Pending" }, // You can update this later as 'In Progress', 'Completed', etc.
    createdAt: { type: Date, default: Date.now },
});

export const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        facebook_user_id: {
            type: String,
            required: false,
        },
        id: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        image_storage_cap: {
            type: Number,
            required: false,
            default: 400,
        },
        token_balance: {
            type: Number,
            required: true,
        },
        nsfw_pass: {
            type: Boolean,
            default: false,
        },
        passes: {
            type: [PassSchema],
            required: false,
            default: [],
        },
        email_verified: {
            type: Boolean,
            required: false,
        },
        picture: {
            type: String,
            required: false,
        },
        nickname: {
            type: String,
            required: false,
        },
        custom_attributes: {
            type: Object,
            required: false,
        },
        disabled: {
            type: Boolean,
            required: false,
        },
        admin: {
            type: Boolean,
            required: false,
        },
        disclaimer_signed: {
            type: Boolean,
            default: false,
        },
        image_count: {
            type: Number,
            required: false,
        },
        disclaimer_signed_on_date: {
            type: String,
            required: false,
        },
    },
    { collection: "users" }
);
