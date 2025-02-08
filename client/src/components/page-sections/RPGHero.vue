<template>
    <section id="app-hero" class="rpg-avatar-main">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <div id="intro" class="m-auto my-5">
                        <h1 class="fw-bolder hero-title pe-md-5">{{ title }}</h1>
                        <p class="fs-5 my-4 pe-md-5">
                            {{ text }}
                        </p>
                        <div class="d-flex justify-content-between justify-content-md-start">
                            <template v-for="(button, i) in buttons" :key="i">
                                <router-link :class="button.button_classes" :to="button.link"
                                    >{{ button.link_text }}
                                </router-link>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 text-center">
                    <div class="accent-frame hero-image-main">
                        <div>
                            <img
                                alt="RPG Avatar"
                                class="img-fluid"
                                :src="`/assets/${image}`"
                                style="border-radius: 10px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { onMounted } from "vue";

const props = defineProps({
    title: String,
    text: String,
    image: {
        type: String,
        default: "rogue-24-female.png",
    },
    buttons: Array,
});

onMounted(() => {
    console.log(props.buttons);
});
</script>
