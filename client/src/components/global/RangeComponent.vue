<template>
    <div class="mb-0 pb-2">
        <label :for="id" class="form-label">
            {{ label }}

            <ButtonComponent
                v-if="enableTooltip"
                :enable-tooltip="true"
                :loading="loading"
                :tooltip-title="tooltipText"
                button-classes="bg-transparent border-0 ps-1 p-0"
                button-type="btn-dark"
            >
                <i class="fa-regular fa-circle-info"></i>
            </ButtonComponent>
        </label>
        <div class="d-flex align-items-center">
            <input
                :id="id"
                :disabled="loading || disabled"
                :max="max"
                :min="min"
                :step="step"
                :value="modelValue"
                class="form-range"
                type="range"
                @input="onInput"
            />
            <div class="range-counter">{{ modelValue }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ButtonComponent from "@/components/global/ButtonComponent.vue";

const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 100,
    },
    step: {
        type: Number,
        default: 1,
    },
    label: {
        type: String,
        default: "",
    },
    id: {
        type: String,
        default: "range-component",
    },
    enableTooltip: {
        type: Boolean,
        default: false,
    },
    tooltipText: {
        type: String,
        default: "",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

const onInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    emit("update:modelValue", Number(value));
};
</script>

<style scoped>
/* Add any necessary styles */

.range-counter {
    padding: 3px 12px;
    margin-left: 12px;
    min-width: 70px;
    text-align: center;
    border-radius: 8px;
    color: #fff;
    border: 2px solid #313151 !important;
}
</style>
