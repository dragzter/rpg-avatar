<template>
    <main>
        <RPGHero
            :title="heroContent.title"
            :text="heroContent.text"
            :buttons="heroContent.buttons"
            image="avatar_100.png"
        />
        <PageCtaHeading :content="ctaHeading.title" />
        <div class="col-md-12">
            <template v-for="item in solutions">
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
        <CtaSection />
    </main>
</template>
<script setup>
import { AvatarContentItems } from "@/utils/content";
import SolutionsSection from "@/components/page-sections/SolutionsSection.vue";
import CtaSection from "@/components/page-sections/CtaSection.vue";
import RPGHero from "@/components/page-sections/RPGHero.vue";
import { AvatarHomeViewContent } from "@/stores/data/avatar_home_content";
import { ref } from "vue";
import PageCtaHeading from "@/components/page-sections/PageCtaHeading.vue";
import SolutionItem from "@/components/global/SolutionItem.vue";
import { useHead } from "@vueuse/head";
import { homeScreenMetaTags } from "@/utils/meta-tags.js";

useHead(homeScreenMetaTags);

const content = ref(AvatarHomeViewContent);
const heroContent = ref(content.value.sections.hero.content);
const solutions = ref(content.value.sections.solutions.content);
const ctaHeading = ref(content.value.sections.page_cta_heading.content);
</script>
