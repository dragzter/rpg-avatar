<template>
    <button
        :class="buttonClass"
        @click="handleClick"
        v-bind="tooltipAttributes"
    >
        <slot></slot>
    </button>
</template>

<script setup>
import { computed, defineEmits, defineProps } from "vue";

// Define props and emits
const props = defineProps({
    tooltipTitle: {
        type: String,
        default: "Download", // Default tooltip title
    },
    placement: {
        type: String,
        default: "left", // Default tooltip placement
    },
    enableTooltip: {
        type: Boolean,
        default: false, // Disable tooltip by default
    },
    buttonType: {
        type: String,
        default: "btn-primary", // Default button type class
        validator: (value) =>
            [
                "btn-primary",
                "btn-secondary",
                "btn-success",
                "btn-danger",
                "btn-warning",
                "btn-info",
                "btn-light",
                "btn-dark",
            ].includes(value),
    },
    buttonClasses: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
    emit("click");
};

// Compute the button class dynamically, incorporating additional classes
const buttonClass = computed(() => {
    return `btn ${props.buttonType} ${props.buttonClasses}`;
});

// Compute the tooltip attributes based on enableTooltip prop
const tooltipAttributes = computed(() => {
    if (props.enableTooltip) {
        return {
            "data-bs-toggle": "tooltip",
            "data-bs-placement": props.placement,
            "data-bs-title": props.tooltipTitle,
        };
    }
    return {};
});
</script>

<style scoped></style>
