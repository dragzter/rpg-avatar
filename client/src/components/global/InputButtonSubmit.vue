<template>
    <div>
        <label :for="inputId" class="mb-2">
            {{ labelText }}
            <span v-if="accentText" class="accent-text">{{ accentText }}</span>
        </label>

        <div class="input-group mb-3">
            <input
                :id="inputId"
                :aria-label="placeholderText"
                :placeholder="placeholderText"
                :value="inputValue"
                class="form-control"
                type="text"
                @input="handleInput"
            />
            <button
                :disabled="!inputValue || inputValue?.trim()?.length < 2"
                class="btn btn-primary"
                type="button"
                @click="handleButtonClick"
            >
                {{ buttonText }}
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    inputId: {
        type: String,
        default: "input-id",
    },
    labelText: {
        type: String,
        default: "",
    },
    accentText: {
        type: String,
        default: "",
    },
    placeholderText: {
        type: String,
        default: "Placeholder",
    },
    buttonText: {
        type: String,
        default: "Submit",
    },
    modelValue: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue", "button-click"]);

const inputValue = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newVal) => {
        inputValue.value = newVal;
    },
    { immediate: true }
);

// Handle input changes and emit updates to modelValue
function handleInput(event) {
    const newValue = event.target.value;
    inputValue.value = newValue;
    emit("update:modelValue", newValue);
}

function handleButtonClick() {
    // Emit the custom button click event
    emit("button-click", inputValue.value);
}
</script>
