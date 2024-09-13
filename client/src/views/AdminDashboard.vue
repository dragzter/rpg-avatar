<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1 class="title-2">Admin Dashboard</h1>
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Admin Tools</h2>
                    </div>
                    <div class="card-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-6 mb-4">
                                    <h5 class="card-header text-bg-dark mb-3">
                                        Add Codes
                                    </h5>
                                    <p class="text-muted">
                                        Codes need to be comma seperated. Add
                                        any number of unique codes.
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
                                            v-if="
                                                addCodesFormValues.type ===
                                                'token'
                                            "
                                            v-model="
                                                addCodesFormValues.code_value_each
                                            "
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
                                            <LoadSpinner
                                                v-if="loading"
                                                class="me-2"
                                            />
                                            Add Codes
                                        </button>
                                    </form>
                                </div>
                                <div class="col-md-6">
                                    <h5 class="card-header text-bg-dark mb-4">
                                        Gift Tokens
                                    </h5>
                                    <p class="text-muted">
                                        Gift user tokens. Specify email and
                                        number of tokens.
                                    </p>
                                    <form>
                                        <input-component
                                            label="Recipient Email"
                                        />
                                        <input-component label="Amount" />
                                        <button
                                            :disabled="loading"
                                            class="btn btn-tertiary"
                                            type="submit"
                                        >
                                            <LoadSpinner
                                                v-if="loading"
                                                class="me-2"
                                            />
                                            Submit
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title d-flex justify-content-between">
                            Token Codes
                            <span
                                class="badge ms-2 rounded-pill text-bg-light"
                                >{{ adminStore.availableCodes.length }}</span
                            >
                        </h5>
                        <p class="text-muted mb-0">Unredeemed</p>
                    </div>
                    <div
                        class="card-body overflow-auto"
                        style="max-height: 380px; min-height: 380px"
                    >
                        <ul class="list-group list-group-flush">
                            <template v-for="code in adminStore.availableCodes">
                                <ButtonComponent
                                    :enable-tooltip="true"
                                    button-classes="coupon-list-item mb-1 px-2 border-1 rounded-5"
                                    buttonType="list-group-item list-group-item-action "
                                    tooltip-title="Click to copy code"
                                    @click="copyCode(code.code)"
                                >
                                    <div
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <small
                                                class="border rounded-5 border-1 px-2 py-1"
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
                            <span
                                class="badge ms-2 rounded-pill text-bg-light"
                                >{{ adminStore.redeemedCodes.length }}</span
                            >
                        </h5>
                        <p class="text-muted mb-0">Redeemed</p>
                    </div>
                    <div
                        class="card-body overflow-auto"
                        style="max-height: 380px; min-height: 380px"
                    >
                        <ul class="list-group list-group-flush">
                            <template v-for="code in adminStore.redeemedCodes">
                                <ButtonComponent
                                    :enable-tooltip="true"
                                    button-classes="coupon-list-item text-bg-secondary rounded-5 mb-1 px-2 border-1"
                                    buttonType="list-group-item list-group-item-action"
                                    tooltip-title="Click to copy inactive code"
                                    @click="copyCode(code.code)"
                                >
                                    <div
                                        class="d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <small
                                                class="border rounded-5 border-1 px-2 py-1"
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

// COMPUTED
const userId = computed(() => userStore.user.id);
const loading = computed(() => adminStore.loading);

// HANDLERS
const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
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

// LIFECYCLE HOOKS
onMounted(async () => {
    await adminStore.getAllTokenCodes();
});
</script>
