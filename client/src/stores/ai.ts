import { defineStore } from "pinia";
import type { ImageGenResponse, NovitaImg, UserAIPrompt } from "@/stores/types";
import { API } from "@/utils/";
import axios, { type AxiosResponse } from "axios";
import { useUserStore } from "@/stores/user";

export const useAiStore = defineStore("aiImages", {
    state: () => ({
        generatedImageUrl: "",
        requestLoading: false,
        generatedImagesV2: [] as NovitaImg[],
        imagesLoaded: false,
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
        async getImageV2(userData: UserAIPrompt) {
            try {
                const userStore = useUserStore();
                this.requestLoading = true;
                this.imagesLoaded = false;

                const response: AxiosResponse<ImageGenResponse> =
                    await axios.post(API.image_v2, {
                        data: userData,
                    });

                this.generatedImagesV2 = response.data.images;

                // Update the token balance once successful
                if (response.data?.new_token_balance) {
                    userStore.user.token_balance =
                        response.data.new_token_balance;
                }

                if (this.generatedImagesV2.length) {
                    this.imagesLoaded = true;
                }
            } catch (err) {
                console.log(err);
            } finally {
                this.requestLoading = false;
            }
        },
    },
});
