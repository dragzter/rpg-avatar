import type { AiModel, SizeOption, UserAIPrompt } from "@/stores/types";

export function modelRequestMapper(request) {
    let processed_request;

    const rpg_details = request.rpg_presets
        ? {
              archetype: request.archetype,
              art_style: request.art_style,
          }
        : {};

    const aspect_ratio = request.size.width !== 1024 ? "custom" : "1:1";

    const outbound = {
        flux_11_pro: {
            get: (req: UserAIPrompt) => {
                return {
                    prompt: req.prompt,
                    disable_safety_checker: true,
                    output_quality: 100,
                    output_format: "jpg",
                    width: req.size?.width || 1024, // max 1440
                    height: req.size?.height || 1024, // max 1440
                    aspect_ratio: aspect_ratio,
                    safety_tolerance: 5,
                    prompt_upsampling: true,
                };
            },
            cost: 3,
        },
        flux_pro: {
            get: (req: UserAIPrompt) => {
                return {
                    prompt: req.prompt,
                    disable_safety_checker: true,
                    output_quality: 100,
                    output_format: "jpg",
                    steps: 30,
                    width: req.size?.width || 1024, // max 1440
                    height: req.size?.height || 1024, // max 1440
                    guidance: req.adherence || 3,
                    interval: 2,
                    aspect_ratio: aspect_ratio,
                    safety_tolerance: 5,
                    prompt_upsampling: true,
                };
            },
            cost: 4,
        },
        flux_schnell: {
            get: (req: UserAIPrompt) => {
                return {
                    prompt: req.prompt,
                    go_fast: false,
                    megapixels: "1",
                    num_outputs: req.count || 1,
                    aspect_ratio: "1:1",
                    output_format: "jpg",
                    output_quality: 100,
                    num_inference_steps: 4,
                    disable_safety_checker: true,
                    width: 1024,
                    height: 1024,
                };
            },
            cost: 1,
        },
    };

    processed_request = {
        input: outbound[request.model].get(request),
        cost: outbound[request.model].cost,
        model: request.model,
        user_id: request.user_id,
        nsfw_pass: request.nsfw_pass,
        rpg_presets: request.rpg_presets,
        randomize: request.randomize,
        count: request.count,
        ...rpg_details,
    };

    return processed_request;
}

export const FluxImageSizeOptions: SizeOption[] = [
    {
        label: "512x512",
        size: {
            width: 512,
            height: 512,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
        recommended: false,
    },
    {
        label: "1024x1024",
        size: {
            width: 1024,
            height: 1024,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
        recommended: true,
    },
    {
        label: "1440x1440",
        size: {
            width: 1440,
            height: 1440,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
        recommended: false,
    },
];
export const SDImageSizeOptions: SizeOption[] = [
    {
        label: "512x512",
        size: {
            width: 512,
            height: 512,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
        recommended: false,
    },
    {
        label: "1024x1024",
        size: {
            width: 1024,
            height: 1024,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
        recommended: true,
    },
    // {
    //     label: "2048x2048",
    //     size: {
    //         width: 2048,
    //         height: 2048,
    //     },
    //     ratio: "1:1",
    //     cssClass: "ratio-1x1",
    //     recommended: false,
    // },
    {
        label: "1280x1024",
        size: {
            width: 1280,
            height: 1024,
        },
        ratio: "5:4",
        cssClass: "ratio-5x4",
        recommended: false,
    },
    {
        label: "1536x1024",
        size: {
            width: 1536,
            height: 1024,
        },
        ratio: "3:2",
        cssClass: "ratio-3x2",
        recommended: false,
    },
];

export const model_selection: AiModel[] = [
    {
        label: "black-forest-labs/flux-pro",
        img: "flux_pro.png",
        value: "flux_pro",
        adherence: [2, 5],
        size_options: FluxImageSizeOptions,
        count_option: false,
        max_outputs: [1, 1],
        model_type: "flux",
        max_img_per_request: 1,
        default_img_per_request: 1,
        cost: 4,
        negative_prompt: false,
        adherence_default: 3,
        tags: ["portrait", "landscape", "illustration", "fantasy", "photo realism"],
        description:
            "State-of-the-art image generation with top of the line prompt following, visual quality, image detail and output diversity.",
    },
    {
        label: "black-forest-labs/flux-1.1-pro",
        img: "flux_11_pro.png",
        value: "flux_11_pro",
        adherence: [],
        size_options: FluxImageSizeOptions,
        count_option: false,
        max_outputs: [1, 1],
        model_type: "flux",
        cost: 3,
        max_img_per_request: 1,
        default_img_per_request: 1,
        negative_prompt: false,
        tags: ["portrait", "landscape", "illustration", "fantasy", "photo realism"],
        description:
            "Top of the line, faster, better FLUX Pro. Text-to-image model with excellent image" +
            " quality, prompt adherence, and output diversity.",
    },
    {
        label: "black-forest-labs/flux-schnell",
        img: "flux_schnell3.png",
        value: "flux_schnell",
        adherence: [],
        size_options: [],
        count_option: true,
        max_outputs: [1, 4],
        model_type: "flux",
        cost: 1,
        max_img_per_request: 4,
        default_img_per_request: 2,
        negative_prompt: false,
        tags: ["illustration", "fantasy", "experimentation", "concept art"],
        description: "The fastest image generation model tailored for experimentation and personal use",
    },
    {
        label: "gleipnir_v20BF16_174601.safetensors",
        img: "character_model.png",
        value: "character_model",
        adherence: [0, 30],
        size_options: SDImageSizeOptions,
        count_option: true,
        max_outputs: [1, 8],
        model_type: "sd",
        cost: 1,
        max_img_per_request: 8,
        default_img_per_request: 2,
        negative_prompt: true,
        adherence_default: 7,
        tags: ["character", "fantasy", "illustration", "anime", "nsfw", "portrait", "2d concept" + " art"],
        description:
            "SDXL 1.0 Character model trained on a variety of character types and styles.  Excellent image" +
            " quality and prompt adherence.",
    },
    {
        label: "demonCORESFWNSFW_v22_135842.safetensors",
        img: "portrait_model.png",
        value: "portrait_model",
        adherence: [0, 30],
        size_options: SDImageSizeOptions,
        count_option: true,
        max_outputs: [1, 8],
        model_type: "sd",
        cost: 1,
        max_img_per_request: 8,
        default_img_per_request: 2,
        negative_prompt: true,
        adherence_default: 7,
        tags: ["character", "fantasy", "illustration", "anime", "nsfw", "portrait"],
        description:
            "SDXL 1.0 Portrait model trained on a variety of portrait types and styles.  Excellent image quality and prompt adherence.",
    },
    {
        label: "crystalClearXL_ccxl_97637.safetensors",
        img: "creatures_model.png",
        value: "creatures_model",
        adherence: [0, 30],
        size_options: SDImageSizeOptions,
        count_option: true,
        max_outputs: [1, 8],
        model_type: "sd",
        cost: 1,
        max_img_per_request: 8,
        default_img_per_request: 2,
        negative_prompt: true,
        adherence_default: 7,
        tags: ["character", "fantasy", "illustration", "anime", "nsfw", "portrait"],
        description: "SDXL 1.0 Good balance of art styles suitable for character work and digital art.",
    },
    {
        label: "Anime (sdxl 1.0)",
        img: "anime_model.png",
        value: "anime_model",
        adherence: [0, 30],
        size_options: SDImageSizeOptions,
        count_option: true,
        max_outputs: [1, 8],
        model_type: "sd",
        cost: 1,
        max_img_per_request: 8,
        default_img_per_request: 2,
        negative_prompt: true,
        adherence_default: 7,
        tags: ["character", "fantasy", "illustration", "anime", "nsfw", "portrait"],
        description:
            "SDXL 1.0 Anime model trained on a variety of anime styles.  Excellent image quality and prompt adherence.",
    },
];
