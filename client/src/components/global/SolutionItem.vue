<template>
    <div class="solution-item">
        <div class="row align-items-center">
            <template v-if="imagePosition === 'left'">
                <div class="col-md-6 pr-47">
                    <img :src="`assets/${image}`" alt="" />
                </div>
                <div class="col-md-6 pl-47">
                    <h3 class="mt-4">
                        {{ title }}
                    </h3>
                    <p>
                        {{ text }}
                    </p>
                    <router-link :to="routerTo" class="btn btn-secondary">{{
                        buttonText
                    }}</router-link>
                </div>
            </template>
            <template v-else>
                <div class="col-md-6 pr-47">
                    <h3>{{ title }}</h3>
                    <p>
                        {{ text }}
                    </p>
                    <router-link :to="routerTo" class="btn btn-secondary">{{
                        buttonText
                    }}</router-link>
                </div>
                <div class="col-md-6 pl-47 mt-30">
                    <img :src="`assets/${image}`" alt="" />
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    text: String,
    title: String,
    image: String,
    buttonText: String,
    routerTo: String,
    imagePosition: {
        type: String,
        default: "left",
    },
});
</script>
