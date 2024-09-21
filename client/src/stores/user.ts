import { defineStore } from "pinia";
import type {
    CodeRedeemRequest,
    RedeemAPIResponse,
    RPGAvatarUser,
    UserImage,
    UserImageResponse,
} from "@/stores/types";
import { User } from "@auth0/auth0-vue";
import axios, { type AxiosResponse } from "axios";
import { API, STORAGE_KEYS } from "@/utils/";
import { storage } from "@/utils/storage";

export const useUserStore = defineStore("user", {
    state: () => ({
        userLoaded: false,
        userLoading: false,
        user: {} as RPGAvatarUser,
        auth0User: {} as User,
        toastMessage: "",
        userError: false,
        imageThumbnails: [] as UserImage[],
        images: [] as UserImage[],
    }),
    actions: {
        async redeemCodeV2(
            redemptionData: CodeRedeemRequest = {
                code: "",
                user_id: "",
                type: "token",
            }
        ) {
            // redeem code
            try {
                this.userLoading = true;
                const response: AxiosResponse<RedeemAPIResponse> =
                    await axios.post(API.redeem_code_v2, redemptionData);

                if (response.data?.token_balance) {
                    this.user.token_balance = response.data.token_balance;
                }

                if (response.data?.passes) {
                    this.user.passes = response.data.passes;
                }

                this.toastMessage = response.data?.message || "";
                this.userError = false;
            } catch (error) {
                this.userError = true;
                this.toastMessage = (error as any).response.data.message;
            }
        },

        async deleteImage({ file_key, user_id }) {
            try {
                this.userLoading = true;
                const response = await axios.post(API.delete_image, {
                    file_key,
                    user_id,
                });

                this.images = this.images.filter(
                    (image) => image.key !== file_key
                );

                let thumbnailKey = file_key.replace("/", "/thumbnails/");
                thumbnailKey = thumbnailKey.replace(".image.", ".thumbnail.");

                this.imageThumbnails = this.imageThumbnails.filter(
                    (image) => image.key !== thumbnailKey
                );

                storage.s(STORAGE_KEYS.thumbnails, {
                    thumbnails: this.imageThumbnails,
                });
                storage.s(STORAGE_KEYS.images, {
                    images: this.images,
                });

                if (response.data?.success === true) {
                    this.user.image_count = response.data.image_count;
                }

                this.toastMessage = response.data.message;
            } catch (error) {
                console.log(error);
            } finally {
                this.userLoading = false;
            }
        },

        async fetchImages(user_id) {
            try {
                this.userLoading = true;
                const response: AxiosResponse<UserImageResponse> =
                    await axios.get(API.get_images + `/${user_id}`);

                this.imageThumbnails = response.data?.thumbnails as UserImage[];
                this.images = response.data?.images as UserImage[];

                if (this.imageThumbnails?.length || this.images?.length) {
                    storage.s(STORAGE_KEYS.thumbnails, {
                        thumbnails: this.imageThumbnails,
                    });

                    storage.s(STORAGE_KEYS.images, {
                        images: this.images,
                    });

                    storage.s(
                        STORAGE_KEYS.images_requested_on,
                        response.data?.requested_on || new Date().toISOString()
                    );
                }

                storage.rm(STORAGE_KEYS.new_images);
            } catch (error) {
                console.log(error);
            }
        },

        async deleteUserAccount({ userId }) {
            try {
                this.userLoading = true;
                await axios.post(API.delete_user, { userId });
            } catch (error) {
                console.log(error);
            } finally {
                this.userLoading = false;
            }
        },

        async disableUser() {
            // TODO disable user (ui and api)
        },

        async signPurchaseDisclaimer(userId: string) {
            try {
                const response = await axios.patch(API.sign_disclaimer, {
                    userId,
                });

                this.toastMessage = response.data.message;
            } catch (error) {
                console.log(error);
            }
        },

        async getUser(user: User) {
            // We always use the Auth0 user to GET/POST user details.
            // The server will check if the user exists, then if it
            // does, the user will be returned.  If the user does not exist
            // The user will have some fields initialized and then saved.
            try {
                this.userLoaded = false;
                this.userLoading = true;

                const response = await axios.post(
                    API.get_user + `/${user.sub}`,
                    user
                );

                this.user = response.data;
                this.userLoaded = true;
            } catch (err) {
                console.log(err);
            } finally {
                this.userLoaded = false;
            }
        },
    },
    getters: {
        isAdmin: (state) => {
            return state.user?.admin;
        },
    },
});
