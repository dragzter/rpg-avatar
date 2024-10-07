import type { ModelSelection, UserAIPrompt } from "@/stores/types";

export function modelRequestMapper(request) {
    let processed_request;

    const outbound = {
        flux_11_pro: {
            get: (req: UserAIPrompt) => {
                return {
                    prompt: req.prompt,
                    disable_safety_checker: true,
                    output_quality: 80,
                    output_format: "jpg",
                    steps: 25,
                    width: req.size?.width || 1024, // max 1440
                    height: req.size?.height || 1024, // max 1440
                    guidance: req.adherence || 2,
                    interval: 2,
                    aspect_ratio: "1:1",
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
                    output_quality: 90,
                    output_format: "jpg",
                    steps: 30,
                    width: req.size?.width || 1024, // max 1440
                    height: req.size?.height || 1024, // max 1440
                    guidance: req.adherence || 3,
                    interval: 2,
                    aspect_ratio: "1:1",
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
                };
            },
            cost: 1,
        },
    };

    if (request.randomize) {
        // TODO add character etc
    } else {
        processed_request = {
            input: outbound[request.model].get(request),
            cost: outbound[request.model].cost,
            model: request.model,
            user_id: request.user_id,
            nsfw_pass: request.nsfw_pass,
        };
    }

    return processed_request;
}

export const model_selection: ModelSelection[] = [
    {
        label: "Flux Pro",
        img: "flux_pro.png",
        value: "flux_pro",
        adherence: [2, 5],
        size_option: true,
        count_option: false,
        max_outputs: [1, 1],
        premium: true,
        max_img_per_request: 1,
        cost: 4,
        negative_prompt: false,
        adherence_default: 3,
        description:
            "State-of-the-art image generation with top of the line prompt following, visual quality, image detail and output diversity.",
    },
    {
        label: "Flux Pro 1.1",
        img: "flux_11_pro.png",
        value: "flux_11_pro",
        adherence: [],
        size_option: true,
        count_option: false,
        max_outputs: [1, 1],
        premium: true,
        cost: 3,
        max_img_per_request: 1,
        negative_prompt: false,
        description:
            "Faster, better FLUX Pro. Text-to-image model with excellent image quality, prompt adherence, and output diversity.",
    },
    {
        label: "Flux Schnell",
        img: "flux_schnell3.png",
        value: "flux_schnell",
        adherence: [],
        size_option: false,
        count_option: true,
        max_outputs: [1, 4],
        premium: false,
        cost: 1,
        max_img_per_request: 4,
        negative_prompt: false,
        description: "The fastest image generation model tailored for experimentation and personal use",
    },
    {
        label: "gleipnir_v20BF16_174601.safetensors",
        img: "character_model.png",
        value: "character_model",
        adherence: [0, 30],
        size_option: true,
        count_option: true,
        max_outputs: [1, 8],
        premium: false,
        cost: 1,
        max_img_per_request: 8,
        negative_prompt: true,
        adherence_default: 7,
        description:
            "SDXL 1.0 Character model trained on a variety of character types and styles.  Excellent image" +
            " quality and prompt adherence.",
    },
    {
        label: "demonCORESFWNSFW_v22_135842.safetensors",
        img: "portrait_model.png",
        value: "portrait_model",
        adherence: [0, 30],
        size_option: true,
        count_option: true,
        max_outputs: [1, 8],
        premium: false,
        cost: 1,
        max_img_per_request: 8,
        negative_prompt: true,
        adherence_default: 7,
        description:
            "SDXL 1.0 Portrait model trained on a variety of portrait types and styles.  Excellent image quality and prompt adherence.",
    },
    {
        label: "crystalClearXL_ccxl_97637.safetensors",
        img: "creatures_model.png",
        value: "creatures_model",
        adherence: [0, 30],
        size_option: true,
        count_option: true,
        max_outputs: [1, 8],
        premium: false,
        cost: 1,
        max_img_per_request: 8,
        negative_prompt: true,
        adherence_default: 7,
        description: "SDXL 1.0 Good balance of art styles suitable for character work and digital art.",
    },
    {
        label: "Anime (sdxl 1.0)",
        img: "anime_model.png",
        value: "anime_model",
        adherence: [0, 30],
        size_option: true,
        count_option: true,
        max_outputs: [1, 8],
        premium: false,
        cost: 1,
        max_img_per_request: 8,
        negative_prompt: true,
        adherence_default: 7,
        description:
            "SDXL 1.0 Anime model trained on a variety of anime styles.  Excellent image quality and prompt adherence.",
    },
];