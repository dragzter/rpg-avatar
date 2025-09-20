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
            <div class="row">
                <div class="row g-0 align-items-center bg-dark text-white rounded-3 p-4 p-md-5 shadow">
                    <!-- Left: text (50%) -->
                    <div class="col-12 col-md-9">
                        <h2 class="h2-md text-start mb-2 title-2">Limited-Time <span>Sale</span></h2>
                        <h3 class="mb-0 title-3 text-start">
                            Get <span><strong>50–70% OFF</strong></span> token prices. Stock up and save big
                            while the offer lasts.
                        </h3>
                    </div>

                    <!-- Right: button (50%) -->
                    <div class="col-12 col-md-3 mt-3 mt-md-0">
                        <div class="d-flex d-md-block justify-content-center justify-content-md-end">
                            <router-link class="btn-primary btn" to="get-tokens">Buy Tokens </router-link>
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
