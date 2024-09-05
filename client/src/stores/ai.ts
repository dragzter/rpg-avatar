import { defineStore } from "pinia";
import type { NovitaImg, UserAIPrompt } from "@/stores/types";
import { API } from "@/utils/product";
import axios from "axios";

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
                this.requestLoading = true;
                this.imagesLoaded = false;
                const response = await axios.post(API.image_v2, {
                    data: userData,
                });

                this.generatedImagesV2 = response.data;

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
