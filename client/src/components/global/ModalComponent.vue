<template>
    <!-- Modal -->
    <div
        :id="id"
        :class="`modal fade modal-${size} view-image-modal ${wrapperClasses} `"
        aria-hidden="true"
        aria-labelledby="exampleModalLabel"
        tabindex="-1"
    >
        <div
            :class="{ 'modal-fullscreen': fullSize }"
            class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
        >
            <div class="modal-content">
                <div class="modal-header">
                    <h5 v-if="modalTitle" class="modal-title">
                        {{ modalTitle }}
                    </h5>
                    <slot name="header"></slot>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
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
                <div class="modal-footer">
                    <slot name="footer"></slot>
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
    fullSize: {
        type: Boolean,
        default: false,
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
    modalTitle: {
        type: String,
        default: "",
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
