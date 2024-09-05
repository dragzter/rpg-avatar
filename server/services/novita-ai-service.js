import {NovitaSDK, TaskStatus} from "novita-sdk";
import dotenv from 'dotenv';

dotenv.config();

class NovitaAIService {
    client
    defaultNegativePrompt = "((blurry)), worst quality, 3D, cgi, bad hands , undefined"

    defaultModel = "gleipnir_v20BF16_174601.safetensors"
    altModel = "dreamshaperXL09Alpha_alpha2Xl10_91562.safetensors"
    alt2Model = "demonCORESFWNSFW_v22_135842.safetensors"


    constructor() {
        this.client = new NovitaSDK(process.env.NOVITA_API_KEY)
    }

    // async generateImage(prompt) {
    //     try {
    //         const response = await this.client.txt2ImgV3({
    //             request: {
    //                 model_name: this.defaultModel,
    //                 prompt: prompt,
    //                 negative_prompt: this.defaultNegativePrompt,
    //                 width: 1024,
    //                 height: 1024,
    //                 sampler_name: "DPM++ 2S a Karras",
    //                 guidance_scale: 7.5,
    //                 steps: 25,
    //                 image_num: 1,
    //                 clip_skip: 1,
    //                 seed: -1,
    //                 loras: [],
    //             },
    //         });
    //
    //         if (response && response.task_id) {
    //             while (true) {
    //                 try {
    //                     const progressRes = await this.client.progressV3({
    //                         task_id: response.task_id,
    //                     });
    //
    //                     if (progressRes.task.status === TaskStatus.SUCCEED) {
    //                         console.log("finished!", progressRes.images);
    //                         return progressRes.images;
    //                     }
    //
    //                     if (progressRes.task.status === TaskStatus.FAILED) {
    //                         console.warn("failed!", progressRes.task.reason);
    //                         throw new Error(`Task failed: ${progressRes.task.reason}`);
    //                     }
    //
    //                     if (progressRes.task.status === TaskStatus.QUEUED) {
    //                         console.log("queueing");
    //                     }
    //
    //                     // Wait for 1 second before checking again
    //                     await new Promise(resolve => setTimeout(resolve, 1000));
    //
    //                 } catch (err) {
    //                     console.error("progress error:", err);
    //                 }
    //             }
    //         }
    //
    //     } catch (error) {
    //         console.log("Error generating image:", error);
    //         throw error;  // Re-throw the error to be handled by the caller
    //     }
    // }

    async checkProgress(taskId, maxAttempts = 100, attempt = 0) {
        try {
            const progressRes = await this.client.progressV3({task_id: taskId});

            if (progressRes.task.status === TaskStatus.SUCCEED) {
                return progressRes.images;
            }

            if (progressRes.task.status === TaskStatus.FAILED) {
                console.warn("failed!", progressRes.task.reason);
                throw new Error(`Task failed: ${progressRes.task.reason}`);
            }

            if (progressRes.task.status === TaskStatus.QUEUED) {
                console.log("queueing");
            }

            if (attempt < maxAttempts) {
                // Wait for 1 second before checking again
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.checkProgress.call(this, taskId, maxAttempts, attempt + 1);
            } else {
                console.warn("Task did not complete in the expected time.");
                throw new Error("Task did not complete within the timeout period.");
            }

        } catch (err) {
            console.error("progress error:", err);
            throw err; // Rethrow error if needed
        }
    }

    /**
     * @typedef {Object} UserAIPrompt
     * @property {string} prompt - The main prompt for generating the image.
     * @property {string} archetype - The selected archetype for the image generation.
     * @property {boolean} nsfw_pass - Indicates whether NSFW content is allowed.
     * @property {string} user_id - The ID of the user making the request.
     * @property {string} [art_style] - The chosen art style for the image.
     * @property {string} [model] - The model used for image generation.
     * @property {number} [count] - The number of images to generate.
     * @property {Object} [size] - The size of the generated image.
     * @property {number} size.width - The width of the image (default is 1024).
     * @property {number} size.height - The height of the image (default is 1024).
     * @property {string} [size_label] - The label for the image size (e.g.,
     *     "1024x1024").
     * @property {string} [negative_prompt] - A prompt to specify what should not be
     *     included in the image.
     * @property {number} [steps] - The number of steps to use in the image generation
     *     process.
     * @property {number} [adherence] - The degree of adherence to the prompt (e.g., how
     *     strictly the model follows the prompt).
     */
    async generateImage(userData) {

        const basePrompt = "ludicrously gorgeous brunette rogue in the high fantasy art style, wearing skimpy leather armor, large breasts,  incredibly fit and lean, long flowing hair, subtle smile, gorgeous eyes, full lips"

        const configured_prompt = userData.prompt
        const rwidth = userData.size?.width || 1024
        const rheight = userData.size?.height || 1024
        const adherence = userData.adherence || 7.5
        const negative_prompt = userData.negative_prompt || this.defaultNegativePrompt

        try {
            const response = await this.client.txt2ImgV3({
                request: {
                    model_name: this.defaultModel,
                    prompt: configured_prompt,
                    negative_prompt: negative_prompt,
                    width: rwidth,
                    height: rheight,
                    sampler_name: "DPM++ 2S a Karras",
                    guidance_scale: adherence,
                    steps: 26,
                    image_num: userData.count || 1,
                    clip_skip: 1,
                    seed: -1,
                    loras: [],
                },
                extra: {
                    response_image_type: "jpeg",
                    nsfw_detection_level: 2,
                    enable_nsfw_detection: true,
                }
            });

            if (response && response.task_id) {
                return await this.checkProgress.call(this, response.task_id);
            }

        } catch (error) {
            console.log(error);
        }
    }


}

export default new NovitaAIService()