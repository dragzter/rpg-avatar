<template>
    <div class="mb-3 pb-2">
        <label :for="id" class="form-label">
            {{ label }}

            <ButtonComponent
                v-if="enableTooltip"
                button-type="btn-dark"
                :enable-tooltip="true"
                :tooltip-title="tooltipText"
                button-classes="bg-transparent border-0 ps-1"
            >
                <i class="fa-regular fa-circle-info"></i>
            </ButtonComponent>
        </label>
        <div class="d-flex align-items-center">
            <input
                :id="id"
                type="range"
                :min="min"
                :max="max"
                :step="step"
                :value="modelValue"
                class="form-range"
                @input="onInput"
            />
            <div class="range-counter">{{ modelValue }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
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
    padding: 3px 18px;
    margin-left: 12px;
    min-width: 90px;
    text-align: center;
    border-radius: 8px;
    color: #fff;
    border: 2px solid #313151 !important;
}
</style>
