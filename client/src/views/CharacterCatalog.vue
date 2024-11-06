<template>
    <div id="character-catalog">
        <div class="container">
            <div class="row mb-4">
                <div class="me-3">
                    <router-link
                        to="generate-image"
                        class="btn btn-special ms-0 ps-0 d-flex align-items-center"
                    >
                        <i class="fa-solid fa-arrow-left fs-4"></i>
                        <span class="ms-3">To Image Generator</span>
                    </router-link>
                </div>
                <div class="mt-4">
                    <div class="d-flex align-items-center">
                        <h1 class="text-white">Preset Prompt Gallery</h1>
                        <span class="badge ms-3 bg-danger">NEW</span>
                    </div>
                    <p class="mx-auto lead mt-3">
                        Discover a gallery of <strong class="text-white">ready-made AI prompts</strong>,
                        curated from popular designs to make creating stunning art as
                        <strong class="text-white">simple as clicking a button</strong>. No need to craft a
                        prompt yourself—just choose a character and let us bring it to life within seconds.
                        Check back soon, <strong class="text-white">new characters added regularly</strong>.
                    </p>

                    <div class="fs-5 alert alert-info rounded-3 text-info border-2 my-3" role="alert">
                        <i class="fa-regular fa-circle-exclamation"></i>
                        Suggest additions to this library on the

                        <a id="facebook-callout" href="https://www.facebook.com/profile.php?id=61566109046101"
                            ><i class="fa-brands fa-square-facebook"></i> page</a
                        >
                    </div>
                </div>
            </div>

            <!-- Tab Buttons -->
            <div class="row mb-4">
                <nav class="d-none character-catalog-nav-wrapper">
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <!-- Women presets -->
                        <button
                            class="nav-link active"
                            :id="`nav-${Tabs.women}`"
                            data-bs-toggle="tab"
                            :data-bs-target="`#${Tabs.women}`"
                            type="button"
                            role="tab"
                            :aria-controls="Tabs.women"
                            aria-selected="true"
                        >
                            Gorgeous Women
                        </button>
                        <!-- Fantasy presets -->
                        <button
                            class="nav-link"
                            :id="`nav-${Tabs.fantasy}`"
                            data-bs-toggle="tab"
                            :data-bs-target="`#${Tabs.fantasy}`"
                            type="button"
                            role="tab"
                            :aria-controls="Tabs.fantasy"
                            aria-selected="true"
                        >
                            Fantasy
                        </button>
                        <!-- Game Assets presets -->
                        <button
                            class="nav-link"
                            :id="`nav-${Tabs.game}`"
                            data-bs-toggle="tab"
                            :data-bs-target="`#${Tabs.game}`"
                            type="button"
                            role="tab"
                            :aria-controls="Tabs.game"
                            aria-selected="true"
                        >
                            Game Assets
                        </button>
                    </div>
                </nav>
            </div>

            <div class="tab-content border-0" id="nav-tabContent">
                <div
                    class="tab-pane fade show active bg-transparent"
                    :id="Tabs.women"
                    role="tabpanel"
                    :aria-labelledby="`nav-${Tabs.women}`"
                    tabindex="0"
                >
                    <div class="row g-2 g-lg-3 g-xxl-4">
                        <template v-for="preset in flux_characters">
                            <CharacterPresetCard :data="preset" @click-image="handleClickImage" />
                        </template>
                    </div>
                    <!--                    <div class="row g-2 g-lg-3 g-xxl-4 mt-5">-->
                    <!--                        <h1>Stable Diffusion</h1>-->
                    <!--                        <template v-for="preset in sd_characters">-->
                    <!--                            <CharacterPresetCard :data="preset" />-->
                    <!--                        </template>-->
                    <!--                    </div>-->
                </div>

                <div
                    class="tab-pane fade show bg-transparent"
                    :id="Tabs.fantasy"
                    role="tabpanel"
                    :aria-labelledby="`nav-${Tabs.fantasy}`"
                    tabindex="0"
                >
                    Fantasy prompts
                </div>

                <div
                    class="tab-pane fade show bg-transparent"
                    :id="Tabs.game"
                    role="tabpanel"
                    :aria-labelledby="`nav-${Tabs.game}`"
                    tabindex="0"
                >
                    Game asset prompts
                </div>
            </div>

            <div class="row mt-4">
                <small class="mx-auto d-block">
                    While each preset has been tested for quality, please note that results may vary, and
                    exact recreations of images cannot be guaranteed. Some of the images may generate NSFW
                    content.
                </small>
            </div>
        </div>
    </div>

    <lightbox-component
        :images="lightboxImages"
        :show="showThumbnailLightBox"
        :index="lightboxThumbnailIndex"
        :view-only="true"
        @update:show="showThumbnailLightBox = false"
        :is-admin="false"
    />
</template>
<script setup lang="ts">
import CharacterPresetCard from "@/components/page-sections/CharacterPresetCard.vue";
import { ref } from "vue";
import LightboxComponent from "@/components/global/LightboxComponent.vue";
import { useUserStore } from "@/stores/user";

// Data
const Tabs = {
    women: "tab-women",
    fantasy: "tab-fantasy",
    game: "tab-game",
};

const lightboxThumbnailIndex = ref(0);
const showThumbnailLightBox = ref(false);
const flux_characters = ref([
    {
        name: "Battle Priestess",
        description:
            "Captivating priestess in flowing white robes, enjoying some quiet in the temple courtyard.",
        image: "temple_priestess.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_5",
    },
    {
        name: "Club Duo",
        description:
            "A group of gorgeous girls, a brunette and a blonde, in a night club. Made with Flux Pro 1.1",
        image: "club_duo.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_2",
    },
    {
        name: "Sylvan Goddess",
        description: "A Gorgeous, sylvan-haired beauty with flowing hair. Made with Flux Pro 1.1",
        image: "slyvan_priestess.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_3",
    },
    {
        name: "Bikini photo shoot",
        description: "Black bikini, beach photo shoot. Created with Flux Pro",
        image: "black_bikini_preset.jpeg",
        cost: 4,
        model: "flux_pro",
        api_preset_id: "preset_1",
    },

    {
        name: "Forest Siren",
        description: "A mysterious beauty, relishing in the serenity of her native forest.",
        image: "forest_siren.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_4",
    },
    {
        name: "Looking Back",
        image: "look_back.jpeg",
        description: "Attractive young lady, at the bar looking back at you.",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_6",
    },
    {
        name: "Sheer Magic",
        description: "A beautiful lady in a sheer dress, sitting by the lake.",
        image: "sheer_magic.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_7",
    },
    {
        name: "The Dancer",
        description: "A stunning dancer at a crowded night club.",
        image: "dancer.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_8",
    },
    {
        name: "Prayer",
        description: "A kneeling priestess in a prayer trance.",
        image: "prayer.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_9",
    },
    {
        name: "Battle Weary Warrior",
        description: "A battle-weary warrior making a last stand.",
        image: "battle_weary.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_10",
    },
    {
        name: "At The Villa",
        description: "A gorgeous Sorceress in a red dress, sitting on a bench, taking in the view.",
        image: "villa.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_11",
    },
    {
        name: "Leather-clad Rogue",
        description: "Fantasy rogue in leather armor, ready for action.",
        image: "rogue_one.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_12",
    },
    {
        name: "Blue Sorceress",
        description: "A mysterious sorceress in a blue dress, in her tower study.",
        image: "blue_sorceress.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_13",
    },
    {
        name: "Pool-side Dreams",
        description: "A beautiful girl in a pink bikini, lounging by the pool.",
        image: "pool_side.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_14",
    },
    {
        name: "Golden Bikini",
        description: "Breath-taking brunette in a gold bikini at the beach.",
        image: "golden_bikini.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_15",
    },
    {
        name: "The Baseball Fan",
        description: "Stunning blonde in a baseball cap, enjoying the state fair.",
        image: "baseball_fan.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_16",
    },
    {
        name: "Pool-side Dreams Redux",
        description: "A beautiful woman in a black bikini enjoying the pool.",
        image: "pool_side_redux.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_17",
    },
    {
        name: "Stunning In Red",
        description: "Close up of gorgeous brunette sunbathing.",
        image: "red_bikini_lounge.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_18",
    },
    {
        name: "River Goddess",
        description: "Stunningly beautiful Sorceress captured in a magical moment.",
        image: "river_goddess.jpeg",
        cost: 3,
        model: "flux_11_pro",
        api_preset_id: "preset_19",
    },
]);
const sd_characters = ref([
    {
        name: "Death Knight",
        description: "Armored Death Knight wielding a magical sword, done with Stable Diffusion sdxl-1.0",
        image: "death_knight_preset_100.jpeg",
        cost: 1,
        ai_details: {
            character_model: {
                prompt: "Stylized realism art style (male death knight), imposing figure clad in ornate blackened armor adorned with spectral runes, fierce gaze reflecting an otherworldly power, intricate details in the helmet and cape flowing like shadows, a menacing sword infused with dark magic gripped firmly, set against a haunting battlefield backdrop shrouded in mist, glowing ethereal elements swirling around, a blend of sorrow and valor captured in the atmosphere, ultra-detailed features emphasizing strength and mystery, vibrant hues of deep blues and purples contrasting with the ghostly pallor, enhancing the immersive RPG fantasy world.",
                negative_prompt:
                    "((blurry)), worst quality, 3D, cgi, bad hands, ((deformed)), ((unnatural)), undefined",
                adherence: 7,
                model: "character_model", // gleipnir
                count: 1,
                size: {
                    width: 1024,
                    height: 1024,
                },
            },
        },
    },
    {
        name: "Soldier Avatar",
        description: "A 2D Avatar of a soldier. Ideal for profile pictures, and game art.",
        image: "soldier_preset_1.jpeg",
        cost: 1,
        ai_details: {
            character_model: {
                prompt: "make me a portrait like a profile avatar of a soldier wearing a helmet in the illustration art style, the uniform is a green camouflage pattern, the image background should be completely white",
                negative_prompt:
                    "((blurry)), worst quality, 3D, cgi, bad hands, ((deformed)), ((unnatural)), undefined",
                adherence: 7,
                model: "character_model", // gleipnir
                count: 1,
                size: {
                    width: 1024,
                    height: 1024,
                },
            },
        },
    },
]);
const userStore = useUserStore();
const showToast = ref(false);
const lightboxImages = ref([] as string[]);

// Methods
const handleClickImage = (url) => {
    lightboxImages.value = [url];
    showThumbnailLightBox.value = true;
};
</script>
<style></style>
