<template>
    <div :id="cssId" class="row" :class="wrapperCssClasses">
        <div class="col-md-12">
            <h1 v-if="size === 'h1'" class="title" v-html="titleHTML"></h1>
            <h2 v-if="size === 'h2'" class="title-2" v-html="titleHTML"></h2>
            <h3 v-if="size === 'h3'" class="title-3" v-html="titleHTML"></h3>
            <h4 v-if="size === 'h4'" class="title-4" v-html="titleHTML"></h4>
            <h5 v-if="size === 'h5'" class="title-5" v-html="titleHTML"></h5>

            <p
                v-if="subText"
                style="max-width: 460px"
                class="text-center mx-auto"
                v-html="subText"
            ></p>

            <div v-if="showLogo" class="text-center my-5">
                <img src="../../assets/img/rpgavatarlogo.png" alt="logo" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
    cssId: {
        type: String,
        required: false,
    },
    titleHTML: {
        type: String,
        default: "",
    },
    wrapperCssClasses: {
        type: Array,
        default: [""],
    },
    size: {
        type: String,
        default: "h1",
    },
    showLogo: {
        type: Boolean,
        default: false,
    },
    subText: {
        type: String,
        default: "",
    },
});
</script>
