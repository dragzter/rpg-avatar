<template>
    <div>
        <section id="rpg-avatar-gallery" class="mb-5">
            <div class="hero-area">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <ProductTitle
                                size="h1"
                                titleHTML="Create an RPG Avatar <br /><span>in Seconds</span>"
                                :show-logo="true"
                                sub-text="Our AI-driven generator makes it easy to design
                                personalized RPG avatars. With just a few
                                clicks, bring your fantasy character to life in
                                vivid detail."
                            />

                            <div class="hero-btn">
                                <router-link
                                    class="btn btn-lg fw-normal btn-primary"
                                    to="generate-image"
                                    >GET STARTED
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="bd-callout bd-callout-info">
                            This artwork was generated on our platform using the
                            same configuration available to our clients.
                            <hr />
                            <strong>NOTE: </strong>AI Image generation is still
                            experimental. Results may vary.
                            <hr />
                            <strong>NOTE: </strong>Some of these images were
                            generated with
                            <router-link to="/profile"
                                >NSFW content
                            </router-link>
                            enabled.
                        </div>
                    </div>
                    <div
                        v-for="row in imageRows"
                        :key="row[0]"
                        class="row mb-4"
                    >
                        <div
                            v-for="image in row"
                            :key="image"
                            class="col position-relative"
                        >
                            <img
                                class="img-fluid"
                                :src="`src/assets/img/${image}`"
                                alt="RPG Avatar"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import ProductTitle from "@/components/global/ProductTitle.vue";

const images = [
    "fire-mage-5.png",
    "watercolor-rogue.png",
    "warrior-2.jpg",
    "mage-female.jpg",
    "dragon-warrior.jpg",
    "elvenmage-4.jpeg",
    "artificer-1.jpg",
    "cleric-3.jpg",
    "warlock-1.jpg",
    "inquisitor-3.jpg",
    "futuristic-rogue.png",
    "rogue88.png",
    "nsfw-warlock-2.png",
    "necromancer-1.jpg",
    "bard-1.jpg",
    "fema-rogue-3.jpg",
    "druid-b.jpg",
    "dwarf-3.jpg",
    "necro56.jpeg",
    "paladin-1.png",
];

const imageRows = [];
for (let i = 0; i < images.length; i += 3) {
    imageRows.push(images.slice(i, i + 3));
}
</script>
