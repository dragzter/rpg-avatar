import { defineStore } from "pinia";
import type { RedeemAPIResponse, RPGAvatarUser } from "@/stores/types";
import { User } from "@auth0/auth0-vue";
import axios, { type AxiosResponse } from "axios";
import { API } from "@/utils/product";

export const useUserStore = defineStore("user", {
    state: () => ({
        userLoaded: false,
        userLoading: false,
        user: {} as RPGAvatarUser,
        auth0User: {} as User,
        redeemToastMessage: "",
        userError: false,
    }),
    actions: {
        async redeemCode(userId: string, code: string) {
            // redeem code
            try {
                const response: AxiosResponse<RedeemAPIResponse> =
                    await axios.patch(API.redeem_code, {
                        code,
                        userId,
                    });

                if (response.data.success) {
                    this.user.token_balance = response.data.newBalance;
                }
                this.redeemToastMessage = response.data.message;
                this.userError = false;
            } catch (error) {
                this.userError = true;
                this.redeemToastMessage = (error as any).response.data.message;
            }
        },

        async disableUser() {
            // TODO disable user (ui and api)
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

                console.log(response.data);
                this.user = response.data;
                this.userLoaded = true;
            } catch (err) {
                console.log(err);
            } finally {
                this.userLoaded = false;
            }
        },
    },
});
