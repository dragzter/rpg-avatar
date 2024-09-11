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
