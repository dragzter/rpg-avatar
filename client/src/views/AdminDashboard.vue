<template>
    <div id="admin-dashboard" class="container">
        <div class="row">
            <div class="col-12">
                <h1 class="title-2">Admin Dashboard</h1>
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Admin Tools</h2>
                    </div>
                    <div class="card-body pb-0 px-0">
                        <nav>
                            <div id="nav-tab-admin" class="nav nav-tabs" role="tablist">
                                <button
                                    id="nav-tools-tab"
                                    aria-controls="nav-tools"
                                    aria-selected="true"
                                    class="nav-link active ms-1 d-flex"
                                    data-bs-target="#nav-tools"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    type="button"
                                >
                                    <span class="me-1"><i class="fa-solid fa-screwdriver-wrench"></i></span>
                                    <span class="d-none d-md-inline-block">Tools</span>
                                </button>
                                <button
                                    id="nav-users-tab"
                                    aria-controls="nav-users"
                                    aria-selected="true"
                                    class="nav-link ms-1 d-flex"
                                    data-bs-target="#nav-users"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    type="button"
                                >
                                    <small class="image-cap-indicator me-1">{{ users?.length || 0 }}</small>
                                    <span class="me-1"><i class="fa-solid fa-users"></i></span>
                                    <span class="d-none d-md-inline-block">Users</span>
                                </button>
                                <button
                                    id="nav-feedback-tab"
                                    aria-controls="nav-feedback"
                                    aria-selected="true"
                                    class="nav-link ms-1 d-flex"
                                    data-bs-target="#nav-feedback"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    type="button"
                                >
                                    <small class="image-cap-indicator me-1">{{
                                        feedbackList?.length || 0
                                    }}</small>

                                    <span class="me-1"><i class="fa-solid fa-comments"></i></span>
                                    <span class="d-none d-md-inline-block">Feedback</span>
                                </button>

                                <button
                                    id="nav-codes-tab"
                                    aria-controls="nav-codes"
                                    aria-selected="true"
                                    class="nav-link ms-1 d-flex"
                                    data-bs-target="#nav-codes"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    type="button"
                                >
                                    <span class="me-1"><i class="fa-solid fa-tickets-simple"></i></span>
                                    <span class="d-none d-md-inline-block">Codes</span>
                                </button>
                            </div>
                        </nav>

                        <div id="nav-tabContent" class="tab-content">
                            <div
                                id="nav-tools"
                                aria-labelledby="nav-tool-tab"
                                class="tab-pane p-2 show active container-fluid tools-details"
                                role="tabpanel"
                            >
                                <div class="container-fluid">
                                    <div class="row mt-3">
                                        <div class="col-md-6 mb-4">
                                            <h5 class="mb-3">Add Codes</h5>
                                            <p class="text-muted">
                                                Codes need to be comma seperated. Add any number of unique
                                                codes.
                                            </p>
                                            <form>
                                                <SelectComponent
                                                    v-model="addCodesFormValues.type"
                                                    :enable-tooltip="true"
                                                    :options="codeTypeOptions"
                                                    class="w-100"
                                                    label="Code Type"
                                                    tooltip-text="Paste the codes you want to add, comma separated."
                                                />
                                                <input-component
                                                    v-model="addCodesFormValues.codes"
                                                    input-type="textarea"
                                                    label="Add Codes"
                                                />
                                                <input-component
                                                    v-if="addCodesFormValues.type === 'token'"
                                                    v-model="addCodesFormValues.code_value_each"
                                                    input-type="number"
                                                    label="Token value per code (e.g. 10, 50 etc.)"
                                                />
                                                <input-component
                                                    v-else
                                                    v-model="addCodesFormValues.pass_id"
                                                    input-type="text"
                                                    label="Pass ID (NSFW, FaceCrunch etc.)"
                                                />
                                                <button
                                                    :disabled="loading"
                                                    class="btn btn-tertiary"
                                                    type="submit"
                                                    @click="onAddCodesFormSubmit"
                                                >
                                                    <LoadSpinner v-if="loading" class="me-2" />
                                                    Add Codes
                                                </button>
                                            </form>
                                        </div>
                                        <!--                                        <div class="col-md-6">-->
                                        <!--                                            <h5 class="mb-4">Gift Tokens</h5>-->
                                        <!--                                            <p class="text-muted">-->
                                        <!--                                                Gift user tokens. Specify email and number of tokens.-->
                                        <!--                                            </p>-->
                                        <!--                                            <form>-->
                                        <!--                                                <input-component label="Recipient Email" />-->
                                        <!--                                                <input-component label="Amount" />-->
                                        <!--                                                <button-->
                                        <!--                                                    :disabled="loading"-->
                                        <!--                                                    class="btn btn-tertiary"-->
                                        <!--                                                    type="submit"-->
                                        <!--                                                >-->
                                        <!--                                                    <LoadSpinner v-if="loading" class="me-2" />-->
                                        <!--                                                    Submit-->
                                        <!--                                                </button>-->
                                        <!--                                            </form>-->
                                        <!--                                        </div>-->
                                    </div>
                                </div>
                            </div>

                            <div
                                id="nav-users"
                                aria-labelledby="nav-users-tab"
                                class="tab-pane p-2 show container-fluid users-details"
                                role="tabpanel"
                            >
                                <div class="row">
                                    <div class="mb-3 mt-2">
                                        <input
                                            v-model="searchQuery"
                                            class="form-control"
                                            placeholder="Search by name or email..."
                                            type="text"
                                        />
                                    </div>
                                    <div
                                        v-for="(user, index) in filteredUsers"
                                        :key="user.id"
                                        class="col-12 col-sm-6 col-md-4"
                                    >
                                        <div class="card w-100 mb-3">
                                            <div class="card-header p-2 fw-bold" style="min-height: 48px">
                                                <div
                                                    class="d-flex align-items-center justify-content-between"
                                                >
                                                    <template v-if="!addingTokens[index]">
                                                        <div
                                                            class="cursor-copy"
                                                            @click="
                                                                copyToClipboard(
                                                                    user?.nickname || user?.name || 'n/a'
                                                                )
                                                            "
                                                        >
                                                            <span class="me-2">{{
                                                                user.nickname || user.name
                                                            }}</span>
                                                            <i class="fa-regular text-faded-warn fa-copy"></i>
                                                        </div>
                                                        <div class="user-actions d-flex">
                                                            <button
                                                                class="btn btn-small btn-icon"
                                                                @click="toggleTokenAdd(index)"
                                                            >
                                                                <i class="fa-solid fa-coins"></i>
                                                            </button>
                                                        </div>
                                                    </template>

                                                    <template v-else>
                                                        <div
                                                            class="d-flex align-items-center justify-content-end"
                                                        >
                                                            <input
                                                                v-model="tokensToAdd"
                                                                class="me-2 w-100"
                                                                type="number"
                                                            />
                                                            <button
                                                                :disabled="!tokensToAdd || loading"
                                                                class="btn btn-dark"
                                                                style="font-size: 12px; padding: 4px 8px"
                                                                @click="addTokensToUser(user.id, tokensToAdd)"
                                                            >
                                                                Submit
                                                            </button>
                                                            <button
                                                                class="btn btn-close"
                                                                style="font-size: 12px"
                                                                @click="addingTokens[index] = false"
                                                            ></button>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                            <div class="card-body p-2 overflow-hidden">
                                                <small
                                                    class="d-block cursor-copy card-text text-warning"
                                                    @click="copyToClipboard(user.email)"
                                                    >{{ user.email }}
                                                    <i class="fa-regular text-faded-warn fa-copy"></i
                                                ></small>
                                                <small class="d-block card-text">
                                                    Img Count: {{ user.image_count }}
                                                </small>
                                                <small class="d-block card-text">
                                                    Tokens:
                                                    <span class="badge bg-primary">{{
                                                        user.token_balance
                                                    }}</span>
                                                </small>
                                                <small
                                                    class="muted cursor-copy text-nowrap bg-light text-dark border border-2 p-1 rounded-2"
                                                    style="font-size: 10px"
                                                    @click="copyToClipboard(user.id)"
                                                    >{{ user.id }} <i class="fa-regular text-info fa-copy"></i
                                                ></small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                id="nav-feedback"
                                aria-labelledby="nav-feedback-tab"
                                class="tab-pane p-2 show container-fluid feedback-details"
                                role="tabpanel"
                            >
                                <div class="row">
                                    <div v-for="f in feedbackList" class="col-6 col-sm-4 mb-2">
                                        <div class="p-3 rounded-3" style="border: 2px solid var(--dark-600)">
                                            <p class="mb-4 text-faded-warn">{{ f.user_name }}</p>
                                            <p class="text-muted">{{ f.feedback }}</p>
                                            <small>{{ nicerDate(f.createdAt) }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                id="nav-codes"
                                aria-labelledby="nav-codes-tab"
                                class="tab-pane p-2 show container-fluid code-details"
                                role="tabpanel"
                            >
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-header">
                                                <h5 class="card-title d-flex justify-content-between">
                                                    Token Codes
                                                    <span class="badge ms-2 text-bg-light">{{
                                                        adminStore.availableCodes.length
                                                    }}</span>
                                                </h5>
                                                <p class="text-muted mb-0">Unredeemed</p>
                                            </div>
                                            <div
                                                class="card-body p-1 overflow-auto"
                                                style="max-height: 580px; min-height: 580px"
                                            >
                                                <ul class="list-group list-group-flush">
                                                    <template v-for="code in adminStore.availableCodes">
                                                        <ButtonComponent
                                                            :class="{
                                                                'text-bg-info': copiedCoupon === code.code,
                                                            }"
                                                            button-classes="coupon-list-item rounded-1 mb-1 px-2 border-1 "
                                                            buttonType="list-group-item list-group-item-action "
                                                            @click="copyCode(code.code)"
                                                        >
                                                            <div
                                                                class="d-flex justify-content-between align-items-center"
                                                            >
                                                                <div>
                                                                    <small
                                                                        v-if="copiedCoupon === code.code"
                                                                        class="border d-inline-block animate__animated animate__bounceIn rounded-1 border-1 px-2 py-1"
                                                                        >COPIED</small
                                                                    >
                                                                    <small
                                                                        v-else
                                                                        class="border rounded-1 border-1 px-2 py-1"
                                                                        >Code:</small
                                                                    >
                                                                    <span
                                                                        class="fs-6 ms-3 fw-bold py-1 px-3"
                                                                        >{{ code.code }}</span
                                                                    >
                                                                </div>
                                                                <div class="me-2">
                                                                    <i class="fa-regular fa-copy"></i>
                                                                </div>
                                                            </div>
                                                        </ButtonComponent>
                                                    </template>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-header">
                                                <h5 class="card-title d-flex justify-content-between">
                                                    Inactive Codes
                                                    <span class="badge ms-2 text-bg-light">{{
                                                        adminStore.redeemedCodes.length
                                                    }}</span>
                                                </h5>
                                                <p class="text-muted mb-0">Redeemed</p>
                                            </div>
                                            <div
                                                class="card-body px-1 py-1 overflow-auto"
                                                style="max-height: 580px; min-height: 580px"
                                            >
                                                <ul class="list-group list-group-flush">
                                                    <template v-for="code in adminStore.redeemedCodes">
                                                        <ButtonComponent
                                                            :class="{
                                                                'text-bg-info': copiedCoupon === code.code,
                                                                'text-bg-secondary':
                                                                    copiedCoupon !== code.code,
                                                            }"
                                                            button-classes="coupon-list-item rounded-1  mb-1 px-2 border-1"
                                                            buttonType="list-group-item list-group-item-action"
                                                            @click="copyCode(code.code)"
                                                        >
                                                            <div
                                                                class="d-flex justify-content-between align-items-center"
                                                            >
                                                                <div>
                                                                    <small
                                                                        v-if="copiedCoupon === code.code"
                                                                        class="border rounded-1 border-1 px-2 py-1"
                                                                        >COPIED</small
                                                                    >
                                                                    <small
                                                                        v-else
                                                                        class="border rounded-1 border-1 px-2 py-1"
                                                                        >Code:</small
                                                                    >
                                                                    <span
                                                                        class="fs-6 ms-3 text-muted py-1 px-3"
                                                                        >{{ code.code }}
                                                                        <small class="text-warning"
                                                                            >(redeemed)</small
                                                                        ></span
                                                                    >
                                                                </div>
                                                                <div class="me-2">
                                                                    <i class="fa-regular fa-copy"></i>
                                                                </div>
                                                            </div>
                                                        </ButtonComponent>
                                                    </template>
                                                </ul>
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
            :autoCloseDelay="4000"
            :isError="false"
            :message="toastMessage"
            :show="showToast"
        />
    </div>
</template>
<script lang="ts" setup>
import InputComponent from "@/components/global/InputComponent.vue";
import SelectComponent from "@/components/global/SelectComponent.vue";
import { codeTypeOptions } from "@/utils/select-options";
import { computed, onMounted, ref } from "vue";
import LoadSpinner from "@/components/global/LoadSpinner.vue";
import { useAdminStore } from "@/stores/admin";
import { useUserStore } from "@/stores/user";
import ButtonComponent from "@/components/global/ButtonComponent.vue";
import ToastComponent from "@/components/global/ToastComponent.vue";
import { nicerDate } from "../utils/date-utils";

// DATA
const adminStore = useAdminStore();
const userStore = useUserStore();
const giftFormValues = ref({
    recipient_email: "",
    value: "",
    type: "",
});
const addCodesFormValues = ref({
    type: "",
    codes: "",
    pass_id: "",
    code_value_each: "",
});

const searchQuery = ref("");
const showToast = ref(false);
const toastMessage = ref("");
const addingTokens = ref<boolean[]>([]);
const tokensToAdd = ref(0);
const copiedCoupon = ref("");

// COMPUTED
const userId = computed(() => userStore.user.id);
const loading = computed(() => adminStore.loading);
const users = computed(() => adminStore.users);
const feedbackList = computed(() => adminStore.feedbackList);

const filteredUsers = computed(() =>
    users.value.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

// HANDLERS
const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);

    showToast.value = true;
    toastMessage.value = `Copied ${code} to clipboard!`;

    copiedCoupon.value = code;

    setTimeout(() => {
        showToast.value = false;
        toastMessage.value = "";
    }, 4000);
};

const addTokensToUser = async (user_id, tokens) => {
    await adminStore.addTokensToUser({ user_id, tokens });
    tokensToAdd.value = 0;
};

const onAddCodesFormSubmit = async (e: Event) => {
    e.preventDefault();
    const codes = addCodesFormValues.value.codes.split(",");

    await adminStore.addCodes({
        code_list: codes,
        code_value: parseInt(addCodesFormValues.value.code_value_each),
        type: addCodesFormValues.value.type,
        pass_id: addCodesFormValues.value.pass_id,
        admin_id: userId.value,
    });

    // Reset form values
    addCodesFormValues.value = {
        type: "",
        codes: "",
        pass_id: "",
        code_value_each: "",
    };
};

const toggleTokenAdd = (index) => {
    // close all other token adders
    addingTokens.value = addingTokens.value.map(() => false);
    addingTokens.value[index] = !addingTokens.value[index];
};

/**
 * Function to copy text to clipboard.
 * @param {string} text - The text to copy.
 */
const copyToClipboard = async (text: string) => {
    showToast.value = false;

    try {
        await navigator.clipboard.writeText(text);
        showToast.value = true;
        toastMessage.value = `Copied ${text} to clipboard!`;

        setTimeout(() => {
            showToast.value = false;
            toastMessage.value = "";
        }, 4000);
    } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy. Please try again.");
    }
};

// LIFECYCLE HOOKS
onMounted(async () => {
    await Promise.all([adminStore.getAllTokenCodes(), adminStore.getUserList(), adminStore.getFeedback()]);
});
</script>
