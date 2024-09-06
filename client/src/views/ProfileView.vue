<template>
    <div id="user-profile">
        <div class="container">
            <div class="row">
                <h2 class="mb-4 title-2">User <span>Profile</span></h2>

                <div class="card w-100 mb-3 ps-0">
                    <div class="card-body p-0 d-flex">
                        <ul class="nav nav-tabs flex-column settings-nav-menu">
                            <li class="nav-item">
                                <a
                                    class="nav-link active"
                                    aria-current="page"
                                    href="#"
                                    >Profile</a
                                >
                            </li>
                        </ul>
                        <div class="p-3 user-details w-100">
                            <div
                                class="gap-4 d-flex align-items-center justify-content-between"
                            >
                                <div>
                                    <h5 class="card-title">Settings</h5>
                                    <p class="card-text">
                                        Welcome,
                                        <span class="user-nickname">{{
                                            rpgUser.nickname
                                        }}</span>
                                    </p>
                                </div>
                                <router-link
                                    to="generate-image"
                                    class="btn p-2 px-3 me-auto btn-primary"
                                >
                                    Generate
                                </router-link>
                                <div class="d-flex align-items-center">
                                    <p class="me-3 mb-0">Gen Tokens</p>
                                    <h5 class="user-tokens-wrapper mb-0">
                                        <span style="color: goldenrod"
                                            ><i
                                                class="fa-sharp fa-light fa-coins"
                                            ></i
                                        ></span>
                                        {{ rpgUser.token_balance }}
                                    </h5>
                                </div>
                            </div>

                            <hr />

                            <div class="position-relative">
                                <InputButtonSubmit
                                    v-model="codeToRedeem"
                                    placeholder-text="Code"
                                    button-text="Redeem"
                                    label-text="Redeem a "
                                    accent-text="TOKEN CODE"
                                    @button-click="
                                        redeemCode(
                                            RedemptionType.tokens,
                                            codeToRedeem
                                        )
                                    "
                                />

                                <InputButtonSubmit
                                    v-model="nsfwCode"
                                    placeholder-text="Code"
                                    button-text="Redeem"
                                    label-text="Redeem a "
                                    accent-text="CONTENT PASS CODE"
                                    @button-click="
                                        redeemCode(
                                            RedemptionType.nsfw,
                                            nsfwCode
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
                                        <strong>Content Limited!</strong> You
                                        currently do not have an NSFW content
                                        pass.
                                        <button
                                            type="button"
                                            class="btn btn-link p-0 m-0 align-baseline"
                                        >
                                            Upgrade
                                        </button>
                                        <button
                                            type="button"
                                            class="btn-close"
                                            data-bs-dismiss="alert"
                                            aria-label="Close"
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

        <ToastComponent
            :show="showToast"
            :message="toastMessage"
            :autoClose="true"
            :autoCloseDelay="6000"
            :isError="userError"
        />
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { computed, ref, watch } from "vue";
import InputButtonSubmit from "@/components/global/InputButtonSubmit.vue";
import ToastComponent from "@/components/global/ToastComponent.vue";
import { RedemptionType } from "@/stores/types";

/**
 * DATA
 */
const userStore = useUserStore();
const codeToRedeem = ref("");
const nsfwCode = ref("");
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
            codeToRedeem.value = "";
            nsfwCode.value = "";
            showToast.value = false;
        }
    }
);

/**
 * HANDLERS
 */
const redeemCode = async (codeType, code: string) => {
    showToast.value = false;
    await userStore.redeemCode(rpgUser.value.id, code, codeType);
    showToast.value = true;
};
</script>
