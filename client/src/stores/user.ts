import { defineStore } from "pinia";
import type {
    CodeRedeemRequest,
    FeedbackPost,
    PromptHistoryItem,
    QuickPromptHistory,
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
        currentPage: 1,
        totalPages: 1,
        limit: 50,
        imagesLoading: false,
        imageThumbnails: [] as UserImage[],
        images: [] as UserImage[],
        promptsHistory: [] as PromptHistoryItem[], // Is this useful?
        quickHistory: [] as QuickPromptHistory[],
        userPromptsLoading: false,
        selectedPrompt: {} as PromptHistoryItem,
        visiblePrompts: 0,
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
                const response: AxiosResponse<RedeemAPIResponse> = await axios.post(
                    API.redeem_code_v2,
                    redemptionData
                );

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

        async submitFeedback({ stars, feedback, user_id, feedback_key }: FeedbackPost) {
            try {
                const response = await axios.post(API.submit_feedback, {
                    stars,
                    feedback,
                    user_id,
                    feedback_key,
                });

                // Update user tokens if response is successful and has a token_balance
                if (response.data.success && response.data.new_token_balance) {
                    this.user.token_balance = response.data.token_balance;
                    await this.getUserById(user_id);
                }
            } catch (error) {
                console.log(error);
            }
        },

        async deleteManyPrompts({ prompt_ids, user_id }) {
            try {
                this.userPromptsLoading = true;
                // expected:  const { user_id, prompt_ids, file_keys } = req.body;
                const response = await axios.post(API.delete_many_prompts, {
                    prompt_ids,
                    user_id,
                });

                if (response.data.success) {
                    this.toastMessage = response.data.message;
                    this.images = this.images.filter((image) => {
                        return !response.data.deleted_files.includes(image.key);
                    });
                    this.imageThumbnails = this.imageThumbnails.filter((image) => {
                        return !response.data.deleted_files.includes(image.key);
                    });

                    storage.s(STORAGE_KEYS.thumbnails, {
                        thumbnails: this.imageThumbnails,
                    });
                    storage.s(STORAGE_KEYS.images, { images: this.images });
                    this.user.image_count = response.data.image_count;
                    this.selectedPrompt = {} as PromptHistoryItem;
                    this.quickHistory = this.quickHistory.filter(
                        (item) => !prompt_ids.includes(item.prompt_id)
                    );
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.userPromptsLoading = false;
            }
        },

        async deletePrompt(prompt_id) {
            try {
                const response = await axios.post(API.delete_prompt, {
                    prompt_id,
                });

                if (response.data.success) {
                    this.toastMessage = response.data.message;

                    const deleteFilesFromState = response.data.deleted_files as string[];
                    this.images = this.images.filter((image) => {
                        return !deleteFilesFromState.includes(image.key);
                    });
                    this.imageThumbnails = this.imageThumbnails.filter((image) => {
                        return !deleteFilesFromState.includes(image.key);
                    });

                    // update storage
                    storage.s(STORAGE_KEYS.thumbnails, {
                        thumbnails: this.imageThumbnails,
                    });
                    storage.s(STORAGE_KEYS.images, {
                        images: this.images,
                    });

                    // update user image count
                    this.user.image_count = response.data.image_count;

                    // reset the selected prompt
                    this.selectedPrompt = {} as PromptHistoryItem;
                    // remove prompt from quick history
                    this.quickHistory = this.quickHistory.filter((item) => item.prompt_id !== prompt_id);

                    this.visiblePrompts =
                        this.quickHistory.filter((item) => (item?.urls ?? []).length > 0).length || 0;
                }
            } catch (error) {
                console.log(error);
            }
        },

        async deleteEmptyPrompts(user_id) {
            try {
                const response = await axios.delete(`${API.delete_empty_prompts}/${user_id}`);

                if (response?.data?.success && response.data.deleted_prompts) {
                    this.toastMessage = response.data.message;
                    this.selectedPrompt = {} as PromptHistoryItem;

                    this.quickHistory = this.quickHistory.filter(
                        (item) => !response.data?.deleted_prompts.includes(item.prompt_id)
                    );
                }
            } catch (error) {
                console.log(error);
            }
        },

        async fetchImagesPaginated(user_id: string, p = { page: 1, limit: 50 }) {
            try {
                this.images = [];
                this.imageThumbnails = Array.from({ length: p.limit }, () => ({
                    key: "placeholder", // Or a unique identifier if needed
                    url: "https://placehold.co/200x200/142434/FFF?text=...", // Empty URL or
                    // placeholder image
                })) as UserImage[];
                this.userLoading = true;
                this.imagesLoading = true;

                const response: AxiosResponse<UserImageResponse> = await axios.get(
                    `${API.get_images_paginated}/${user_id}?page=${p.page}&limit=${p.limit}`
                );

                this.imageThumbnails = response.data?.thumbnails as UserImage[];
                this.images = response.data?.images as UserImage[];

                // Store pagination metadata
                this.totalPages = response.data?.total_pages || 1;
                this.currentPage = p.page;
                this.limit = p.limit;

                if (this.imageThumbnails?.length || this.images?.length) {
                    // Store images and timestamps in local storage if needed
                    storage.s(STORAGE_KEYS.page, this.currentPage || 1);
                    storage.s(STORAGE_KEYS.thumbnails, { thumbnails: this.imageThumbnails });
                    storage.s(STORAGE_KEYS.images, { images: this.images });
                    storage.s(
                        STORAGE_KEYS.images_requested_on,
                        response.data?.requested_on || new Date().toISOString()
                    );
                }

                storage.rm(STORAGE_KEYS.new_images);
            } catch (error) {
                console.log("Error fetching images:", error);
            } finally {
                this.userLoading = false;
                this.imagesLoading = false;
            }
        },

        async fetchImages(user_id: string) {
            try {
                this.images = [];
                this.userLoading = true;
                this.imagesLoading = true;
                const response: AxiosResponse<UserImageResponse> = await axios.get(
                    API.get_images + `/${user_id}`
                );

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
            } finally {
                this.userLoading = false;
                this.imagesLoading = false;
            }
        },

        async fetchPromptByPromptId(promptId: string) {
            try {
                this.userPromptsLoading = true;
                const response = await axios.get(API.get_prompt + `/${promptId}`);

                const imgURLS = [] as string[];
                const thumbURLS = [] as string[];
                if (response.data?.thumbnails) {
                    const thumbnails = storage.g(STORAGE_KEYS.thumbnails);
                    for (const thumbnail of response.data?.thumbnails) {
                        const tn = thumbnails.thumbnails.find((t) => t.key === thumbnail);
                        if (tn) {
                            thumbURLS.push(tn.url as string);
                        }
                    }

                    for (const fn of response.data?.file_names) {
                        const img = this.images.find((im) => {
                            return im.key.includes(fn);
                        });

                        if (img) {
                            imgURLS.push(img.url);
                        }
                    }
                }

                this.selectedPrompt = {
                    ...response.data,
                    urls: thumbURLS,
                    imgURLS,
                };
            } catch (error) {
                console.log(error);
            } finally {
                this.userPromptsLoading = false;
            }
        },

        async fetchQuickPromptsHistory(userId: string) {
            try {
                this.userPromptsLoading = true;
                const response = await axios.get(API.get_user_prompts + `/${userId}`);

                if (response.data?.length) {
                    const thumbnails = storage.g(STORAGE_KEYS.thumbnails);

                    for (const prompt of response.data) {
                        const urls = [] as string[];
                        if (!prompt.thumbnails) continue;

                        for (const thumbnail of prompt.thumbnails) {
                            const tn = thumbnails.thumbnails.find((t) => t.key === thumbnail);
                            if (tn) {
                                urls.push(tn.url as string);
                            }
                        }

                        prompt.urls = urls;
                    }
                }

                // Count how many items in response.data have the property urls.length > 0
                this.visiblePrompts = response.data.filter((item) => item.urls.length > 0).length;

                this.quickHistory = response.data;
            } catch (error) {
                console.log(error);
            } finally {
                this.userPromptsLoading = false;
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

        async deleteImage({ file_key, user_id }) {
            try {
                this.userLoading = true;
                const response = await axios.post(API.delete_image, {
                    file_key,
                    user_id,
                });

                this.images = this.images.filter((image) => image.key !== file_key);

                let thumbnailKey = file_key.replace("/", "/thumbnails/");
                thumbnailKey = thumbnailKey.replace(".image.", ".thumbnail.");

                this.imageThumbnails = this.imageThumbnails.filter((image) => image.key !== thumbnailKey);

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

        // This gets the user by id directly from the DB without attempting to create a new user
        async getUserById(userId: string) {
            try {
                this.userLoaded = false;
                this.userLoading = true;

                const response = await axios.get(API.get_user_by_id + `/${userId}`);

                if (response.data.user) {
                    this.user = response.data.user;
                    this.userLoaded = true;
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.userLoading = false;
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

                const response = await axios.post(API.get_user + `/${user.sub}`, user);

                this.user = response.data;
                this.userLoaded = true;
            } catch (err) {
                console.log(err);
            } finally {
                this.userLoaded = true;
                this.userLoading = false;
            }
        },
    },
    getters: {
        isAdmin: (state) => {
            return state.user?.admin;
        },
    },
});
