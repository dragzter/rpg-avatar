import {NovitaSDK, TaskStatus} from "novita-sdk";
import taskManager, {ApiTaskStatus} from "../utils/task-manager.js";
import UserService from "./user-service.js";
import "../config.js"
import BackblazeStorageService from "./backblaze-storage-service.js";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {promptEnhance} from "../utils/prompt-constructor.js";


class NovitaAIService {
    // store state specific to the user/request
    state = new Map()
    client
    user
    PROMPT_PROPS = [
        "prompt",
        "archetype",
        "user_id",
        "rpg_presets",
        "art_style",
        "size",
        "nsfw_pass",
        "randomize",
        "negative_prompt",
        "steps",
        "model",
        "count",
        "adherence"
    ]

    defaultModel = "gleipnir_v20BF16_174601.safetensors"
    model_selection  = {
        character_model: "gleipnir_v20BF16_174601.safetensors",
        creatures_model: "crystalClearXL_ccxl_97637.safetensors",
        portrait_model: "demonCORESFWNSFW_v22_135842.safetensors",
        anime_model: "animexlXuebimix_v20_109348.safetensors",
        general_model: "protovisionXLHighFidelity3D_beta0520Bakedvae_106612.safetensors",
        pixel_model: "pixelArtDiffusionXL_spriteShaper_291175.safetensors"
    }

    creatures_modeL_2 = "fenrisxl_V164fp16_191548.safetensors"
    anime_model_2 = "protovisionXLHighFidelity3D_beta0520Bakedvae_106612.safetensors"

    defaultNegativePrompt = "((blurry)), worst quality, 3D, cgi, bad hands, ((deformed)), ((unnatural)), undefined"
    altModel = "dreamshaperXL09Alpha_alpha2Xl10_91562.safetensors"

    constructor() {
        this.client = new NovitaSDK(process.env.NOVITA_API_KEY)
    }

    truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + '...'; // Truncate and add ellipses
        } else {
            return str; // Return the string as-is if it's within the limit
        }
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

        let configuredPrompt = userData.prompt.replace('"', "") || "generate a random rpg character"

        if (userData.randomize && userData.rpg_presets) {
            configuredPrompt = promptEnhance(userData.prompt)
        }

        // if (userData.rpg_presets) {
        //     configuredPrompt = promptConstructor(userData, false);
        // }

        const r_width = userData?.size?.width || 1024;
        const r_height = userData?.size?.height || 1024;
        const adherence = userData.adherence || 7;
        const negative_prompt = userData.negative_prompt || "none";

        const request = {
            request: {
                model_name: this.model_selection[userData.model] || this.defaultModel,
                prompt: this.truncateString(configuredPrompt, 1000) || "generate a random rpg character",
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
                    message: "Image generation started.",
                }
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

                        const image_urls = progress.images?.map((obj) => obj.image_url)

                        console.log("Task Succeeded: ", state.user.nickname)

                        try {
                            // This can keep going in the background
                            this.downloadAndUploadImages(image_urls, task_id);
                        } catch (err) {
                            console.log(err, "Error downloading and uploading images");
                        }

                        resolve(state);
                    } else if (TaskFailed) {
                        taskManager.activeTasks[task_id].status = ApiTaskStatus.FAILED;
                        console.log("Task Failed: ", progress.task.reason)
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

                        if (taskManager.activeTasks[task_id].status !== ApiTaskStatus.CANCELED) {
                            setTimeout(() => check(), 1000);
                        } else {
                            console.log("task is cancelled!")
                            resolve({
                                message: "Task canceled by user.",
                                success: false,
                                status: "canceled",
                                task_id
                            });
                        }
                    } else {
                        console.log("Task timed out", state.user.nickname, progress.task?.reason)
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

    downloadAndUploadImages(imageUrls, task_id) {
        const state = this.state.get(task_id)
        console.log("Downloading and uploading images...");
        const file_names = []
        const thumbnail_file_names = []

        const uploadPromises = imageUrls.map(async (url) => {
            try {
                const folder = `${state.user.id.replace("|", "")}`
                const file_key = Math.random().toString(36).substring(6)

                const response = await axios.get(url, {responseType: "arraybuffer"});

                const buffer = response.data;
                const image_key = `${folder}/${file_key}.image.jpeg`;
                const thumbnail = `${folder}/thumbnails/${file_key}.thumbnail.jpeg`;

                file_names.push(image_key);
                thumbnail_file_names.push(thumbnail);

                await Promise.all([
                    BackblazeStorageService.upload(buffer, image_key),
                    BackblazeStorageService.createThumbnailAndUpload(buffer, thumbnail)
                ])

                console.log(`Successfully uploaded: ${image_key} and ${thumbnail}`);
            } catch (error) {
                console.error(`Failed to download or upload image from ${url}: `, error);
            }
        });

        // Kick off the uploads and thumbnail generation concurrently without waiting for
        // them to finish
        Promise.all(uploadPromises)
            .then(async () => {
                console.log("All images and thumbnails uploaded successfully.");

                const prompt_aggregate = {
                    ...state.prompt,
                    user_id: state.user.id,
                    thumbnails: thumbnail_file_names,
                    file_names: file_names,
                    prompt_id: uuidv4(),
                }

                await UserService.savePrompt(prompt_aggregate);

                // Update the user's image count
                await UserService.getAndUpdateUserImageCount(state.user.id);

            })
            .catch((error) => {
                console.error("Error in async image upload tasks:", error);
            });

    }
}

export default new NovitaAIService()