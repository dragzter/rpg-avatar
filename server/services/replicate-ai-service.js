import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";
import UserService from "./user-service.js";

class ReplicateAiService {
    replicate;
    models;
    state = new Map();
    requestSchema;
    commonFluxSchema;
    constructor() {
        this.replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });

        this.models = {
            flux_pro: process.env.FLUX_PRO, // 0.04c per image -- https://replicate.com/black-forest-labs/flux-pro
            flux_11_pro: process.env.FLUX_11_PRO, // 0.055c per image -- https://replicate.com/black-forest-labs/flux-1.1-pro
            flux_schnell: process.env.FLUX_SCHNELL, // 0.003c per image -- https://replicate.com/black-forest-labs/flux-schnell
            flux_dev: process.env.FLUX_DEV, // 0.03c per image -- https://replicate.com/black-forest-labs/flux-dev
            avatar: process.env.FOFR_BECOME_IMAGE_MODEL, // 0.02c -- https://replicate.com/fofr/become-image
            sticker: process.env.FOFR_STICKER_MODEL, // 0.02c per image -- https://replicate.com/fofr/face-to-sticker
        };

        this.commonFluxSchema = {
            prompt: "",
            disable_safety_checker: true,
            output_quality: 80,
            output_format: "jpg",
        };

        this.requestSchema = {
            flux_11_pro: {
                model: this.models.flux_11_pro,
                schema: {
                    width: 1024,
                    height: 1024,
                    aspect_ratio: "1:1",
                    safety_tolerance: 5,
                    prompt_upsampling: true,
                },
            },
            flux_pro: {
                model: this.models.flux_pro,
                schema: {
                    steps: 25,
                    width: 1024,
                    height: 1024,
                    guidance: 3,
                    interval: 2,
                    aspect_ratio: "1:1",
                    safety_tolerance: 5,
                    prompt_upsampling: true,
                },
            },
            flux_schnell: {
                model: this.models.flux_schnell,
                schema: {
                    go_fast: true,
                    megapixels: "1",
                    num_outputs: 1,
                    aspect_ratio: "1:1",
                    num_inference_steps: 4, // 1-4 - Number of denoising steps. 4 is recommended, and lower number of steps produce lower quality outputs, faster.
                },
            },
            flux_dev: {
                model: this.models.flux_dev,
                schema: {
                    go_fast: true,
                    guidance: 3.5,
                    megapixels: "1",
                    num_outputs: 1,
                    aspect_ratio: "1:1",
                    prompt_strength: 0.8,
                    num_inference_steps: 28, // 1-50 - 28 recommended
                },
            },
            // These will be different
            avatar: {
                model: this.models.avatar,
                schema: {
                    image: "", // The image being modified (url)
                    prompt: "a person",
                    image_to_become: "", // Image to become - this image will affect and guide the style of the original image provided (url)
                    negative_prompt: "",
                    prompt_strength: 2,
                    number_of_images: 2, // Number of images to generate
                    denoising_strength: 1, // How much of the original image of the person to keep. 1 is the complete destruction of the original image, 0 is the original image
                    instant_id_strength: 1, // How strong the InstantID will be.
                    image_to_become_noise: 0.3, // How much noise to add to the style image before processing. An alternative way of controlling stength. 0-1
                    control_depth_strength: 0.8, // Strength of depth controlnet. The bigger this is, the more controlnet affects the output.
                    image_to_become_strength: 0.75, // How strong the style will be applied to the image
                    disable_safety_checker: true,
                },
            },
            sticker: {
                model: this.models.sticker,
                schema: {
                    image: "",
                    steps: 20,
                    seed: -1,
                    width: 1024,
                    height: 1024,
                    prompt: "",
                    upscale: false,
                    upscale_steps: 10,
                    negative_prompt: "",
                    prompt_strength: 4.5, // Strength of the prompt. This is the CFG scale, higher numbers lead to stronger prompt, lower numbers will keep more of a likeness to the original.
                    ip_adapter_noise: 0.5,
                    ip_adapter_weight: 0.2,
                    instant_id_strength: 0.7,
                    disable_safety_checker: true,
                },
            },
        };
    }

    async startImageTask(userDetails) {
        const { input, user_id, model, cost } = userDetails;
        console.log("Starting image task...", userDetails);
        const user = await UserService.getUserById(user_id);
        if (user?.token_balance < cost) {
            return {
                message: "Not enough tokens for this request",
                status: "failed",
                success: false,
            };
        }

        console.log("User: ", user);

        const task_id = uuidv4();

        this.state.set(task_id, {
            status: "working",
            canceled: false,
            check_count: 0,
            cost,
            user,
            user_id,
            input,
        });

        // TODO: Check for NSFW content

        // Purposely not awaiting this function
        this.beginImageGeneration(input, model, user_id, task_id);

        return {
            success: true,
            task_id,
        };
    }

    async beginImageGeneration(input, model, user_id, task_id) {
        try {
            console.log(
                "Starting image generation...",
                input,
                model,
                user_id,
                task_id
            );
            // const { input, model } = userDetails;
            console.log("Model: ", this.models[model]);
            const output = await this.replicate.run(this.models[model], {
                input,
            });

            this.state.get(task_id).status = "complete";
            console.log("completed image generation...", output);
            this.state.get(task_id).output = output;
        } catch (error) {
            console.log(error);
            this.state.get(task_id).status = "failed";
        }
    }
    cancelTask(taskId) {
        this.state[taskId].canceled = true;
    }

    async creditUser(credits, task_id) {
        const state = this.state.get(task_id);
        state.user.token_balance -= credits;
        await UserService.saveUser(state.user);
    }

    async checkStatus(task_id) {
        const t = this.state.get(task_id);
        t.check_count = t.check_count + 1;

        console.log(
            `Check: ${t.check_count} - ${t.user.nickname} | balance: ${t.user.token_balance}`
        );

        if (t.status === "complete") {
            // upload images to backblaze
            const _state = this.state.get(task_id);
            await this.creditUser(_state.cost, task_id);

            const images = Array.isArray(_state.output)
                ? _state.output.map((img) => {
                      return { image_url: img };
                  })
                : [{ image_url: _state.output }];

            // Upload/Download images
            this.downloadAndUploadImages(images, task_id);

            return {
                success: true,
                status: "complete",
                images,
                new_token_balance: _state.user.token_balance,
            };
        } else if (t.status === "working") {
            return {
                success: true,
                status: "working",
                task_id,
            };
        } else if (t.canceled) {
            delete this.state.get(task_id);

            return {
                success: false,
                status: "canceled",
                message: `Task ${task_id} has been canceled.`,
            };
        } else if (t.status === "failed") {
            return {
                success: false,
                status: "failed",
                message: `Task ${task_id} has failed.`,
            };
        }
    }

    downloadAndUploadImages(imageUrls, task_id) {
        const state = this.state.get(task_id);
        console.log("(Replicate) Downloading and uploading images...");
        console.log(state, "state");
        const file_names = [];
        const thumbnail_file_names = [];

        // const uploadPromises = imageUrls.map(async (url) => {
        //     try {
        //         const folder = `${state.user.id.replace("|", "")}`;
        //         const file_key = Math.random().toString(36).substring(6);
        //
        //         const response = await axios.get(url, {
        //             responseType: "arraybuffer",
        //         });
        //
        //         const buffer = response.data;
        //         const image_key = `${folder}/${file_key}.image.jpeg`;
        //         const thumbnail = `${folder}/thumbnails/${file_key}.thumbnail.jpeg`;
        //
        //         file_names.push(image_key);
        //         thumbnail_file_names.push(thumbnail);
        //
        //         await Promise.all([
        //             BackblazeStorageService.upload(buffer, image_key),
        //             BackblazeStorageService.createThumbnailAndUpload(
        //                 buffer,
        //                 thumbnail
        //             ),
        //         ]);
        //
        //         console.log(
        //             `Successfully uploaded: ${image_key} and ${thumbnail}`
        //         );
        //     } catch (error) {
        //         console.error(
        //             `Failed to download or upload image from ${url}: `,
        //             error
        //         );
        //     }
        // });

        // Kick off the uploads and thumbnail generation concurrently without waiting for
        // them to finish
        // Promise.all(uploadPromises)
        //     .then(async () => {
        //         console.log("All images and thumbnails uploaded successfully.");
        //
        //         const prompt_aggregate = {
        //             ...state.prompt,
        //             user_id: state.user.id,
        //             thumbnails: thumbnail_file_names,
        //             file_names: file_names,
        //             prompt_id: uuidv4(),
        //         };
        //
        //         // Save the prompt to the database
        //         await UserService.savePrompt(prompt_aggregate);
        //
        //         // Update the user's image count
        //         await UserService.getAndUpdateUserImageCount(state.user.id);
        //     })
        //     .catch((error) => {
        //         console.error("Error in async image upload tasks:", error);
        //     });
    }
}

export default new ReplicateAiService();