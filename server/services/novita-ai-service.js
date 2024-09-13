import {NovitaSDK, TaskStatus} from "novita-sdk";
import taskManager, {ApiTaskStatus} from "../utils/task-manager.js";
import UserService from "./user-service.js";
import "../config.js"


class NovitaAIService {
    // store state specific to the user/request
    state = new Map()
    client
    user
    PROMPT_PROPS = [
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

    promptA = "analog film photo Deep photo,gorgeous woman, very large breasts ,close up, depth of field,ferrania p30 film,shadows,messy hair,perfect face and body,dark,nighttime,dark photo,grainy,dimly lit,seductive smirk,harsh camera flash,. faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, Lomography, stained, highly detailed, found footage"


    constructor() {
        this.client = new NovitaSDK(process.env.NOVITA_API_KEY)
    }

    async startImageGeneration(userData) {
        const user = await UserService.getUserById(userData.user_id);
        if (user?.token_balance < userData.count) {
            return {
                message: "Not enough tokens for this request",
                success: false
            }
        }

        // Add date to determine when the prompt ran
        //this.userPrompt.date = new Date().toLocaleString()
        const userPrompt = {created: new Date().toLocaleString()}

        for (let i = 0; i < this.PROMPT_PROPS.length; i++) {
            if (userData[this.PROMPT_PROPS[i]]) {
                userPrompt[this.PROMPT_PROPS[i]] =
                    userData[this.PROMPT_PROPS[i]]
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

                // Set the Instance State
                this.state.set(response.task_id, {
                    user,
                    prompt: userPrompt,
                });

                return {
                    task_id: response.task_id,
                    success: true,
                    message: "Image generation started."
                };
            }
        } catch (error) {
            // In case of error, wipe the state, new request will be needed.
            console.log("Error initiating image generation:", error);
            return {
                success: false,
                message: "Error initiating image generation.  This is likely an issue with the server.",
                error,
            };
        }
    }

    async creditUserForImages(credits, task_id) {
        const state = this.state.get(task_id)
        state.user.token_balance -= credits;
        await UserService.saveUser(state.user);
    }

    async savePrompt() {
        // TODO if we save this, will need to use the instance state
        //await UserService.savePrompt(this.userPrompt);
    }

    getFinishedImages(task_id) {
        const state = this.state.get(task_id)
        return {
            ...state,
        }
    }


    async startTaskStatusPolling(task_id, maxAttempts = 300, attempt = 0) {

        return new Promise(async (resolve, reject) => {
            const check = async () => {
                try {
                    const progress = await this.client.progressV3({task_id});
                    const state = this.state.get(task_id)

                    const TaskSucceeded = progress.task.status === TaskStatus.SUCCEED;
                    const TaskFailed = progress.task.status === TaskStatus.FAILED;
                    const MaxAttemptsNotReached = attempt < maxAttempts;

                    if (taskManager.isTaskCanceled(task_id)) {
                        state.status = ApiTaskStatus.CANCELED;
                    }

                    if (TaskSucceeded) {
                        await this.creditUserForImages(progress.images.length, task_id);

                        state["images"] = progress.images;
                        state["success"] = true;
                        state["message"] = "Images successfully created.";
                        state["token_cost"] = progress.images.length;
                        state["new_token_balance"] = state.user.token_balance;
                        state["status"] = ApiTaskStatus.COMPLETE;
                        state["task_id"] = task_id;

                        resolve(state);
                    } else if (TaskFailed) {
                        taskManager.activeTasks[task_id].status = ApiTaskStatus.FAILED;
                        reject({
                            message: "Task failed: " + progress.task.reason,
                            success: false
                        });
                    } else if (MaxAttemptsNotReached) {
                        attempt++

                        // Retry after 1 second
                        console.log(
                            `Retry: ${attempt}/${maxAttempts} - (${state.user.nickname}) - Tokens: ${state.user.token_balance} - ${new Date().toLocaleString('en-US', {hour12: true})}`
                        );


                        if (state.status !== ApiTaskStatus.CANCELED) {
                            setTimeout(() => check(), 1000);
                        } else {
                            resolve({
                                message: "Task canceled by user.",
                                success: false,
                                status: "canceled",
                                task_id
                            });
                        }
                    } else {
                        taskManager.activeTasks[task_id].status = ApiTaskStatus.TIMEOUT;
                        reject({
                            message: "Task did not complete within the timeout period.",
                            success: false
                        });
                    }
                } catch (error) {
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