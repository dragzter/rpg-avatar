<template>
    <button
        :class="buttonClass"
        :disabled="loading"
        v-bind="tooltipAttributes"
        @click="handleClick"
    >
        <slot></slot>
    </button>
</template>

<script setup>
import { computed } from "vue";

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
    },
    buttonClasses: {
        type: String,
        default: "",
    },
    loading: Boolean,
});

const emit = defineEmits(["click"]);

const handleClick = () => {
    emit("click");
};

// Compute the button class dynamically, incorporating additional classes
const buttonClass = computed(() => {
    return `${props.buttonType} ${props.buttonClasses}`;
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
