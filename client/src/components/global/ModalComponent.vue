<template>
    <!-- Modal -->
    <div
        :id="id"
        :class="`modal fade modal-${size} view-image-modal ${wrapperClasses}`"
        aria-hidden="true"
        aria-labelledby="exampleModalLabel"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <slot></slot>
                    <div
                        v-if="showSuccess"
                        class="alert text-center alert-success mt-2 p-1 px-2 mb-0"
                        role="alert"
                    >
                        Copied!
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps({
    id: String,
    imgSrc: String,
    wrapperClasses: {
        type: String,
        default: "",
    },
    size: {
        type: String,
        default: "md",
    },
    successMessage: {
        type: String,
        default: "", // Default success message
    },
    success: {
        type: Boolean,
        default: false,
    },
});

const showSuccess = ref(props.success);

watch(
    () => props.success,
    (value) => {
        showSuccess.value = value;
        setTimeout(() => {
            showSuccess.value = false;
        }, 2000);
    }
);
</script>
