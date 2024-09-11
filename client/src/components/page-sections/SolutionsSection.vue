<template>
    <div class="solution-area mtb-192">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h2 class="title-2">
                        Bring Your RPG Worlds to Life with AI Magic
                        <span>Instant Fantasy Art for Every Adventure</span>
                    </h2>
                </div>
                <div class="col-md-12">
                    <template v-for="item in content">
                        <SolutionItem
                            :buttonText="item.buttonText"
                            :image="item.image"
                            :imagePosition="item.imagePosition"
                            :routerTo="item.routerTo"
                            :text="item.text"
                            :title="item.title"
                        />
                    </template>
                    <!--                    <div class="solution-item">-->
                    <!--                        <div class="row align-items-center">-->
                    <!--                            <div class="col-md-6 pr-47">-->
                    <!--                                <img :src="`assets/fire-mage-5.png`" alt="" />-->
                    <!--                            </div>-->
                    <!--                            <div class="col-md-6 pl-47">-->
                    <!--                                <h3 class="mt-4">-->
                    <!--                                    Bring Your Characters to Life-->
                    <!--                                </h3>-->
                    <!--                                <p>-->
                    <!--                                    Transform your character descriptions into-->
                    <!--                                    stunning visual representations with our-->
                    <!--                                    powerful AI tool. Whether it's a noble-->
                    <!--                                    paladin, a mysterious rogue, or a mystical-->
                    <!--                                    elven mage, your characters will leap from-->
                    <!--                                    text to art, capturing the essence of-->
                    <!--                                    high-fantasy storytelling.-->
                    <!--                                </p>-->
                    <!--                                <a class="btn btn-secondary" href="#"-->
                    <!--                                    >Learn more</a-->
                    <!--                                >-->
                    <!--                            </div>-->
                    <!--                        </div>-->
                    <!--                    </div>-->
                    <!--                    <div class="solution-item">-->
                    <!--                        <div class="row align-items-center">-->
                    <!--                            <div class="col-md-6 pr-47">-->
                    <!--                                <h3>Unleash Your Imagination with AI</h3>-->
                    <!--                                <p>-->
                    <!--                                    Whether you're a dungeon master crafting-->
                    <!--                                    your next campaign or a player looking to-->
                    <!--                                    bring your character to life, our AI app-->
                    <!--                                    lets you generate breathtaking, high-fantasy-->
                    <!--                                    artwork in just a few clicks. From fierce-->
                    <!--                                    warriors to magical landscapes, unlock a-->
                    <!--                                    world of limitless creativity tailored to-->
                    <!--                                    the RPG universe.-->
                    <!--                                </p>-->
                    <!--                                <a class="btn btn-secondary" href="#"-->
                    <!--                                    >Learn more</a-->
                    <!--                                >-->
                    <!--                            </div>-->
                    <!--                            <div class="col-md-6 pl-47 mt-30">-->
                    <!--                                <img :src="`assets/inquisitor-3.jpg`" alt="" />-->
                    <!--                            </div>-->
                    <!--                        </div>-->
                    <!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import SolutionItem from "@/components/global/SolutionItem.vue";
import { type PropType } from "vue";
import type { ContentItem } from "@/stores/types";

const props = defineProps({
    content: {
        type: Array as PropType<ContentItem[]>,
        required: true,
    },
});
</script>
<style scoped></style>
