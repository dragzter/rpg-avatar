import { defineStore } from "pinia";
import type {
    AiImageResponse,
    CreateAvatarPostArgs,
    ImageTaskStartedResponse,
    UserAIPrompt,
} from "@/stores/types";
import { API, ApiTaskStatus, STORAGE_KEYS } from "@/utils/";
import axios, { type AxiosResponse } from "axios";
import { useUserStore } from "@/stores/user";
import { storage } from "@/utils/storage";
import { modelRequestMapper } from "@/utils/model-utils";

export const useAiStore = defineStore("aiImages", {
    state: () => ({
        generatedImageUrl: "",
        generatedAvatarUrl: "",
        requestLoading: false,
        avatarRequestLoading: false,
        generatedImagesV2: [] as AiImageResponse[],
        imagesLoaded: false,
        toastMessage: "",
        random_ai_prompt: "",
        showToast: false,
        task_id: "",
        toastType: "success",
        toastError: false,
        avatarTaskId: "",
        aiGeneratedPromptLoading: false,
    }),
    actions: {
        async generateImageWithUserData(userData: UserAIPrompt) {
            try {
                this.requestLoading = true;
                const response = await axios.post(API.image, userData);

                this.generatedImageUrl = response.data;
            } catch (err) {
                console.log(err);
            } finally {
                this.requestLoading = false;
            }
        },
        async cancelFluxImageGenerationTask() {
            try {
                this.toastError = false;
                const response = await axios.post(API.cancel_flux_image, {
                    task_id: this.task_id,
                });

                this.task_id = "";
                this.toastMessage = "Task was cancelled";
                storage.rm(STORAGE_KEYS.task_id);
            } catch (err) {
                console.log(err);
            }
        },

        async createAvatar({ baseImageBlob, faceImageBlob, user_id, cost }: CreateAvatarPostArgs) {
            try {
                this.generatedAvatarUrl = "";
                this.avatarRequestLoading = true;

                // Create FormData and append both image blobs
                const formData = new FormData();
                formData.append("user_id", user_id);
                formData.append("cost", cost.toString());
                formData.append("baseImage", baseImageBlob, "base-image.jpg");
                formData.append("faceImage", faceImageBlob, "face-image.jpg");

                const response = await axios.post(API.create_avatar_start, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data?.task_id) {
                    this.avatarTaskId = response.data.task_id;
                    const userStore = useUserStore();

                    await new Promise<void>((resolve) => {
                        const pollStatus = setInterval(async () => {
                            try {
                                const statusResp = await axios.post(API.create_avatar_status, {
                                    task_id: this.avatarTaskId,
                                });

                                const taskId = this.avatarTaskId;
                                const outcomes: Record<string, () => void | Promise<void>> = {
                                    [ApiTaskStatus.COMPLETE]: async () => {
                                        clearInterval(pollStatus);
                                        const avatarResp = await axios.post(API.create_avatar_download, {
                                            task_id: taskId,
                                        });
                                        console.log("Complete");
                                        this.generatedAvatarUrl = avatarResp.data?.images || "";
                                        userStore.user.token_balance = avatarResp.data.new_token_balance;
                                        resolve();
                                    },
                                    [ApiTaskStatus.PENDING]: () => {
                                        console.log("Avatar Pending...");
                                    },
                                    [ApiTaskStatus.FAILED]: () => {
                                        clearInterval(pollStatus);
                                        console.log("Avatar Failed");
                                        resolve();
                                    },
                                    [ApiTaskStatus.CANCELED]: () => {
                                        clearInterval(pollStatus);
                                        console.log("Avatar Canceled");
                                        resolve();
                                    },
                                    [ApiTaskStatus.TIMEOUT]: () => {
                                        clearInterval(pollStatus);
                                        console.log("Avatar Timeout");
                                        resolve();
                                    },
                                };

                                outcomes[statusResp.data.status as string]();
                            } catch (err) {
                                console.log(err);
                                clearInterval(pollStatus);
                                resolve(); // Resolve in case of error to prevent hanging
                            }
                        }, 1000);
                    });
                }
            } catch (err) {
                console.log(err);
            } finally {
                this.avatarRequestLoading = false; // Only turns false once polling ends
            }
        },

        async cancelImageGenerationTask() {
            try {
                this.toastError = false;
                const response = await axios.post(API.cancel_task, {
                    task_id: this.task_id,
                });

                // TODO update toast message to show task was cancelled
                this.task_id = "";
                this.toastMessage = "Task was cancelled";
                storage.rm(STORAGE_KEYS.task_id);
            } catch (err) {
                console.log(err);
            }
        },
        async getRandomPrompt(userData) {
            try {
                const response = await axios.post(API.random_prompt, userData);

                this.random_ai_prompt = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        async getRandomPromptV2(userData) {
            try {
                this.toastError = false;
                this.aiGeneratedPromptLoading = true;

                const response = await axios.post(API.surprise_prompt, userData);

                this.random_ai_prompt = response.data;
            } catch (err) {
                console.log(err);
            } finally {
                this.aiGeneratedPromptLoading = false;
            }
        },
        async getFluxImage(userData: UserAIPrompt) {
            try {
                this.toastError = false;
                this.showToast = false;
                const userStore = useUserStore();
                this.requestLoading = true;
                this.imagesLoaded = false;

                let data = {} as any;
                if (userData.preset_id) {
                    // presets are in the backend - no need to use the mapper.
                    data.preset_id = userData.preset_id;
                    data.preset = true;
                    data.model = userData.model;
                    data.user_id = userData.user_id;
                } else {
                    data = modelRequestMapper(userData);
                    data.preset = false;
                }

                const response = await axios.post(API.start_premium_image, { data });

                if (response.data.task_id && response.data.success) {
                    this.task_id = response.data.task_id;
                    storage.s(STORAGE_KEYS.task_id, response.data.task_id);

                    const pollTaskStatus = () => {
                        const pollInterval = setInterval(async () => {
                            try {
                                const _resp = await axios.post(API.check_premium_task_status, {
                                    task_id: response.data.task_id,
                                });

                                const status = _resp.data.status;

                                if (status === ApiTaskStatus.CANCELED) {
                                    clearInterval(pollInterval);
                                    this.requestLoading = false;
                                    this.imagesLoaded = false;
                                    this.toastMessage = "Task was cancelled";
                                    this.showToast = true;
                                    storage.rm(STORAGE_KEYS.task_id);
                                } else if (status === ApiTaskStatus.COMPLETE) {
                                    clearInterval(pollInterval);

                                    this.generatedImagesV2 = _resp.data.images;

                                    if (_resp.data.new_token_balance !== undefined) {
                                        userStore.user.token_balance = _resp.data.new_token_balance;
                                    }

                                    if (this.generatedImagesV2?.length) {
                                        this.imagesLoaded = true;
                                        this.requestLoading = false;

                                        storage.s(STORAGE_KEYS.new_images, true);
                                        storage.rm(STORAGE_KEYS.task_id);
                                    }
                                } else if (
                                    status === ApiTaskStatus.FAILED ||
                                    status === ApiTaskStatus.TIMEOUT
                                ) {
                                    clearInterval(pollInterval);
                                    storage.rm(STORAGE_KEYS.task_id);

                                    this.requestLoading = false;
                                    this.toastMessage = _resp.data.message;
                                    this.toastError = true;
                                    this.showToast = true;
                                }
                            } catch (error) {
                                console.error("Error checking task status:", error);
                                clearInterval(pollInterval); // Stop polling on error
                                this.requestLoading = false;
                                storage.rm(STORAGE_KEYS.task_id);
                            }
                        }, 800);
                    };

                    pollTaskStatus();
                } else {
                    this.requestLoading = false;
                    this.toastMessage = response.data.message;
                    this.showToast = true;
                }

                this.generatedImageUrl = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getImageV2(userData: UserAIPrompt) {
            try {
                this.toastError = false;
                this.showToast = false;

                const userStore = useUserStore();
                this.requestLoading = true;
                this.imagesLoaded = false;

                // Start image generation task - get a task_id
                const taskIdResponse: AxiosResponse<ImageTaskStartedResponse> = await axios.post(
                    API.start_image_v2_task,
                    {
                        data: userData,
                    }
                );

                // With the task id we call to initiate backend polling for the task.
                // Once we get the images, we update our state.
                if (taskIdResponse.data.task_id) {
                    this.task_id = taskIdResponse.data.task_id;

                    const pollTaskStatus = () => {
                        const pollInterval = setInterval(async () => {
                            try {
                                const _resp = await axios.post(API.check_task_status, {
                                    task_id: taskIdResponse.data.task_id,
                                });

                                // Save the last task_id in localStorage
                                storage.s(STORAGE_KEYS.task_id, taskIdResponse.data.task_id as string);

                                if (_resp.data.status === ApiTaskStatus.CANCELED) {
                                    clearInterval(pollInterval);
                                    this.requestLoading = false;
                                    this.imagesLoaded = false;
                                    this.toastMessage = _resp.data.message;
                                    this.showToast = true;
                                    storage.rm(STORAGE_KEYS.task_id);
                                } else if (_resp.data.status === ApiTaskStatus.COMPLETE) {
                                    clearInterval(pollInterval);

                                    // Update state with images
                                    this.generatedImagesV2 = _resp.data?.images || [];

                                    // Update the token balance once successful
                                    if (_resp.data?.new_token_balance !== undefined) {
                                        userStore.user.token_balance = _resp.data.new_token_balance;
                                    }

                                    if (this.generatedImagesV2?.length) {
                                        this.imagesLoaded = true;
                                        this.requestLoading = false;

                                        storage.s(STORAGE_KEYS.new_images, true);
                                        storage.rm(STORAGE_KEYS.task_id);
                                    }
                                } else if (_resp.data.status === ApiTaskStatus.FAILED) {
                                    clearInterval(pollInterval);
                                    storage.rm(STORAGE_KEYS.task_id);
                                    this.requestLoading = false;
                                } else if (_resp.data.status === ApiTaskStatus.TIMEOUT) {
                                    clearInterval(pollInterval);
                                    storage.rm(STORAGE_KEYS.task_id);
                                    this.requestLoading = false;
                                    this.toastMessage = _resp.data.message;
                                    this.showToast = true;
                                }
                            } catch (error) {
                                console.error("Error checking task status:", error);
                                storage.rm(STORAGE_KEYS.task_id);
                                clearInterval(pollInterval); // Stop polling on error
                                this.requestLoading = false;
                            }
                        }, 1200);
                    };

                    // Start polling
                    pollTaskStatus();
                }

                if (this.generatedImagesV2?.length) {
                    this.imagesLoaded = true;
                    this.requestLoading = false;
                }
            } catch (err) {
                this.toastMessage = (err as any).response?.data?.message || "An error occurred";
                this.toastError = true;
                this.showToast = true;
                this.requestLoading = false;
            }
        },
    },
});
