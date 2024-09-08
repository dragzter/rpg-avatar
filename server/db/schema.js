import mongoose from "mongoose";

const {Schema} = mongoose;

// This is based on a typescript type in types.ts in the client folder.
export const PromptSchema = new Schema({
    prompt: {type: String, required: true},
    archetype: {type: String, required: true},
    user_id: {type: String, required: true},
    art_style: {type: String, required: false},
    date: {type: String, required: true},
    size: {
        width: {type: Number, required: false},
        height: {type: Number, required: false},
    },
    negative_prompt: {type: String, required: false},
    steps: {type: Number, required: false},
    adherence: {type: Number, required: false},
}, {collection: "prompts"});


export const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    }, // The ID the user came with (auth0 user.sub, starts with auth0|...)
    email: {
        type: String,
        required: true,
    },
    token_balance: {
        type: Number,
        required: true,
    },
    nsfw_pass: {
        type: Boolean,
        default: false,
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
        default: false
    },
    disclaimer_signed_on_date: {
        type: String,
        required: false,
    }
}, {collection: "users"});

