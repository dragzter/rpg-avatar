<template>
    <div
        :class="{ 'd-none': loading }"
        class="action-overlay position-absolute w-100 h-100"
    >
        <div class="action-overlay-inner text-center">
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    loading: Boolean,
});
</script>
