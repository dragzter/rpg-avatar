import {NovitaSDK, TaskStatus} from "novita-sdk";
import taskManager, {ApiTaskStatus} from "./task-manager.js";
import UserService from "./user-service.js";
import "../config.js"


class NovitaAIService {
    client
    user
    FinishedImages = {}
    userPrompt = {
        date: ""
    }
    promptProperties = [
        "prompt",
        "archetype",
        "user_id",
        "art_style",
        "size",
        "negative_prompt",
        "steps",
        "adherence"
    ]

    defaultNegativePrompt = "((blurry)), worst quality, 3D, cgi, bad hands, ((deformed)), ((unnatural)), undefined"

    defaultModel = "gleipnir_v20BF16_174601.safetensors"
    altModel = "dreamshaperXL09Alpha_alpha2Xl10_91562.safetensors"

    portrait_specialized_Model_2 = "demonCORESFWNSFW_v22_135842.safetensors"
    character_specialized_Model_1 = "gleipnir_v20BF16_174601.safetensors"
    pixelArt_specialized_Model_1 = "pixelArtDiffusionXL_spriteShaper_291175.safetensors"


    constructor() {
        this.client = new NovitaSDK(process.env.NOVITA_API_KEY)
    }

    async startImageGeneration(userData) {
        this.user = await UserService.getUserById(userData.user_id);

        // Add date to determine when the prompt ran
        this.userPrompt.date = new Date().toLocaleString()

        for (let i = 0; i < this.promptProperties.length; i++) {
            if (userData[this.promptProperties[i]]) {
                this.userPrompt[this.promptProperties[i]] =
                    userData[this.promptProperties[i]]
            }
        }


        if (this.user.token_balance < userData.count) {
            this.userPrompt = {}

            return {
                message: "Not enough tokens for this request",
                success: false
            }
        }

        const configured_prompt = userData?.prompt || "a white rabbit";
        const r_width = userData?.size?.width || 1024;
        const r_height = userData?.size?.height || 1024;
        const adherence = userData.adherence || 7.5;
        const negative_prompt = userData.negative_prompt || "none";

        const request = {
            request: {
                model_name: this.defaultModel,
                prompt: configured_prompt,
                negative_prompt: negative_prompt,
                width: r_width,
                height: r_height,
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
            },
        }

        try {
            const response = await this.client.txt2ImgV3(request);

            if (response?.task_id) {
                taskManager.addTask(response.task_id);
                return {
                    task_id: response.task_id,
                    success: true,
                    message: "Image generation started."
                };
            }
        } catch (error) {
            this.userPrompt = {}

            console.log("Error initiating image generation:", error);
            return {
                success: false,
                message: "Error initiating image generation.  This is likely an issue with the server.",
                error,
            };
        }
    }

    async creditUserForImages(credits) {
        this.user.token_balance -= credits;
        await UserService.saveUser(this.user);
    }

    async savePrompt() {
        await UserService.savePrompt(this.userPrompt);
    }

    getFinishedImages(taskId) {
        if (!this.FinishedImages[taskId]) {
            return {
                success: false,
                message: "No images found for this task."
            }
        }

        return {
            ...this.FinishedImages[taskId],
        }
    }


    async startTaskStatusPolling(task_id, maxAttempts = 300, attempt = 0) {

        return new Promise(async (resolve, reject) => {
            const check = async () => {
                try {
                    const progress = await this.client.progressV3({task_id});

                    const TaskSucceeded = progress.task.status === TaskStatus.SUCCEED;
                    const TaskFailed = progress.task.status === TaskStatus.FAILED;
                    const MaxAttemptsNotReached = attempt < maxAttempts;

                    if (TaskSucceeded) {
                        const userResponse = {
                            images: progress.images,
                            success: true,
                            message: "Images successfully created.",
                            token_cost: progress.images.length,
                            new_token_balance: this.user.token_balance,
                            status: ApiTaskStatus.COMPLETE,
                            task_id,
                        }

                        // Store finished images
                        this.FinishedImages[task_id] = userResponse;

                        // Credit the user
                        await this.creditUserForImages(progress.images.length);

                        console.log("Image Finished")
                        resolve(userResponse);

                    } else if (TaskFailed) {
                        taskManager.activeTasks[task_id].status = ApiTaskStatus.FAILED;
                        reject({
                            message: "Task failed: " + progress.task.reason,
                            success: false
                        });
                    } else if (MaxAttemptsNotReached) {
                        attempt++

                        // Retry after 1 second
                        console.log("Retry: " + attempt + " / " + maxAttempts + " | ", this.user?.nickname)
                        setTimeout(() => check(), 1000);
                    } else {
                        taskManager.activeTasks[task_id].status = ApiTaskStatus.TIMEOUT;
                        reject({
                            message: "Task did not complete within the timeout period.",
                            success: false
                        });
                    }
                } catch (error) {
                    console.log("BOOOM", error)
                    taskManager.activeTasks[task_id].status = ApiTaskStatus.FAILED;
                    reject({
                        message: "Error checking progress: " + error,
                        success: false
                    });
                }
            };

            // Start the first check
            await check();
        });
    }
}

export default new NovitaAIService()