import OpenAI from 'openai';
import dotenv from 'dotenv';
import "../config.js"

dotenv.config();

class OpenAIService {
    openai = {};
    MAX_TOKEN = 500

    MODEL = {
        Gpt35: "gpt-3.5-turbo-0125",
        Gpt4oMini: "gpt-4o-mini",
        Dalle2: "dall-e-2",
        Dalle3: "dall-e-3",
    }

    SIZE = {
        Dalle2: {
            256: "256x256"
        },
        Dalle3: {
            1024: "1024x1024"
        }
    }

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
        const {archetype, art_style} = userRequest;

        const gender = Math.random() < 0.5 ? "Male" : "Female";

        const attractivenessNote = gender === 'female'
            ? "Additionally, ensure the character is very attractive, with perfect facial features and body proportions, alluring, gorgeous and captivating."
            : "";

        try {
            const response = await this.openai.chat.completions.create({
                model: this.MODEL.Gpt4oMini,
                messages: [
                    {
                        role: "user",
                        content: `Use this example to create a prompt in the same style using the provided archetype, art style, and gender. Do not follow structure verbatim, switch it up but stay within the spirit of the request and add in elements appropriate to the archetype.
                        Example:"High fantasy art style (brunette rogue), (alluring figure), intricate costume design with dark leather and silver accents, sly expression, perfect face, striking pose, dynamic foreground with magical elements, ethereal lighting, mesmerizing colors capturing a sense of adventure, mythical background landscape, enchanted atmosphere, ultra-detailed, vibrant colors, fantasy world flair, dramatic ambiance."
                        Now, generate a prompt with the following archetype: ${archetype}, art style: ${art_style}, and gender: ${gender} (always include the gender in the final prompt) set in an RPG/fantasy world. ${attractivenessNote}`
                    }
                ],
                max_tokens: this.MAX_TOKEN
            });

            return response?.choices[0]?.message?.content || "No response from AI";

        } catch (error) {
            console.error("Error in requestAiPromptV2: ", error)
        }

    }

    async requestAiPrompt(userRequest) {
        if (!userRequest) {
            return
        }

        const {prompt, archetype, artStyle} = userRequest;
        //const archetypeContext = getRandomSetting(archetype);
        const archetypeContext = "";

        console.log("starting ai prompt")
        const response = await this.openai.chat.completions.create({
            model: this.MODEL.Gpt4oMini,
            messages: [
                {
                    role: "user",
                    content: `Generate an AI prompt for a High Fantasy archetype image of a **${archetype.toUpperCase()}** in the **${artStyle.toUpperCase()}** art style and should be heavily emphasized. The setting: **${archetypeContext}**. Additional info (prompt): ${prompt}. Only if prompt includes female or woman **Female characters should be very attractive, physically fit, and have a slim, voluptuous figure**.  Emphasize the custom prompts provided with **, **do not include any explicit language that might violate the OpenAI Platform content policy**.`
                }
            ],
            max_tokens: this.MAX_TOKEN
        });

        return response.choices[0].message.content;
    }

    async talkToAi(prompt) {
        if (!prompt) {
            return
        }
        const response = await this.openai.chat.completions.create({
            model: this.MODEL.Gpt4oMini,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 4000
        });

        return response.choices[0].message.content;
    }

    async requestImage(userRequest) {

        const prompt = await this.requestAiPrompt(userRequest)

        console.log("calling image AI tool...")
        console.log("using prompt: ", prompt)
        const response = await this.openai.images.generate({
            model: this.MODEL.Dalle3,
            prompt: prompt,
            n: 1,
            quality: "hd",
            style: "vivid",
            size: this.SIZE.Dalle3["1024"]
        });

        const image_url = response.data[0].url;
        console.log("URL: ", image_url)

        return image_url
    }
}

export default new OpenAIService();