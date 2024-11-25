<template>
    <div v-if="show" id="feedback-module">
        <div class="feedback-box p-3 rounded-3 animate__animated animate__flipInY">
            <div class="m-0 text-center triple-star-message">
                <div class="d-inline-block wrapper-stars animate__infinite animate__animated animate__pulse">
                    <span class="left-star fs-3 d-inline-block">⭐</span>
                    <span class="center-star fs-1 d-inline-block">⭐</span>
                    <span class="right-star fs-3 d-inline-block">⭐</span>
                </div>
            </div>
            <div class="hide-feedback-box">
                <button class="btn btn-close fs2" @click="show = false"></button>
            </div>
            <p class="text-warning d-flex align-items-center">
                <span class="d-inline-block me-3 animate__animated fs-2 animate__wobble animate__infinite">
                    🎁
                </span>
                <span class="d-inline-block">Get 5 tokens for free!</span>
            </p>

            <button class="btn btn-secondary w-100" data-bs-target="#feedback-modal" data-bs-toggle="modal">
                💬 Give Feedback
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";

const show = ref(true);
</script>
