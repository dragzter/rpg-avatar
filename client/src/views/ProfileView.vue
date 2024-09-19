<template>
    <div id="user-profile">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h2 class="mb-4 title-2">User <span>Profile</span></h2>

                    <div class="card w-100 mb-3 p-0">
                        <div class="card-body p-0 d-flex">
                            <div class="p-3 user-details w-100">
                                <div
                                    class="gap-4 d-flex align-items-center flex-column flex-sm-row justify-content-between"
                                >
                                    <div>
                                        <p class="card-text">
                                            Welcome,
                                            <span class="user-nickname">{{
                                                rpgUser.nickname
                                            }}</span>
                                        </p>
                                    </div>
                                    <div class="d-flex flex-row gap-5">
                                        <router-link
                                            class="btn p-2 px-3 m-0 me-md-auto btn-primary"
                                            to="generate-image"
                                        >
                                            Generate
                                        </router-link>
                                        <div class="d-flex align-items-center">
                                            <p
                                                class="me-3 d-none d-sm-block mb-0"
                                            >
                                                Gen Tokens
                                            </p>
                                            <router-link
                                                class="fw-light"
                                                data-bs-placement="top"
                                                data-bs-title="Buy More Tokens"
                                                data-bs-toggle="tooltip"
                                                to="get-tokens"
                                                ><h5
                                                    :class="{
                                                        'border-danger':
                                                            rpgUser.token_balance ===
                                                            0,
                                                    }"
                                                    class="user-tokens-wrapper mb-0"
                                                >
                                                    <span
                                                        style="color: goldenrod"
                                                        ><i
                                                            class="fa-sharp fa-light fa-coins"
                                                        ></i
                                                    ></span>
                                                    <span
                                                        :class="{
                                                            'text-danger':
                                                                rpgUser.token_balance ===
                                                                0,
                                                        }"
                                                        class="ms-2"
                                                        >{{
                                                            rpgUser.token_balance ||
                                                            0
                                                        }}</span
                                                    >
                                                </h5>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div class="position-relative">
                                    <InputButtonSubmit
                                        id="token-code-submit"
                                        v-model="tokenCodeToRedeem"
                                        accent-text="TOKEN CODE"
                                        button-text="Redeem"
                                        label-text="Redeem a "
                                        placeholder-text="Code"
                                        @button-click="
                                            redeemCodeV2(
                                                'token',
                                                tokenCodeToRedeem
                                            )
                                        "
                                    />

                                    <InputButtonSubmit
                                        id="pass-code-submit"
                                        v-model="passCodeToRedeem"
                                        accent-text="CONTENT PASS CODE"
                                        button-text="Redeem"
                                        label-text="Redeem a "
                                        placeholder-text="Code"
                                        @button-click="
                                            redeemCodeV2(
                                                'pass',
                                                passCodeToRedeem
                                            )
                                        "
                                    />
                                </div>

                                <hr />

                                <div class="card">
                                    <div class="card-header bg-info text-dark">
                                        Content Passes
                                    </div>
                                    <div class="card-body">
                                        <div
                                            v-if="!rpgUser.nsfw_pass"
                                            class="alert alert-warning alert-dismissible fade show"
                                            role="alert"
                                        >
                                            <strong>Content Limited!</strong>
                                            You currently do not have an NSFW
                                            content pass.
                                            <button
                                                class="btn btn-link p-0 m-0 align-baseline"
                                                type="button"
                                            >
                                                Upgrade
                                            </button>
                                            <button
                                                aria-label="Close"
                                                class="btn-close"
                                                data-bs-dismiss="alert"
                                                type="button"
                                            ></button>
                                        </div>

                                        <div
                                            class="d-flex mb-3 align-items-center nsfw-pass-entry"
                                        >
                                            <h5 class="mb-0">NSFW:</h5>
                                            <div
                                                v-if="!rpgUser.nsfw_pass"
                                                class="ms-2 badge fs-6 text-bg-secondary"
                                            >
                                                Unavailable
                                            </div>
                                            <div
                                                v-else
                                                class="ms-2 badge fs-6 text-bg-success"
                                            >
                                                Purchased
                                            </div>
                                        </div>

                                        <div
                                            class="d-flex mb-3 align-items-center nsfw-pass-entry"
                                        >
                                            <h5 class="mb-0">FaceCrunch:</h5>
                                            <div
                                                class="ms-2 badge fs-6 text-bg-secondary"
                                            >
                                                Unavailable
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ToastComponent
            :autoClose="true"
            :autoCloseDelay="6000"
            :isError="userError"
            :message="toastMessage"
            :show="showToast"
        />
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { computed, ref, watch } from "vue";
import InputButtonSubmit from "@/components/global/InputButtonSubmit.vue";
import ToastComponent from "@/components/global/ToastComponent.vue";

/**
 * DATA
 */
const userStore = useUserStore();
const tokenCodeToRedeem = ref("");
const passCodeToRedeem = ref("");
const showToast = ref(false);

/**
 * COMPUTED
 */
const rpgUser = computed(() => userStore.user);
const toastMessage = computed(() => userStore.toastMessage);
const userError = computed(() => userStore.userError);
const loading = computed(() => userStore.userLoading);

/**
 * WATCHERS
 */
watch(
    () => [userError.value, loading.value],
    (newValues) => {
        if (!newValues[0] && !newValues[1]) {
            passCodeToRedeem.value = "";
            showToast.value = false;
            tokenCodeToRedeem.value = "";
        }
    }
);

/**
 * HANDLERS
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
