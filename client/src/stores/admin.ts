import { defineStore } from "pinia";
import { API } from "@/utils/";
import axios from "axios";
import type { CodesAddRequest } from "@/stores/types";

export const useAdminStore = defineStore("admin", {
    state: () => ({
        loading: false,
        toastMessage: "",
        existing_codes: [],
        task_id: "",
    }),
    actions: {
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

                console.log(requestData);
                const response = await axios.post(
                    API.admin_add_codes,
                    requestData
                );

                console.log(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
        },
        // TODO
        async getAllCodes() {
            try {
                this.loading = true;

                const response = await axios.get(API.admin_add_codes);

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
});
