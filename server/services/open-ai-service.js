import OpenAI from "openai";
import dotenv from "dotenv";
import { art_style as ARTSTYLE } from "../utils/art-style.js";
import "../config.js";

dotenv.config();

class OpenAIService {
    openai = {};
    MAX_TOKEN = 500;

    MODEL = {
        Gpt35: "gpt-3.5-turbo-0125",
        Gpt4oMini: "gpt-4o-mini",
        Dalle2: "dall-e-2",
        Dalle3: "dall-e-3",
    };

    SIZE = {
        Dalle2: {
            256: "256x256",
        },
        Dalle3: {
            1024: "1024x1024",
        },
    };

    // The previous DALL·E model released in Nov 2022. The
    // 2nd iteration of DALL·E with more realistic,
    // accurate, and 4x greater resolution images than the
    // original model.
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            project: process.env.OPEN_AI_PROJECT_ID,
        });
    }

    /**
     * Request AI prompt for a given archetype
     * @param userRequest {Object: {archetype: string, art_style: string}}
     * @returns {Promise<void>}
     */
    async requestAiPromptV2(userRequest) {
        const { archetype, art_style, nsfw_pass } = userRequest;

        const style = ARTSTYLE[art_style.toLowerCase()];
        const gender = Math.random() < 0.5 ? "Male" : "Female";

        const attractivenessNote =
            gender === "Female" && nsfw_pass
                ? "Emphasize her stunning beauty and athletic yet feminine body features."
                : "";

        let requestMessages = [
            {
                role: "user",
                content: `Generate a flexible image prompt for a ${gender} ${archetype} in the ${art_style} style, ${style}. **IMPORTANT: The art style MUST be heavily emphasized, it is critical to the output**. Describe the character based on their archetype (e.g., warlock, rogue, paladin, etc.) with fitting clothing, accessories, or weapons. The background should complement the scene and match the art style. Include dynamic lighting, detailed facial features, and other supporting elements. Specify an adventurous vibe. Important characteristics should be wrapped in perens, STRICTLY follow this format example: "({adverb} {adjective} {float between 1-2})", include 3-5 of these for key characteristics. ${attractivenessNote} Important: **Keep the prompt under 700 characters**. 
             `,
            },
        ];

        if (!nsfw_pass) {
            requestMessages.content =
                requestMessages.content +
                "  **IMPORTANT** Ensure the prompt is safe for work while keeping within the spirit of the prompt.";
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: this.MODEL.Gpt4oMini,
                messages: requestMessages,
                max_tokens: this.MAX_TOKEN,
            });

            return (
                response?.choices[0]?.message?.content || "No response from AI"
            );
        } catch (error) {
            console.error("Error in requestAiPromptV2: ", error);
        }
    }

    async requestAiPrompt(userRequest) {
        if (!userRequest) {
            return;
        }

        const { prompt, archetype, artStyle } = userRequest;
        const archetypeContext = "";

        const response = await this.openai.chat.completions.create({
            model: this.MODEL.Gpt4oMini,
            messages: [
                {
                    role: "user",
                    content: `Generate an AI prompt for a High Fantasy archetype image of a **${archetype.toUpperCase()}** in the **${artStyle.toUpperCase()}** art style and should be heavily emphasized. The setting: **${archetypeContext}**. Additional info (prompt): ${prompt}. Only if prompt includes female or woman **Female characters should be very attractive, physically fit, and have a slim, voluptuous figure**.  Emphasize the custom prompts provided with **, **do not include any explicit language that might violate the OpenAI Platform content policy**.`,
                },
            ],
            max_tokens: this.MAX_TOKEN,
        });

        return response.choices[0].message.content;
    }

    async checkNSFW(prompt) {
        try {
            const moderationResponse = await this.openai.moderations.create({
                input: prompt,
            });

            const { flagged, categories } = moderationResponse.results[0];

            console.log({
                violence: categories.violence,
                hate: categories.hate,
                sexual: categories.sexual,
                selfHarm: categories["self-harm"],
                minors: categories["sexual/minors"],
                selfHarmIntent: categories["self-harm/intent"],
                flagged,
            });

            return {
                violence: categories.violence,
                hate: categories.hate,
                sexual: categories.sexual,
                selfHarm: categories["self-harm"],
                minors: categories["sexual/minors"],
                selfHarmIntent: categories["self-harm/intent"],
                flagged,
            };
        } catch (error) {
            console.error("Error checking NSFW content:", error);
            return false;
        }
    }

    async stripNSFW(prompt) {
        const response = await this.openai.chat.completions.create({
            model: this.MODEL.Gpt4oMini,
            messages: [
                {
                    role: "user",
                    content:
                        "Clean this prompt up and make it Safe For Work while keeping within the spirit of the prompt: " +
                        prompt,
                },
            ],
            max_tokens: this.MAX_TOKEN,
        });

        console.log(response.choices[0].message.content, "response from AI");

        return response.choices[0].message.content;
    }

    async requestImage(userRequest) {
        const prompt = await this.requestAiPrompt(userRequest);

        console.log("calling image AI tool...");
        console.log("using prompt: ", prompt);
        const response = await this.openai.images.generate({
            model: this.MODEL.Dalle3,
            prompt: prompt,
            n: 1,
            quality: "hd",
            style: "vivid",
            size: this.SIZE.Dalle3["1024"],
        });

        const image_url = response.data[0].url;
        console.log("URL: ", image_url);

        return image_url;
    }
}

export default new OpenAIService();
