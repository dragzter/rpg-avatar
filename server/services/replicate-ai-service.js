import UserService from "./user-service.js";
import BackblazeStorageService from "./backblaze-storage-service.js";
import { v4 as uuidv4 } from "uuid";
import Replicate from "replicate";
import axios from "axios";

class ReplicateAiService {
    replicate;
    models;
    state = new Map();
    maxChecks = 200;
    failureCodes = {
        nsfw: "nsfw",
        timeout: "timeout",
        canceled: "canceled",
        network: "network",
    };

    constructor() {
        this.replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });

        this.models = {
            flux_pro: process.env.FLUX_PRO, // 0.055c per image --
            // https://replicate.com/black-forest-labs/flux-pro
            flux_11_pro: process.env.FLUX_11_PRO, // 0.04c per image --
            // https://replicate.com/black-forest-labs/flux-1.1-pro
            flux_schnell: process.env.FLUX_SCHNELL, // 0.003c per image --
            // https://replicate.com/black-forest-labs/flux-schnell
            flux_dev: process.env.FLUX_DEV, // 0.03c per image --
            // https://replicate.com/black-forest-labs/flux-dev
            avatar: process.env.FOFR_BECOME_IMAGE_MODEL, // 0.02c per image --
            // https://replicate.com/fofr/become-image
            sticker: process.env.FOFR_STICKER_MODEL, // 0.02c per image --
            // https://replicate.com/fofr/face-to-sticker
        };
    }

    LOG(message) {
        console.log(`[ReplicateAiService] ${message}`);
    }

    async startImageTask(userDetails) {
        const { input, user_id, model, cost, count } = userDetails;
        const user = await UserService.getUserById(user_id);

        if (user?.token_balance < cost) {
            return {
                message: "Not enough tokens for this request",
                status: "failed",
                success: false,
            };
        }

        const task_id = uuidv4();

        this.state.set(task_id, {
            status: "working",
            canceled: false,
            failureCode: "network",
            errorMessage: "",
            check_count: 0,
            cost,
            user,
            model,
            count,
            user_id,
            input,
        });

        // TODO: Check for NSFW content
        // Purposely not awaiting this function
        this.beginImageGeneration(input, model, task_id);

        return {
            success: true,
            task_id,
        };
    }

    async beginImageGeneration(input, model, task_id) {
        const controller = new AbortController(); // Create an AbortController
        const signal = controller.signal; // Get the signal from the controller
        this.state.get(task_id).controller = controller;

        try {
            const output = await this.replicate.run(this.models[model], {
                input,
                signal,
            });

            if (!this.state.get(task_id)) {
                this.LOG("Task has been canceled - attempted to write output.");
                return;
            }

            this.LOG(`Task ${task_id} has completed`);
            this.state.get(task_id).status = "complete";
            this.state.get(task_id).output = output;
        } catch (error) {
            this.LOG(error.message);
            this.state.get(task_id).status = "failed";
            this.state.get(task_id).errorMessage = error.message;

            if (error.message.toLowerCase().includes("nsfw")) {
                this.state.get(task_id).failureCode = this.failureCodes.nsfw;
                this.state.get(task_id).errorMessage =
                    error.message +
                    " An NSFW pass is" +
                    " required to make NSFW prompts.";
            }

            if (this.state.get(task_id)?.canceled) {
                this.LOG("Task has failed or been canceled");
                this.state.get(task_id).status = "failed";
                return;
            }
        }
    }

    cancelTask(task_id) {
        console.log(`Canceling task: ${task_id}`);
        this.state.get(task_id).canceled = true;
        this.state.get(task_id).controller.abort();
        this.state.delete(task_id);
    }

    async creditUser(credits, task_id) {
        const state = this.state.get(task_id);
        state.user.token_balance -= credits;
        await UserService.saveUser(state.user);
    }

    async checkStatus(task_id) {
        const t = this.state.get(task_id);

        if (!t) {
            return;
        }

        t.check_count = t.check_count + 1;

        this.LOG(
            `Check: ${t.check_count} - ${t.user.nickname} | balance: ${t.user.token_balance}`
        );

        if (t.canceled) {
            return {
                success: false,
                status: "canceled",
                message: `Task ${task_id} has timed out.`,
            };
        }

        if (t.check_count >= this.maxChecks) {
            this.cancelTask(task_id);
            return {
                success: false,
                status: "timeout",
                message: `Task ${task_id} has timed out. Please try another prompt`,
            };
        }

        if (t.status === "complete") {
            const _state = this.state.get(task_id);
            await this.creditUser(_state.cost, task_id);

            const images = Array.isArray(_state.output)
                ? _state.output.map((img) => {
                      return { image_url: img };
                  })
                : [{ image_url: _state.output }];

            // Upload/Download images
            this.downloadAndUploadImages(
                images.map((i) => i.image_url),
                task_id
            );

            this.state.delete(task_id);

            return {
                success: true,
                status: "complete",
                message: `Task ${task_id} has completed successfully.`,
                images,
                new_token_balance: _state.user.token_balance,
            };
        } else if (t.status === "working") {
            return {
                success: true,
                status: "working",
                message: `Task ${task_id} is still working.`,
                task_id,
            };
        } else if (t.status === "failed") {
            const msg = t.errorMessage || "Task has failed.";
            return {
                success: false,
                status: "failed",
                message: msg,
            };
        }
    }

    downloadAndUploadImages(imageUrls, task_id) {
        const state = this.state.get(task_id);
        console.log("(Replicate) Downloading and uploading images...");

        const file_names = [];
        const thumbnail_file_names = [];

        const uploadPromises = imageUrls.map(async (url) => {
            try {
                const dir = `${state.user.id.replace("|", "")}`;
                const file_key = Math.random().toString(36).substring(6);

                const response = await axios.get(url, {
                    responseType: "arraybuffer",
                });

                const buffer = response.data;
                const image_key = `${dir}/${file_key}.image.jpeg`;
                const thumbnail = `${dir}/thumbnails/${file_key}.thumbnail.jpeg`;

                file_names.push(image_key);
                thumbnail_file_names.push(thumbnail);

                await Promise.all([
                    BackblazeStorageService.upload(buffer, image_key),
                    BackblazeStorageService.createThumbnailAndUpload(
                        buffer,
                        thumbnail
                    ),
                ]);

                console.log(
                    `Successfully uploaded: ${image_key} and ${thumbnail}`
                );
            } catch (error) {
                console.error(
                    `Failed to download or upload image from ${url}: `,
                    error
                );
            }
        });

        // Kick off the uploads and thumbnail generation concurrently without waiting for
        // them to finish
        Promise.all(uploadPromises)
            .then(async () => {
                console.log("All images uploaded and thumbnails generated");
                const modelSchema = {
                    [state.model]: { ...state.input },
                };

                const prompt_aggregate = {
                    ...modelSchema,
                    count: state.count,
                    user_id: state.user.id,
                    thumbnails: thumbnail_file_names,
                    file_names: file_names,
                    prompt_id: uuidv4(),
                };

                // Save the prompt to the database
                await UserService.savePrompt(prompt_aggregate);

                // Update the user's image count
                await UserService.getAndUpdateUserImageCount(state.user.id);
            })
            .catch((error) => {
                console.error("Error in async image upload tasks:", error);
            });
    }
}

export default new ReplicateAiService();
