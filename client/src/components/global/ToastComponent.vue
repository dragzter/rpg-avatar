<template>
    <div
        v-if="showToast"
        class="position-fixed start-50 translate-middle p-3"
        style="z-index: 11; top: 120px"
    >
        <div
            class="toast align-items-center show"
            :class="{ 'text-bg-success': !isError, 'text-bg-danger': isError }"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div class="d-flex">
                <div class="toast-body">{{ message }}</div>
                <button
                    type="button"
                    class="btn-close me-2 m-auto"
                    @click="hideToast"
                    aria-label="Close"
                ></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
    show: Boolean,
    message: String,
    autoClose: Boolean,
    isError: Boolean,
    autoCloseDelay: Number,
});

const showToast = ref(props.show);

watch(
    () => props.show,
    (newShow) => {
        showToast.value = newShow;
        if (newShow) {
            startAutoCloseTimer();
        }
    }
);

function hideToast() {
    showToast.value = false;
}

let autoCloseTimer = null;

function startAutoCloseTimer() {
    clearTimeout(autoCloseTimer);
    if (showToast.value && props.autoClose) {
        autoCloseTimer = setTimeout(hideToast, props.autoCloseDelay || 3000);
    }
}

onBeforeUnmount(() => {
    clearTimeout(autoCloseTimer);
});
</script>
