<template>
    <section id="cta-1">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="ready-section">
                        <h2 class="title-2" v-html="title"></h2>
                        <p class="mb-5 px-4" style="max-width: 700px; margin: auto">
                            {{ text }}
                        </p>
                        <router-link class="btn btn-primary" to="generate-image"
                            >{{ buttonText }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="ts" setup>
const props = defineProps({
    text: String,
    title: {
        type: String,
        default: `Your AI Avatar Awaits – <span>Start Creating Now!</span>`,
    },
    buttonText: {
        type: String,
        default: "Get Started",
    },
    routerTo: String,
});
</script>
