<template>
    <div :id="cssId" class="row" :class="wrapperCssClasses">
        <div class="col-md-12">
            <h2 class="title-2" v-html="titleHTML"></h2>
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
});
</script>
