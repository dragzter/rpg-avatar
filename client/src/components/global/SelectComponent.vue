<template>
    <div class="form-group mb-2">
        <label v-if="label" :for="cssId">
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
        <select
            v-model="internalValue"
            class="form-select"
            :id="cssId"
            :disabled="loading"
            @change="handleChange"
        >
            <option
                v-for="(option, index) in options"
                :key="index"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import {
    defineEmits,
    defineProps,
    onMounted,
    type PropType,
    ref,
    watch,
} from "vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";

export type Option = { value: string; label: string };

const props = defineProps({
    options: {
        type: Array as PropType<Option[]>,
        required: true,
    },
    modelValue: {
        type: String,
        default: "", // The parent will pass the selected value via v-model
    },
    cssId: {
        type: String,
        default: "",
    },
    label: {
        type: String,
        default: "",
    },
    tooltipText: {
        type: String,
        default: "",
    },
    enableTooltip: {
        type: Boolean,
        default: false,
    },
    loading: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

// Handle select change and emit the selected value to the parent
const handleChange = (e: Event) => {
    const selectedValue = (e.target as HTMLSelectElement).value;
    emit("update:modelValue", selectedValue); // Emit the new value to the parent
};

// Watch for changes in modelValue from the parent and update the internal value
watch(
    () => props.modelValue,
    (newValue) => {
        internalValue.value = newValue;
    },
    { immediate: true }
);

// Set initial value on mount if no modelValue is provided
onMounted(() => {
    if (!props.modelValue && props.options.length > 0) {
        internalValue.value = props.options[0].value;
        emit("update:modelValue", internalValue.value);
    }
});
</script>
