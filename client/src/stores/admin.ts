import { defineStore } from "pinia";
import { API } from "@/utils/";
import axios from "axios";
import type { CodesAddRequest, FeedbackItem, RPGAvatarUser } from "@/stores/types";

export const useAdminStore = defineStore("admin", {
    state: () => ({
        loading: false,
        toastMessage: "",
        existing_codes: {} as Record<string, any>,
        task_id: "",
        feedbackList: [] as FeedbackItem[],
        users: [] as RPGAvatarUser[],
    }),
    actions: {
        async getUserList() {
            try {
                this.loading = true;
                const response = await axios.get(API.get_user_list);
                this.users = response.data;
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
        },
        async addTokensToUser({ user_id, tokens }: { user_id: string; tokens: number }) {
            try {
                this.loading = true;
                const response = await axios.post(API.add_tokens_to_user, {
                    user_id,
                    tokens,
                });

                await this.getUserList();
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
        },
        async getFeedback() {
            try {
                this.loading = true;
                const response = await axios.get(API.get_feedback);
                this.feedbackList = response.data;
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
        },
        async addCodes(
            requestData: CodesAddRequest = {
                code_list: [],
                admin_id: "",
                type: "",
                code_value: 0,
                pass_id: "",
            }
        ) {
            try {
                this.loading = true;

                const response = await axios.post(API.admin_add_codes, requestData);
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
        },
        // TODO
        async getAllTokenCodes() {
            try {
                this.loading = true;

                const response = await axios.get(API.admin_get_token_codes);

                this.existing_codes = response.data;
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
        },
        // TODO
        async giftCodeToUserByEmail(email: string, code: string) {
            try {
                this.loading = true;

                const response = await axios.post(API.redeem_code, {
                    email,
                    code,
                });

                console.log(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
        },
    },
    getters: {
        availableCodes(state) {
            return state.existing_codes?.codes?.codes?.unredeemed || [];
        },
        redeemedCodes(state) {
            return state.existing_codes?.codes?.codes?.redeemed || [];
        },
    },
});
