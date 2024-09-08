export interface Product {
    active: boolean;
    attributes: Record<string, string>[];
    created: number;
    default_price: string;
    description: string;
    id: string;
    images: string[];
    livemode: boolean;
    marketing_features: Record<string, string>[];
    metadata: Record<string, string>;
    name: string;
    object: string;
    package_dimensions?: string;
    shippable?: boolean;
    statement_descriptor: null;
    tax_code?: Record<string, string>;
    type: string;
    unit_label?: string;
    updated: number;
    url?: string;
}

export interface Price {
    id: string;
    object: string;
    active: boolean;
    billing_scheme: "per_unit" | string;
    created: number;
    currency: string;
    custom_unit_amount: null | unknown;
    livemode: boolean;
    lookup_key: null | string;
    metadata: Record<string, unknown>;
    nickname: null | string;
    product: string;
    recurring: {
        aggregate_usage: null | string;
        interval: "day" | "week" | "month" | "year";
        interval_count: number;
        trial_period_days: null | number;
        usage_type: "licensed" | "metered";
    };
    tax_behavior: "inclusive" | "exclusive" | "unspecified";
    tiers_mode: null | string;
    transform_quantity: null | unknown;
    type: "recurring" | "one_time";
    unit_amount: number;
    unit_amount_decimal: string;
}

export interface ProductEnhanced {
    id: string;
    price: string;
    priceId: string;
    name: string;
    description: string;
    images: string[];
    active: boolean;
    metadata: Record<string, string>;
}

export interface UserAIPrompt {
    prompt: string;
    archetype: string;
    nsfw_pass: boolean;
    user_id: string;

    art_style?: string;
    model?: string;
    count?: number;
    size?: {
        width: number; // 1024
        height: number; // 1024
    };
    size_label?: string; // e.g. "1024x1024
    negative_prompt?: string;
    steps?: number;
    adherence?: number;
}

export interface NovitaImg {
    image_url: string;
    image_type: string;
    image_url_ttl: string;
    nsfw_detection_result: null;
}

export interface ImageGenResponse {
    images: NovitaImg[];
    success: boolean;
    message: string;
    new_token_balance: number;
}

export interface ImageTaskStartedResponse {
    task_id?: string;
    success: boolean;
    message: string;
}

interface SavedUserPrompts
    extends Pick<
        UserAIPrompt,
        | "prompt"
        | "archetype"
        | "size"
        | "negative_prompt"
        | "steps"
        | "adherence"
    > {}

export interface RPGAvatarUser {
    name: string;
    id: string; // The ID the user came with
    email: string;
    token_balance: number;
    nsfw_pass: boolean;
    disclaimer_signed: boolean;
    disclaimer_signed_on_date: string;

    email_verified?: boolean;
    picture?: string;
    nickname?: string;
    prompts?: SavedUserPrompts;
    custom_attributes?: Record<string, unknown>;
    disabled?: boolean;
    admin?: boolean;
}

export interface RedeemAPIResponse {
    message: string;
    success: boolean;
    error?: string;
    token_balance?: number;
    nsfw_pass?: boolean;
}

export const RedemptionType = {
    nsfw: "nsfw",
    tokens: "tokens",
};
