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

    rpg_presets?: boolean;
    randomize?: boolean;
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
    cost?: number;
}

export interface AiImageResponse {
    image_url: string;
    image_type: string;
    image_url_ttl: string;
    nsfw_detection_result: null;
}

export interface ImageGenResponse {
    images: AiImageResponse[];
    success: boolean;
    message: string;
    new_token_balance: number;
}

export interface ImageTaskStartedResponse {
    task_id?: string;
    success: boolean;
    message: string;
    generated_prompt?: string;
}

export interface RPGAvatarUser {
    name: string;
    id: string; // The ID the user came with
    email: string;
    token_balance: number;
    nsfw_pass: boolean;
    disclaimer_signed: boolean;
    disclaimer_signed_on_date: string;

    image_storage_cap?: number;
    image_count?: number;
    email_verified?: boolean;
    passes?: string[];
    picture?: string;
    nickname?: string;
    custom_attributes?: Record<string, unknown>;
    disabled?: boolean;
    admin?: boolean;
}

export interface LineItem {
    price: string;
    quantity: number;
}

export interface CheckoutSessionData {
    user_id: string;
    product_id: string;
    line_items: LineItem[];
}

export interface RedeemAPIResponse {
    message: string;
    success: boolean;
    error?: string;
    amount_redeemed?: number;
    pass_redeemed?: string;
    token_balance?: number;
    nsfw_pass?: boolean;
    passes?: string[];
}

export const RedemptionType = {
    nsfw: "nsfw",
    tokens: "tokens",
};

export type ContentItem = {
    title: string;
    text: string;
    routerTo?: string;
    image?: string;
    buttonText?: string;
    imagePosition: string;
};

export interface CodesAddRequest {
    code_list: string[];
    admin_id: string;
    type: string;
    code_value: number;
    pass_id: string;
}

export interface TokenCodesResponse {}

export interface CodeRedeemRequest {
    code: string;
    user_id: string;
    type: "pass" | "token";
}

export interface UserImage {
    url: string;
    key: string;
    requested_on: string;
}

export type UserImageResponse = {
    images?: UserImage[];
    thumbnails?: UserImage[];
    requested_on?: string;
    total_images?: number;
    total_pages?: number;
    success: boolean;
};

export interface SizeOption {
    label: string;
    size?: {
        width: number;
        height: number;
    };
    ratio?: string;
    cssClass?: string;
    recommended?: boolean;
}

export type AiModel = {
    label: string;
    img: string;
    value: string;
    adherence: number[];
    size_options?: SizeOption[];
    count_option?: boolean;
    max_outputs?: number[];
    model_type?: string;
    max_img_per_request: number;
    default_img_per_request: number;
    cost: number;
    negative_prompt?: boolean;
    adherence_default?: number;
    description?: string;
    tags?: string[];
};

export interface PromptHistoryItem {
    user_id: string;
    prompt_id: string;
    prompt: string;
    archetype?: string;
    adherence?: number;
    model?: string;
    count?: number;
    nsfw_pass?: boolean;
    rpg_presets?: boolean;
    art_style?: string;
    created?: string;
    size?: {
        width: number;
        height: number;
    };
    negative_prompt?: string;
    published_images?: string[];
    thumbnails?: string[];
    file_names?: string[];
    urls?: string[];
    imgURLS?: string[];
}

// Initial response in the profile page
// All that is needed to create the grid.  Clicking on a grid item fetches the metadata.
export interface QuickPromptHistory {
    prompt_id: string;
    published_images: string[];
    prompt_excerpt: string;
    created?: string;
    thumbnails?: string[];
    urls?: string[];
}
