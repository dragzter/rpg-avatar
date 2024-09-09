import {NovitaSDK, TaskStatus} from "novita-sdk";
import taskManager from "./task-manager.js";
import UserService from "./user-service.js";
import "../config.js"


class NovitaAIService {
    client
    userPrompt = {
        date: ""
    }
    user
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
        const rwidth = userData?.size?.width || 1024;
        const rheight = userData?.size?.height || 1024;
        const adherence = userData.adherence || 7.5;
        const negative_prompt = userData.negative_prompt || "none";

        const request = {
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

    async checkImageGenerationProgress(taskId, maxAttempts = 300, attempt = 0) {
        try {
            if (taskManager.isTaskCanceled(taskId)) {
                console.log(`Task ${taskId} was canceled.`);
                this.userPrompt = {}

                return {
                    success: false,
                    message: "Task was canceled. The user will not be credited."
                };
            }

            const progressResponse = await this.client.progressV3({task_id: taskId});

            if (progressResponse.task.status === TaskStatus.SUCCEED) {
                taskManager.removeTask(taskId);

                // Credit the user
                await Promise.all([
                    this.creditUserForImages(progressResponse.images.length),
                    // TODO Need to figure out how to prevent duplicate prompt saves
                    //this.savePrompt()
                ])

                return {
                    images: progressResponse.images,
                    success: true,
                    message: "Images successfully created.",
                    new_token_balance: this.user.token_balance
                };
            }

            if (progressResponse.task.status === TaskStatus.QUEUED) {
                console.log("queueing task");
            }

            if (progressResponse.task.status === TaskStatus.FAILED) {
                taskManager.removeTask(taskId);
                this.userPrompt = {}

                console.log("task failed")
                return new Error(`Task failed: ${progressResponse.task.reason}`);
            }

            if (attempt < maxAttempts) {
                console.log("retrying...  Attempt: " + attempt + " / " + maxAttempts)
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.checkImageGenerationProgress(taskId, maxAttempts, attempt + 1);
            } else {
                taskManager.removeTask(taskId);
                return new Error("Task did not complete within the timeout period.");
            }
        } catch (error) {
            this.userPrompt = {}
            taskManager.removeTask(taskId);
            console.error("Error checking progress:", error);
            throw error;
        }
    }
}

export default new NovitaAIService()