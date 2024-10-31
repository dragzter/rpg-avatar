<template>
    <div class="p-3">
        <!-- User summary row-->
        <div class="row pt-4 mb-3">
            <div class="col">
                <h5 class="user-greeting">
                    Welcome,
                    <span class="user-nickname">{{ rpgUser.nickname }}</span>
                </h5>
            </div>
            <div class="col text-end">
                <router-link
                    class="fw-light"
                    data-bs-placement="top"
                    data-bs-title="Buy More Tokens"
                    data-bs-toggle="tooltip"
                    to="get-tokens"
                    ><h5
                        :class="{
                            'border-danger': rpgUser.token_balance === 0,
                        }"
                        class="user-tokens-wrapper d-inline-block mb-0"
                    >
                        <span style="color: goldenrod"><i class="fa-sharp fa-light fa-coins"></i></span>
                        <span
                            :class="{
                                'text-danger': rpgUser.token_balance === 0,
                            }"
                            class="ms-2"
                            >{{ rpgUser.token_balance || 0 }}</span
                        >
                    </h5>
                </router-link>
            </div>
        </div>

        <!-- User details row-->
        <dl class="row rounded-3 bg-dark-600">
            <dt>
                <h5 class="mb-5 text-white">User Details</h5>
            </dt>

            <dt class="col-sm-3">Email</dt>
            <dd class="col-sm-9">
                <p class="lead">
                    {{ rpgUser?.email || "No email on file." }}
                </p>
            </dd>

            <dt class="col-sm-3">Nickname</dt>
            <dd class="col-sm-9">
                <p class="lead">
                    {{ rpgUser.nickname }}
                </p>
            </dd>

            <dt class="col-sm-3">Images Saved</dt>
            <dd class="col-sm-9">
                <p class="lead">
                    {{ rpgUser?.image_count || 0 }}
                </p>
            </dd>

            <dt class="col-sm-3">Signed AI Disclaimer</dt>
            <dd class="col-sm-9">
                <p class="lead">
                    {{ rpgUser.disclaimer_signed_on_date }}
                </p>
            </dd>

            <dt class="col-sm-3">User ID</dt>
            <dd class="col-sm-9">
                <p class="lead text-success">
                    {{ rpgUser.id }}
                </p>
            </dd>
        </dl>

        <!-- User passes row-->
        <div class="row" id="redeem-passes-row">
            <div class="col bg-dark-600 rounded-3">
                <h5 class="text-white p-2 my-2">Redeem Codes</h5>
                <div class="position-relative p-2 flex-column flex-md-row d-flex gap-4">
                    <InputButtonSubmit
                        id="token-code-submit"
                        v-model="tokenCodeToRedeem"
                        accent-text="TOKEN CODE"
                        button-text="Redeem"
                        label-text="Redeem a "
                        placeholder-text="Code"
                        @button-click="redeemCodeV2('token', tokenCodeToRedeem)"
                    />

                    <InputButtonSubmit
                        id="pass-code-submit"
                        v-model="passCodeToRedeem"
                        accent-text="CONTENT PASS CODE"
                        button-text="Redeem"
                        label-text="Redeem a "
                        placeholder-text="Code"
                        @button-click="redeemCodeV2('pass', passCodeToRedeem)"
                    />
                </div>
            </div>
        </div>
    </div>

    <ToastComponent
        :autoClose="true"
        :autoCloseDelay="2000"
        :isError="userError"
        :message="toastMessage"
        :show="showToast"
    />
</template>
<script setup lang="ts">
import InputButtonSubmit from "@/components/global/InputButtonSubmit.vue";
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/user";
import ToastComponent from "@/components/global/ToastComponent.vue";

/**
 * =*'^'*= DATA =*'^'*=
 */
const userStore = useUserStore();
const tokenCodeToRedeem = ref("");
const passCodeToRedeem = ref("");
const showToast = ref(false);

/**
 * =*'^'*= COMPUTED =*'^'*=
 */
const rpgUser = computed(() => userStore.user);
const toastMessage = computed(() => userStore.toastMessage);
const userError = computed(() => userStore.userError);

/**
 * =*'^'*= METHODS =*'^'*=
 */
const redeemCodeV2 = async (codeType: "token" | "pass", code: string) => {
    showToast.value = false;
    await userStore.redeemCodeV2({
        user_id: rpgUser.value.id,
        code,
        type: codeType,
    });
    showToast.value = true;
    passCodeToRedeem.value = "";
    tokenCodeToRedeem.value = "";
};
</script>
<style scoped></style>
