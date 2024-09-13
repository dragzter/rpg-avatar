<template>
    <div class="container">
        <div class="row">
            <div class="col">
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
    </div>
</template>
<script lang="ts" setup>
import InputComponent from "@/components/global/InputComponent.vue";
import SelectComponent from "@/components/global/SelectComponent.vue";
import { codeTypeOptions } from "@/utils/select-options";
import { computed, ref } from "vue";
import LoadSpinner from "@/components/global/LoadSpinner.vue";
import { useAdminStore } from "@/stores/admin";
import { useUserStore } from "@/stores/user";

const adminStore = useAdminStore();
const userStore = useUserStore();

const userId = computed(() => userStore.user.id);
const loading = computed(() => adminStore.loading);

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
</script>
