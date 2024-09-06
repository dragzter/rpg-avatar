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
                            <h5 class="mb-0">
                                Prompt
                                <span class="accent-link">Configuration</span>
                            </h5>

                            <div
                                class="text-end"
                                style="
                                    width: 20px;
                                    height: 60px;
                                    border-right: 1px solid #313151;
                                "
                            ></div>
                            <router-link
                                to="get-tokens"
                                class="fw-light py-2 px-3 accent-link ms-2 me-1"
                                >Buy
                            </router-link>
                            <h5 class="user-tokens-wrapper mb-0">
                                <span style="color: goldenrod"
                                    ><i class="fa-sharp fa-light fa-coins"></i
                                ></span>
                                {{ rpgUser.token_balance || 0 }}
                            </h5>
                        </div>

                        <div
                            class="d-flex align-items-center justify-content-between gap-3"
                        >
                            <SelectComponent
                                v-model="userSelections.art_style"
                                :options="styleOptions"
                                class="w-100"
                                label="Art Style"
                                :enable-tooltip="true"
                                tooltip-text="Not all art styles are equally impactful in the AI output."
                                :loading="loading"
                            />
                            <SelectComponent
                                v-model="userSelections.archetype"
                                :options="archetypeOptions"
                                class="w-100"
                                label="Archetype"
                                :enable-tooltip="true"
                                tooltip-text="Archetypes come with some presets about image settings, character placement and overall look and feel."
                                :loading="loading"
                            />
                        </div>

                        <InputComponent
                            v-model="userSelections.prompt"
                            input-type="textarea"
                            placeholder="prompt"
                            id="custom-prompt"
                            label="Additional specific info..."
                            :loading="loading"
                        />

                        <CollapseComponent label="Advanced">
                            <RadioGroupComponent
                                v-model="userSelections.size"
                                label="Image size (px)"
                                id="advanced-image-select"
                                :options="ImageOptions"
                                :loading="loading"
                            />
                            <RangeComponent
                                v-model="userSelections.count"
                                :min="1"
                                :max="
                                    rpgUser.token_balance >= 4
                                        ? 4
                                        : rpgUser.token_balance
                                "
                                :step="1"
                                label="Number of images"
                                id="image-count-range"
                                :loading="loading"
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
                                :loading="loading"
                            />
                            <InputComponent
                                v-model="userSelections.negative_prompt"
                                input-type="textarea"
                                placeholder="prompt"
                                id="custom-prompt"
                                label="Negative prompt"
                                height="90px"
                                :loading="loading"
                            />
                        </CollapseComponent>

                        <div class="mt-auto ms-auto">
                            <button
                                @click="handleSubmit"
                                class="btn accent-link-outline"
                                :disabled="loading"
                            >
                                <div class="d-flex align-items-center">
                                    <LoadSpinner v-if="loading" class="me-2" />
                                    Surprise Me
                                </div>
                            </button>
                            <button
                                @click="handleSubmit"
                                class="btn btn-info btn-large ms-3"
                                :disabled="
                                    loading || rpgUser?.token_balance === 0
                                "
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
import { computed, onMounted, ref, watch } from "vue";
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
import { ImageOptions } from "@/utils";
import { useAuth0 } from "@auth0/auth0-vue";

/**
 * DATA
 */
const userSelections = ref<UserAIPrompt>({
    archetype: "",
    model: "",
    art_style: "",
    prompt: "",
    nsfw_pass: false,
    count: 1,
    negative_prompt:
        "((blurry)), worst quality, 3D, cgi, bad hands, ((deformed)), ((unnatural)), undefined",
    user_id: "",
    adherence: 7.5,
    size: {
        width: 1024,
        height: 1024,
    },
});

const aiStore = useAiStore();
const userStore = useUserStore();
const { isAuthenticated, loginWithPopup } = useAuth0();

/**
 * COMPUTED
 */
const loading = computed(() => aiStore.requestLoading);
const loaded = computed(() => aiStore.imagesLoaded);
const gridCount = computed(() => `grid-${userSelections.value.count}`);
const rpgUser = computed(() => userStore.user || { token_balance: 0 });
const imagesV2 = computed(() => {
    const existingImages = aiStore.generatedImagesV2 || [];
    const desiredCount = userSelections.value.count || 1;

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

/**
 * LIFE-CYCLE
 */
onMounted(() => {
    console.log(rpgUser.value);
});

/**
 * WATCHERS
 */
watch(
    () => loading.value,
    (newval) => {
        console.log("loading", newval);
    }
);

watch(
    () => rpgUser.value,
    (newRgpUser) => {
        userSelections.value.nsfw_pass = newRgpUser.nsfw_pass;
        userSelections.value.user_id = newRgpUser.id;
    }
);

/**
 * HANDLERS
 */
const resetImages = () => {
    aiStore.generatedImagesV2 = [];
};

const handleSubmit = async () => {
    if (!isAuthenticated.value) {
        await loginWithPopup();
        resetImages();
    } else {
        resetImages();
        await aiStore.getImageV2(userSelections.value);
    }
    //await aiStore.generateImageWithUserData(userSelections.value);
};
</script>
