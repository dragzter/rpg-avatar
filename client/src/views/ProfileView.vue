<template>
    <div id="user-profile">
        <div class="container">
            <div class="row">
                <h2 class="mb-4">User Profile</h2>

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
                                    @button-click="redeemCode"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ToastComponent
            :show="showToast"
            :message="redeemToastMessage"
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

const userStore = useUserStore();
const codeToRedeem = ref("");
const showToast = ref(false);

const rpgUser = computed(() => userStore.user);
const redeemToastMessage = computed(() => userStore.redeemToastMessage);
const userError = computed(() => userStore.userError);

watch(
    () => userError.value,
    (newUserErrpr) => {
        if (!newUserErrpr) {
            codeToRedeem.value = "";
            showToast.value = false;
        }
    }
);

const redeemCode = async () => {
    showToast.value = false;
    await userStore.redeemCode(rpgUser.value.id, codeToRedeem.value);
    showToast.value = true;
};
</script>
