import { defineStore } from "pinia";
import type {
    ImageTaskStartedResponse,
    NovitaImg,
    UserAIPrompt,
} from "@/stores/types";
import { API, ApiTaskStatus, STORAGE_KEYS } from "@/utils/";
import axios, { type AxiosResponse } from "axios";
import { useUserStore } from "@/stores/user";
import { storage } from "@/utils/storage";

export const useAiStore = defineStore("aiImages", {
    state: () => ({
        generatedImageUrl: "",
        requestLoading: false,
        generatedImagesV2: [] as NovitaImg[],
        imagesLoaded: false,
        toastMessage: "",
        random_ai_prompt: "",
        task_id: "",
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
        async cancelImageGenerationTask() {
            try {
                const response = await axios.post(API.cancel_task, {
                    task_id: this.task_id,
                });

                // TODO update toast message to show task was cancelled
                this.task_id = "";
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
                this.requestLoading = true;

                const response = await axios.post(
                    API.surprise_prompt,
                    userData
                );

                this.random_ai_prompt = response.data;
            } catch (err) {
                console.log(err);
            } finally {
                this.requestLoading = false;
            }
        },
        async getImageV2(userData: UserAIPrompt) {
            try {
                const userStore = useUserStore();
                this.requestLoading = true;
                this.imagesLoaded = false;

                // Start image generation task - get a task_id
                const taskIdResponse: AxiosResponse<ImageTaskStartedResponse> =
                    await axios.post(API.start_image_v2_task, {
                        data: userData,
                    });

                // With the task id we call to initiate backend polling for the task.
                // Once we get the images, we update our state.
                if (taskIdResponse.data.task_id) {
                    this.task_id = taskIdResponse.data.task_id;

                    const pollTaskStatus = () => {
                        const pollInterval = setInterval(async () => {
                            try {
                                const _resp = await axios.post(
                                    API.check_task_status,
                                    { task_id: taskIdResponse.data.task_id }
                                );

                                // Save the last task_id in localStorage
                                storage.s(
                                    STORAGE_KEYS.task_id,
                                    taskIdResponse.data.task_id as string
                                );

                                if (
                                    _resp.data.status === ApiTaskStatus.CANCELED
                                ) {
                                    clearInterval(pollInterval);
                                    this.requestLoading = false;
                                    this.imagesLoaded = false;
                                    this.toastMessage = "Task was cancelled";
                                    storage.rm(STORAGE_KEYS.task_id);
                                } else if (
                                    _resp.data.status === ApiTaskStatus.COMPLETE
                                ) {
                                    clearInterval(pollInterval);

                                    // Update state with images
                                    this.generatedImagesV2 =
                                        _resp.data?.images || [];

                                    // Update the token balance once successful
                                    if (
                                        _resp.data?.new_token_balance !==
                                        undefined
                                    ) {
                                        userStore.user.token_balance =
                                            _resp.data.new_token_balance;
                                    }

                                    if (this.generatedImagesV2?.length) {
                                        this.imagesLoaded = true;
                                        this.requestLoading = false;

                                        storage.s(
                                            STORAGE_KEYS.new_images,
                                            true
                                        );
                                        storage.rm(STORAGE_KEYS.task_id);
                                    }
                                } else if (
                                    _resp.data.status === ApiTaskStatus.FAILED
                                ) {
                                    clearInterval(pollInterval);
                                    this.requestLoading = false;
                                }
                            } catch (error) {
                                console.error(
                                    "Error checking task status:",
                                    error
                                );
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
                console.log(err);
                // TODO to something here
                this.toastMessage = (err as any).message;
            }
        },
    },
});
