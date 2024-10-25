<template>
    <div
        :id="wrapperId"
        :class="{
            'rpg-option-inactive': !isChecked,
            'rpg-option-active': isChecked,
            is_disabled: loading,
        }"
        class="rpg-generator-option d-flex justify-content-between align-items-center"
        @click="toggleStatus"
        style="cursor: pointer"
    >
        <p class="m-0">
            {{ label }}
            <ButtonComponent
                button-type="btn-dark"
                data-bs-placement="top"
                :enable-tooltip="true"
                :tooltip-title="tooltipText"
                button-classes="bg-transparent border-0 ps-1"
            >
                <i class="fa-regular fa-circle-info"></i>
            </ButtonComponent>
        </p>
        <div class="form-check form-switch d-flex align-items-center">
            <input
                v-if="showToggle"
                class="form-check-input prompt-rpg-checkbox"
                type="checkbox"
                :id="id"
                :checked="isChecked"
                @click.stop="toggleStatus"
            />
            <label class="form-check-label text-end" :for="id">
                <span class="accent-text" v-if="isChecked">{{ activeText }}</span>
                <span v-else>{{ inactiveText }}</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import ButtonComponent from "@/components/global/ButtonComponent.vue";

// Define props
const props = defineProps({
    isChecked: Boolean, // Whether the checkbox is checked
    loading: Boolean, // Whether the component is in loading state
    label: {
        type: String,
        default: "RPG Presets", // Customizable label text
    },
    id: {
        type: String,
        default: "rpg-generator-checkbox",
    },
    wrapperId: {
        type: String,
        default: "",
    },
    tooltipText: {
        type: String,
        default: "When active, RPG presets will apply to all AI-generated outputs.", // Tooltip content
    },
    showToggle: {
        type: Boolean,
        default: true,
    },
    activeText: {
        type: String,
        default: "Active", // Text when checked
    },
    inactiveText: {
        type: String,
        default: "Inactive", // Text when unchecked
    },
});

// Define emits
const emit = defineEmits(["update:isChecked"]);

// Toggle checkbox status
const toggleStatus = () => {
    emit("update:isChecked", !props.isChecked);
};
</script>
