<template>
    <div id="generate-image" class="container-fluid">
        <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-4">
                <div class="prompt-builder">
                    <div
                        id="prompt-builder-inner"
                        class="d-flex flex-column h-100"
                    >
                        <div
                            class="prompt-header title-row mb-3 d-flex justify-content-between align-items-center"
                        >
                            <h5 class="mb-0 text-white">Prompt</h5>

                            <div
                                class="text-end"
                                style="
                                    width: 20px;
                                    height: 60px;
                                    border-right: 1px solid #313151;
                                "
                            ></div>
                            <router-link
                                class="fw-light"
                                data-bs-placement="top"
                                data-bs-title="Buy More Tokens"
                                data-bs-toggle="tooltip"
                                to="get-tokens"
                                ><h5
                                    :class="{
                                        'border-danger':
                                            rpgUser.token_balance === 0,
                                    }"
                                    class="user-tokens-wrapper mb-0"
                                >
                                    <span style="color: goldenrod"
                                        ><i
                                            class="fa-sharp fa-light fa-coins"
                                        ></i
                                    ></span>
                                    <span
                                        :class="{
                                            'text-danger':
                                                rpgUser.token_balance === 0,
                                        }"
                                        class="ms-2"
                                        >{{ rpgUser.token_balance || 0 }}</span
                                    >
                                </h5>
                            </router-link>
                        </div>

                        <div class="model-select-wrapper">
                            <div
                                data-bs-toggle="modal"
                                data-bs-target="#model-selection-modal"
                                id="model-select"
                                :style="{
                                    backgroundImage: `url(assets/${selected_model.img})`,
                                }"
                                class="d-flex align-items-end justify-content-end"
                                :class="{ is_disabled: loading }"
                            >
                                <div class="model-select-inner">
                                    <h5 class="m-0">
                                        {{ selected_model.label }}
                                    </h5>

                                    <p class="mb-2 model-select-label">
                                        <span class="accent-text">
                                            AI Optimization</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            :class="{
                                'rpg-option-inactive': !isRPGChecked,
                                'rpg-option-active': isRPGChecked,
                                is_disabled: loading,
                            }"
                            class="rpg-generator-option d-flex mb-3 justify-content-between align-items-center"
                            @click="toggleStatus"
                            style="cursor: pointer"
                        >
                            <p class="m-0">
                                RPG Presets
                                <ButtonComponent
                                    button-type="btn-dark"
                                    data-bs-placement="top"
                                    :enable-tooltip="true"
                                    tooltip-title="When active, RPG presets will apply to all AI-generated outputs."
                                    button-classes="bg-transparent border-0 ps-1"
                                >
                                    <i class="fa-regular fa-circle-info"></i>
                                </ButtonComponent>
                            </p>
                            <div
                                class="form-check form-switch d-flex align-items-center"
                            >
                                <input
                                    class="form-check-input prompt-rpg-checkbox"
                                    type="checkbox"
                                    id="rpg-generator-checkbox"
                                    v-model="isRPGChecked"
                                    @click.stop
                                />
                                <label
                                    class="form-check-label text-end"
                                    for="rpg-generator-checkbox"
                                >
                                    <span
                                        class="accent-text"
                                        v-if="isRPGChecked"
                                        >Active</span
                                    >
                                    <span v-else>Inactive</span>
                                </label>
                            </div>
                        </div>

                        <div
                            v-if="isRPGChecked"
                            class="d-flex align-items-center justify-content-between gap-3"
                        >
                            <SelectComponent
                                v-model="userSelections.art_style"
                                :enable-tooltip="true"
                                :loading="loading"
                                :options="styleOptions"
                                class="w-100"
                                label="Art Style"
                                tooltip-text="Not all art styles are equally impactful in the AI output."
                            />
                            <SelectComponent
                                v-model="userSelections.archetype"
                                :enable-tooltip="true"
                                :loading="loading"
                                :options="characterTypes"
                                class="w-100"
                                label="Character"
                                tooltip-text="Character types come with some presets about image settings, character placement and overall look and feel."
                            />
                        </div>

                        <InputComponent
                            id="custom-prompt"
                            v-model="userSelections.prompt"
                            :loading="loading"
                            input-type="textarea"
                            label="Additional details..."
                            placeholder="prompt"
                        />

                        <CollapseComponent label="Advanced">
                            <RadioGroupComponent
                                id="advanced-image-select"
                                v-model="userSelections.size"
                                :loading="loading"
                                :options="ImageOptions"
                                label="Image Resolution (px)"
                            />
                            <div
                                class="d-flex align-items-center justify-content-between flex-sm-row gap-3 flex-column"
                            >
                                <RangeComponent
                                    id="image-count-range"
                                    v-model="userSelections.count as number"
                                    :disabled="
                                        (rpgUser as any)?.token_balance === 0 ||
                                        !rpgUser?.id
                                    "
                                    :loading="loading"
                                    :max="
                                        rpgUser.token_balance >= 8
                                            ? 8
                                            : rpgUser.token_balance
                                    "
                                    :min="1"
                                    :step="1"
                                    class="w-100"
                                    label="Number of images"
                                />
                                <RangeComponent
                                    id="prompt-adherence-range"
                                    v-model="userSelections.adherence as number"
                                    :enable-tooltip="true"
                                    :loading="loading"
                                    :max="30"
                                    :min="0"
                                    :step="0.1"
                                    class="w-100"
                                    label="Prompt adherence"
                                    tooltip-text="Higher number limits AI's creativity. Recommended range is between 7 - 12"
                                />
                            </div>
                            <InputComponent
                                id="custom-prompt"
                                v-model="userSelections.negative_prompt"
                                :loading="loading"
                                height="90px"
                                input-type="textarea"
                                label="Negative prompt"
                                placeholder="prompt"
                            />
                        </CollapseComponent>

                        <div class="mt-auto ms-auto button-action-row">
                            <span v-if="rpgUser.token_balance > 0">
                                <button
                                    v-if="loading"
                                    class="btn me-2 btn-tertiary"
                                    @click="cancelImageRequest"
                                >
                                    Cancel
                                </button>
                                <button
                                    v-if="isRPGChecked"
                                    :disabled="loading"
                                    class="btn accent-link-outline"
                                    @click="generateRandomPrompt"
                                >
                                    <div class="d-flex align-items-center">
                                        <LoadSpinner
                                            v-if="loading"
                                            class="me-2"
                                        />
                                        Surprise Me
                                    </div>
                                </button>
                                <button
                                    :disabled="
                                        loading || rpgUser?.token_balance === 0
                                    "
                                    class="btn btn-primary ms-2"
                                    @click="() => handleSubmit(false)"
                                >
                                    <div class="d-flex align-items-center">
                                        <LoadSpinner
                                            v-if="loading"
                                            class="me-2"
                                        />

                                        Generate
                                    </div>
                                </button>
                            </span>
                            <span v-else>
                                <router-link
                                    class="fw-light py-2 fw-bold px-3 btn btn-primary ms-2 me-1"
                                    to="get-tokens"
                                    >Buy Tokens
                                </router-link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- image generation column-->
            <div
                class="col-sm-12 col-lg-8 col-md-12 d-flex align-items-md-start align-items-center image-generation-column"
            >
                <div
                    id="image-load-section"
                    class="position-relative ms-0 mt-0"
                >
                    <div :class="` output-images-container ${gridCount}`">
                        <template v-for="(image, index) in imagesV2">
                            <div
                                :class="[
                                    `image-grid-block mx-auto ms-lg-0  w-100 gblock-${index + 1}`,
                                    {
                                        'h-auto': loaded,
                                        'w-auto': loaded,
                                        'images-loaded': loaded || !loading,
                                    },
                                ]"
                                @click="viewImage(image.image_url)"
                            >
                                <img
                                    v-if="image?.image_url"
                                    :src="image.image_url"
                                    alt="A generated Image"
                                    class="img-fluid"
                                />
                                <LoaderComponent />
                            </div>
                        </template>
                    </div>

                    <LightboxComponent
                        :images="lightboxImages"
                        :index="indexRef"
                        :show="showLightbox"
                        @toast-message="onToastMessage"
                        @update:show="showLightbox = false"
                    />
                    <ToastComponent
                        :autoClose="true"
                        :autoCloseDelay="3000"
                        :isError="isError"
                        :message="userStore.toastMessage"
                        :show="showToast"
                    />
                </div>
            </div>
        </div>
        <modal-component id="model-selection-modal" size="md">
            <h3>
                Select
                <span class="accent-text">AI Model</span>
            </h3>

            <div class="model-grid">
                <template v-for="model in model_selection">
                    <div class="model-grid-item">
                        <ModelUIComponent
                            :model="model"
                            @select="selectModel"
                        />
                    </div>
                </template>
            </div>
        </modal-component>
    </div>
</template>
<script lang="ts" setup>
import SelectComponent from "@/components/global/SelectComponent.vue";
import { characterTypes, styleOptions } from "@/utils/select-options";
import InputComponent from "@/components/global/InputComponent.vue";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { ModelSection, UserAIPrompt } from "@/stores/types";
import { useAiStore } from "@/stores/ai";
import LoadSpinner from "@/components/global/LoadSpinner.vue";
import CollapseComponent from "@/components/global/CollapseComponent.vue";
import LoaderComponent from "@/components/global/LoaderComponent.vue";
import RangeComponent from "@/components/global/RangeComponent.vue";
import RadioGroupComponent from "@/components/global/RadioGroupComponent.vue";
import { useUserStore } from "@/stores/user";
import { ImageOptions } from "@/utils";
import { useAuth0 } from "@auth0/auth0-vue";
import ToastComponent from "@/components/global/ToastComponent.vue";
import ModalComponent from "@/components/global/ModalComponent.vue";
import ModelUIComponent from "@/components/ModelUIComponent.vue";
import ButtonComponent from "@/components/global/ButtonComponent.vue";
import LightboxComponent from "@/components/global/LightboxComponent.vue";

/**
 * =*'^'*= DATA =*'^'*=
 */
const indexRef = ref(0);
const useV2Prompt = ref(true);
const isRPGChecked = ref(localStorage.getItem("rpg_presets") === "true");
const aiStore = useAiStore();
const userStore = useUserStore();
const { isAuthenticated, loginWithPopup } = useAuth0();
const showToast = ref(false);
const toastMessage = ref("");
const isError = ref(false);

const userSelections = ref<UserAIPrompt>({
    archetype: "fighter",
    model: "character_model",
    art_style: "stylized_realism",
    randomize: false,
    prompt: "",
    nsfw_pass: false,
    rpg_presets: true,
    count: 2,
    negative_prompt:
        "((blurry)), worst quality, 3D, cgi, bad hands, ((deformed)), ((unnatural)), undefined",
    user_id: "",
    adherence: 7,
    size: {
        width: 1024,
        height: 1024,
    },
});

const model_selection = ref<ModelSection[]>([
    {
        label: "Character",
        img: "character_model.png",
        value: "character_model",
    },
    {
        label: "Portrait",
        img: "portrait_model.png",
        value: "portrait_model",
    },
    {
        label: "Creatures",
        img: "creatures_model.png",
        value: "creatures_model",
    },
    {
        label: "Anime",
        img: "anime_model.png",
        value: "anime_model",
    },
]);

const selected_model = ref<ModelSection>({
    label: "Character",
    img: "character_model.png",
    value: "character_model",
});

/**
 * =*'^'*= COMPUTED =*'^'*=
 */
const lightboxImages = computed(() =>
    aiStore.generatedImagesV2.map((img) => img.image_url)
);
const loading = computed(() => aiStore.requestLoading);
const loaded = computed(() => aiStore.imagesLoaded);
const gridCount = computed(() => `grid-${userSelections.value.count}`);
const rpgUser = computed(() => userStore.user || { token_balance: 0 });
const showLightbox = ref(false);

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
 * =*'^'*= LIFE-CYCLE =*'^'*=
 */
onMounted(async () => {
    userSelections.value.rpg_presets =
        localStorage.getItem("rpg_presets") === "true";

    aiStore.task_id = localStorage.getItem("task_id") || "";
    if (aiStore.task_id) {
        await aiStore.cancelImageGenerationTask();
    }

    if (rpgUser.value) {
        userSelections.value.nsfw_pass = rpgUser.value.nsfw_pass;
        userSelections.value.user_id = rpgUser.value.id;
    }
});

/**
 * =*'^'*= WATCHERS =*'^'*=
 */
watch(
    () => rpgUser.value,
    (newRgpUser) => {
        userSelections.value.nsfw_pass = newRgpUser.nsfw_pass;
        userSelections.value.user_id = newRgpUser.id;
    }
);

watch(
    () => aiStore.random_ai_prompt,
    (newPrompt) => {
        userSelections.value.prompt = newPrompt;
    }
);

/**
 * =*'^'*= METHODS =*'^'*=
 */
const resetImages = () => {
    aiStore.generatedImagesV2 = [];
};

const onToastMessage = (message) => {
    showToast.value = true;
    userStore.toastMessage = message;
};

const viewImage = (img: string) => {
    if (loading.value || !img) return;

    indexRef.value = lightboxImages.value.findIndex((image) => image === img);
    showLightbox.value = true;
};

const toggleStatus = (event) => {
    isRPGChecked.value = !isRPGChecked.value;
    userSelections.value.rpg_presets = isRPGChecked.value;
    localStorage.setItem("rpg_presets", isRPGChecked.value.toString());
};

const generateRandomPrompt = async () => {
    userSelections.value.archetype =
        characterTypes[
            Math.floor(Math.random() * characterTypes.length)
        ]?.value;

    userSelections.value.art_style =
        styleOptions[Math.floor(Math.random() * styleOptions.length)]?.value;

    await aiStore.getRandomPromptV2({
        archetype: userSelections.value.archetype,
        art_style: userSelections.value.art_style,
        nsfw_pass: userSelections.value.nsfw_pass,
    });

    await handleSubmit(true);
};

const handleSubmit = async (randomize: boolean) => {
    // Reset the images
    resetImages();
    showToast.value = false;
    toastMessage.value = "";

    await nextTick();
    userSelections.value.randomize = randomize;

    if (userSelections.value.prompt?.length === 0) {
        const confirmation = confirm(
            "You have not provided a prompt. Continue Anyway?"
        );

        if (!confirmation) {
            return;
        }
    }

    if (!isAuthenticated.value) {
        await loginWithPopup();
    } else {
        await aiStore.getImageV2(userSelections.value);
    }
};

const cancelImageRequest = async () => {
    await aiStore.cancelImageGenerationTask();
};

const selectModel = (model: ModelSection) => {
    console.log("Selecting model", model);
    selected_model.value = model;
    userSelections.value.model = model.value;
};
</script>
