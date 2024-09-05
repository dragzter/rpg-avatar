<template>
    <div id="generate-image" class="container-fluid">
        <div class="row">
            <div class="col-md-12 col-lg-6">
                <div class="prompt-builder me-3">
                    <div
                        id="prompt-builder-inner"
                        class="d-flex flex-column h-100"
                    >
                        <div
                            class="title-row mb-3 d-flex justify-content-between align-items-center"
                        >
                            <h4 class="mb-0">
                                Prompt
                                <span class="accent-link">Configuration</span>
                            </h4>

                            <div
                                class="text-end"
                                style="
                                    width: 50px;
                                    height: 60px;
                                    border-right: 1px solid #313151;
                                "
                            ></div>
                            <router-link
                                to="get-tokens"
                                class="fw-light py-2 px-3 accent-link ms-auto me-1"
                                >Buy
                            </router-link>
                            <h5 class="user-tokens-wrapper mb-0">
                                <span style="color: goldenrod"
                                    ><i class="fa-sharp fa-light fa-coins"></i
                                ></span>
                                {{ rpgUser.token_balance }}
                            </h5>
                        </div>

                        <SelectComponent
                            v-model="userSelections.art_style"
                            :options="styleOptions"
                            label="Art Style"
                            :enable-tooltip="true"
                            tooltip-text="Not all art styles are equally impactful in the AI output."
                        />
                        <SelectComponent
                            v-model="userSelections.archetype"
                            :options="archetypeOptions"
                            label="Archetype"
                            :enable-tooltip="true"
                            tooltip-text="Archetypes come with some presets about image settings, character placement and overall look and feel."
                        />

                        <InputComponent
                            v-model="userSelections.prompt"
                            input-type="textarea"
                            placeholder="prompt"
                            id="custom-prompt"
                            label="Additional specific info..."
                        />

                        <CollapseComponent label="Advanced">
                            <RadioGroupComponent
                                v-model="userSelections.size"
                                label="Select image size"
                                id="advanced-image-select"
                                :options="imageOptions"
                            />
                            <RangeComponent
                                v-model="userSelections.count"
                                :min="1"
                                :max="4"
                                :step="1"
                                label="Number of images"
                                id="image-count-range"
                            />
                            <RangeComponent
                                v-model="userSelections.adherence"
                                :min="0"
                                :max="30"
                                :step="0.1"
                                label="Prompt adherence"
                                :enable-tooltip="true"
                                tooltip-text="Higher number limits AI's creativity. Recommended range is between 7 - 12"
                                id="prompt-adherence-range"
                            />
                        </CollapseComponent>

                        <div class="mt-auto ms-auto">
                            <button
                                @click="handleSubmit"
                                class="btn btn-info btn-large"
                                :disabled="loading"
                            >
                                <div class="d-flex align-items-center">
                                    <LoadSpinner v-if="loading" class="me-2" />
                                    Submit
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="col-lg-6 col-md-12 d-flex align-items-center image-generation-column"
            >
                <div
                    id="image-load-section"
                    class="position-relative mx-auto ms-3"
                >
                    <div :class="` output-images-container ${gridCount}`">
                        <template v-for="(image, index) in imagesV2">
                            <div
                                :class="[
                                    `image-grid-block gblock-${index + 1}`,
                                    { 'h-auto': loaded, 'w-auto': loaded },
                                ]"
                            >
                                <img
                                    v-if="image?.image_url"
                                    class="img-fluid"
                                    :src="image.image_url"
                                    alt="A generated Image"
                                />
                                <ActionOverlayComponent
                                    v-if="loaded"
                                    :loading="loading"
                                    :class="`action-overlay-${index + 1}`"
                                >
                                    <ButtonComponent
                                        button-type="btn-dark"
                                        :enable-tooltip="true"
                                        button-classes="fs-5 bg-transparent border-0"
                                    >
                                        <i
                                            class="fa-solid fa-arrow-down-to-bracket"
                                        ></i>
                                    </ButtonComponent>
                                    <ButtonComponent
                                        button-type="btn-dark"
                                        :enable-tooltip="true"
                                        tooltip-title="View"
                                        button-classes="fs-5 bg-transparent border-0"
                                    >
                                        <i class="fa-solid fa-eye"></i>
                                    </ButtonComponent>
                                </ActionOverlayComponent>
                            </div>
                        </template>
                    </div>
                    <LoaderComponent />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import SelectComponent from "@/components/global/SelectComponent.vue";
import { archetypeOptions, styleOptions } from "@/utils/select-options";
import InputComponent from "@/components/global/InputComponent.vue";
import { computed, ref, watch } from "vue";
import type { UserAIPrompt } from "@/stores/types";
import { useAiStore } from "@/stores/ai";
import LoadSpinner from "@/components/global/LoadSpinner.vue";
import CollapseComponent from "@/components/global/CollapseComponent.vue";
import LoaderComponent from "@/components/global/LoaderComponent.vue";
import ActionOverlayComponent from "@/components/global/ActionOverlayComponent.vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";
import RangeComponent from "@/components/global/RangeComponent.vue";
import RadioGroupComponent from "@/components/global/RadioGroupComponent.vue";
import { useUserStore } from "@/stores/user";

// DATA
const userSelections = ref<UserAIPrompt>({
    archetype: "",
    model: "",
    art_style: "",
    prompt: "",
    nsfw_pass: false,
    count: 1,
    negative_prompt: "",
    user_id: "",
    adherence: 7.5,
    size: {
        width: 512,
        height: 512,
    },
});

const imageOptions = [
    {
        label: "512x512",
        size: {
            width: 512,
            height: 512,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
    },
    {
        label: "1024x1024",
        size: {
            width: 1024,
            height: 1024,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
    },
    {
        label: "2048x2048",
        size: {
            width: 2048,
            height: 2048,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
    },
    {
        label: "1280x1024",
        size: {
            width: 1280,
            height: 1024,
        },
        ratio: "5:4",
        cssClass: "ratio-5x4",
    },
    {
        label: "1536x1024",
        size: {
            width: 1536,
            height: 1024,
        },
        ratio: "3:2",
        cssClass: "ratio-3x2",
    },
];

const aiStore = useAiStore();
const userStore = useUserStore();

// COMPUTED
const imageUrl = computed(() => aiStore.generatedImageUrl);
const loading = computed(() => aiStore.requestLoading);
const loaded = computed(() => aiStore.imagesLoaded);
const gridCount = computed(() => `grid-${userSelections.value.count}`);
const rpgUser = computed(() => userStore.user);
const imagesV2 = computed(() => {
    const existingImages = aiStore.generatedImagesV2 || [];
    const desiredCount = userSelections.value.count || 1;

    // Fill the array with empty objects if needed to reach the desired count
    return [
        ...existingImages,
        ...Array.from(
            { length: Math.max(desiredCount - existingImages.length, 0) },
            () => ({
                image_url: "",
            })
        ),
    ];
});

watch(
    () => loading.value,
    (newval) => {
        console.log("loading", newval);
    }
);

// HANDLERS
const resetImages = () => {
    aiStore.generatedImagesV2 = [];
};

const handleSubmit = async () => {
    console.log(userSelections.value);
    //await aiStore.generateImageWithUserData(userSelections.value);
    resetImages();
    await aiStore.getImageV2(userSelections.value);
};
</script>
