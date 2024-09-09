import {defineStore} from "pinia";
import type {ImageTaskStartedResponse, NovitaImg, UserAIPrompt,} from "@/stores/types";
import {API} from "@/utils/";
import axios, {type AxiosResponse} from "axios";
import {useUserStore} from "@/stores/user";

export const useAiStore = defineStore("aiImages", {
    state: () => ({
        generatedImageUrl: "",
        requestLoading: false,
        generatedImagesV2: [] as NovitaImg[],
        imagesLoaded: false,
        toastMessage: "",
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
                console.log(response);
            } catch (err) {
                console.log(err);
            }
        },
        async getImageV2(userData: UserAIPrompt) {
            try {
                const userStore = useUserStore();
                this.requestLoading = true;
                this.imagesLoaded = false;

                // Start image generation task - get a task_id
                const taskResponse: AxiosResponse<ImageTaskStartedResponse> =
                    await axios.post(API.start_image_v2_task, {
                        data: userData,
                    });

                // With the task id we call to initiate backend polling for the task.
                // Once we get the images, we update our state.
                if (taskResponse.data.task_id) {
                    this.task_id = taskResponse.data.task_id;
                    const imageResponse = await axios.post(API.image_v2, {
                        task_id: taskResponse.data.task_id,
                    });

                    this.generatedImagesV2 = imageResponse.data?.images || [];

                    // Update the token balance once successful
                    if (imageResponse.data?.new_token_balance) {
                        userStore.user.token_balance =
                            imageResponse.data.new_token_balance;
                    }
                }

                if (this.generatedImagesV2?.length) {
                    this.imagesLoaded = true;
                }
            } catch (err) {
                console.log(err);
                // TODO to something here
                this.toastMessage = (err as any).message;
            } finally {
                this.requestLoading = false;
            }
        },
    },
});
