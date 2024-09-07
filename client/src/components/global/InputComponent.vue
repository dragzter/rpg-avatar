<template>
    <div v-if="inputType === 'textarea'">
        <div class="form-floating mb-3">
            <textarea
                :value="internalValue"
                class="form-control"
                :disabled="loading"
                :placeholder="placeholder"
                :id="id"
                :style="`height: ${height}; max-height: 200px !important`"
                @input="handleInput"
            ></textarea>
            <label :for="id">{{ label }}</label>
        </div>
    </div>
    <div v-else class="mb-3">
        <label :for="id" class="form-label">{{ label }}</label>
        <input
            :type="inputType"
            class="form-control"
            :id="id"
            :value="internalValue"
            @input="handleInput"
            :disabled="loading"
            :placeholder="placeholder"
        />
    </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from "vue";

const props = defineProps({
    modelValue: {
        type: String,
        default: "", // Parent's v-model value
    },
    inputType: {
        type: String,
        default: "text", // Dynamic input type (text, email, password, etc.)
    },
    label: {
        type: String,
        default: "Input Field", // Label for the input
    },
    placeholder: {
        type: String,
        default: "", // Placeholder text
    },
    id: {
        type: String,
        default: "dynamic-input",
    },
    height: {
        type: String,
        default: "120px",
    },
    loading: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

// Emit updated value to parent on input
const handleInput = (e: Event) => {
    const inputValue = (e.target as HTMLInputElement).value;
    emit("update:modelValue", inputValue);
    internalValue.value = inputValue;
};

watch(
    () => props.modelValue,
    (newValue) => {
        internalValue.value = newValue;
    },
    { immediate: true }
);
</script>
