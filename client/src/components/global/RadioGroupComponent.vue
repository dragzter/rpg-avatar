<template>
    <div class="radio-group mb-4">
        <label class="mb-2 pb-1" :for="id">{{ label }}</label>
        <div class="d-flex options-wrapper">
            <div
                v-for="option in options"
                :key="option"
                class="radio-option d-flex flex-column"
                :class="[
                    {
                        disabled: loading,
                        selected:
                            JSON.stringify(modelValue) ===
                            JSON.stringify(option.size),
                    },
                    option.cssClass,
                ]"
                @click="selectOption(option)"
            >
                <i class="fs-4 fa-light fa-image-user"></i>
                <span>
                    {{ option.label }}
                </span>

                <div class="ratio-indicator">{{ option.ratio }}</div>
                <div v-if="option.recommended" class="recommended-indicator">
                    Recommended
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({ size: { width: 512, height: 512 } }),
    },
    options: {
        type: Array,
        default: () => [],
    },
    label: String,
    id: String,
    loading: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const selectOption = (option) => {
    emit("update:modelValue", option.size);
};
</script>

<style scoped>
.options-wrapper {
    gap: 8px;
}

.ratio-indicator {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 1;
    font-size: 12px;
    border-radius: 3px;
    padding: 1px 3px;
    color: #a3a3a3;
    border: 1.5px solid #a3a3a3;
}

.recommended-indicator {
    position: absolute;
    bottom: 0;
    padding: 0 3px;
    font-size: 10px;
    color: #9eddfe;
    border: 1px solid #9eddfe;
    border-radius: 4px;
}

.radio-option {
    width: 80px;
    height: 80px;
    align-items: center;
    justify-content: center;
    border: 1px solid #353535;
    background-color: #1f1f33;
    border-radius: 5px;
    cursor: pointer;
    color: #f9f9f9;
    font-size: 12px;
    position: relative;
    transition: background-color 0.3s;
}

.radio-option.disabled {
    color: #ccc;
    pointer-events: none;
}

.radio-option.ratio-5x4 {
    height: 67px;
}

.radio-option.ratio-3x2 {
    height: 58px;
}

.radio-option.selected {
    background-color: #3e3e65;
    outline: 3px solid #6e6ea7;
}

.radio-option.selected .ratio-indicator {
    color: #9eddfe;
    border-color: #9eddfe;
}

.radio-option:hover {
    background-color: #3e3e65;
}
</style>
