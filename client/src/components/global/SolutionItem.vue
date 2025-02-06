<template>
    <div class="container">
        <div class="solution-item">
            <div class="row align-items-center mb-5">
                <template v-if="imagePosition === 'left'">
                    <div class="col-md-6 pr-47">
                        <img :src="`assets/${image}`" alt="" />
                    </div>
                    <div class="col-md-6 text-center">
                        <h3 class="mt-4">
                            {{ title }}
                        </h3>
                        <div class="text-center my-3 position-relative">
                            <div class="faint-logo-line"></div>
                            <img
                                alt="logo"
                                class="shadowed-logo"
                                src="/assets/rpgavatarlogo.png"
                                style="width: 40px; margin: auto"
                            />
                        </div>
                        <p class="w-100 mx-auto">
                            {{ text }}
                        </p>
                        <router-link :to="routerTo as string" class="btn btn-secondary"
                            >{{ buttonText }}
                        </router-link>
                    </div>
                </template>
                <template v-else>
                    <div class="col-md-6 text-center">
                        <h3>{{ title }}</h3>
                        <div class="text-center my-3 position-relative">
                            <div class="faint-logo-line"></div>
                            <img
                                alt="logo"
                                class="shadowed-logo"
                                src="/assets/rpgavatarlogo.png"
                                style="width: 40px; margin: auto"
                            />
                        </div>
                        <p class="w-100 mx-auto">
                            {{ text }}
                        </p>
                        <router-link :to="routerTo as string" class="btn btn-secondary"
                            >{{ buttonText }}
                        </router-link>
                    </div>
                    <div class="col-md-6 pl-47 mt-30">
                        <img :src="`assets/${image}`" alt="" />
                    </div>
                </template>
            </div>
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
