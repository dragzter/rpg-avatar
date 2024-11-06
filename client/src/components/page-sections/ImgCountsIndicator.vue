<template>
    <slot></slot>
    <p v-if="$slots.default === undefined" class="text-end text-sm-center p-3 pb-1 mb-2">
        {{ startImage }} - {{ endImage }} of {{ totalImages }}
    </p>
    <MediaPagination :change-page="changePage" :current-page="currentPage" :total-pages="totalPages" />
</template>
<script setup lang="ts">
import MediaPagination from "@/components/page-sections/MediaPagination.vue";

const props = defineProps<{
    startImage: number;
    endImage: number;
    totalImages: number;
    currentPage: number;
    totalPages: number;
    changePage: (page: number) => void;
}>();
</script>
