<template>
    <!-- Loader -->
    <div class="loader-wrapper">
        <div v-if="loading" class="loader-element text-center">
            <div class="d-flex align-items-center" style="height: 120px">
                <div :class="`rpg-loader-${loaderNumber} mx-auto`"></div>
            </div>
            <button @click="randomizeLoader" class="btn btn-primary mt-4">
                Click Me
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAiStore } from "@/stores/ai";
import { computed, ref } from "vue";

const loaderNumber = ref(Math.floor(Math.random() * 70) + 1);

// DATA
const aiStore = useAiStore();

// COMPUTED
const loading = computed(() => aiStore.requestLoading);

// HANDLERS
const randomizeLoader = () => {
    loaderNumber.value = Math.floor(Math.random() * 70) + 1;
};
</script>
