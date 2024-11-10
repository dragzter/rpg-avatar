<template>
    <div id="generate-image" class="container">
        <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-5">
                <div class="prompt-builder">
                    <div id="prompt-builder-inner" class="d-flex flex-column h-100">
                        <div class="d-flex align-items-center justify-content-between">
                            <h6 class="prompt-info-text"><strong>1.</strong> SELECT AI MODEL</h6>
                            <router-link
                                class="fw-light ms-2 mb-3"
                                data-bs-placement="top"
                                data-bs-title="Buy More Tokens"
                                data-bs-toggle="tooltip"
                                to="get-tokens"
                                ><h5
                                    :class="{
                                        'border-danger': rpgUser.token_balance === 0,
                                    }"
                                    class="user-tokens-wrapper mb-0"
                                >
                                    <span style="color: goldenrod"
                                        ><i class="fa-sharp fa-light fa-coins"></i
                                    ></span>
                                    <span
                                        :class="{
                                            'text-danger': rpgUser.token_balance === 0,
                                        }"
                                        class="ms-2"
                                        >{{ rpgUser.token_balance || 0 }}</span
                                    >
                                </h5>
                            </router-link>
                        </div>

                        <div class="model-select-wrapper position-relative">
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
                                    <h4 class="model-price-indicator position-relative mb-4">
                                        <span class="text-white me-2">cost per image: </span>
                                        <i class="fa fa-coins me-2 text-warning"></i>
                                        <span><i class="fa fa-times"></i></span>{{ selected_model.cost }}
                                    </h4>
                                    <h5 class="m-0 text-truncate" style="max-width: 260px">
                                        {{ selected_model.label }}
                                    </h5>

                                    <p class="mb-2 model-select-label">
                                        <span class="accent-text"> AI Model</span>
                                    </p>
                                </div>
                            </div>
                            <p class="model-click-instruction">
                                <strong class="text-white">Click </strong> To Select Model
                            </p>
                        </div>

                        <!--                        <GenerateOption-->
                        <!--                            wrapper-id="nsfw-enable-checkbox"-->
                        <!--                            id="nsfw-enable-checkbox-input"-->
                        <!--                            :isChecked="rpgUser.nsfw_pass"-->
                        <!--                            @update:isChecked="toggleNSFWStatus"-->
                        <!--                            :loading="loading"-->
                        <!--                            label="NSFW Prompts"-->
                        <!--                            :show-toggle="false"-->
                        <!--                            tooltipText="If disabled NSFW prompts will be blocked."-->
                        <!--                            activeText="Enabled"-->
                        <!--                            inactiveText="Disabled"-->
                        <!--                            :class="{ 'is-available': rpgUser.nsfw_pass }"-->
                        <!--                        />-->

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

                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <h6 class="prompt-info-text"><strong>2.</strong> TYPE IN PROMPT</h6>
                            <router-link
                                :disabled="loading"
                                class="btn btn-accent try-preset-btn"
                                to="characters"
                            >
                                <i class="fa-solid fa-sparkles"></i> Preset
                            </router-link>
                        </div>
                        <InputComponent
                            id="custom-prompt"
                            v-model="userSelections.prompt"
                            :loading="loading"
                            input-type="textarea"
                            label="Prompt"
                            placeholder="prompt"
                        />

                        <!-- Advanced Settings (Dependent on Model Selected) -->
                        <CollapseComponent label="Advanced (optional)">
                            <RadioGroupComponent
                                v-if="selected_model.size_options?.length"
                                id="advanced-image-select"
                                v-model="userSelections.size"
                                :loading="loading"
                                :options="selected_model.size_options"
                                label="Image Resolution (px)"
                            />

                            <SelectComponent
                                v-if="selected_model.raw_option"
                                v-model="userSelections.raw as string"
                                :enable-tooltip="true"
                                :loading="loading"
                                :options="rawOptions"
                                class="w-100"
                                label="Raw Mode"
                                tooltip-text="Generate less processed, more natural-looking images. Default: no"
                            />

                            <div
                                class="d-flex align-items-center justify-content-between flex-sm-row gap-3 flex-column"
                            >
                                <RangeComponent
                                    v-if="
                                        (rpgUser as any)?.token_balance > 0 &&
                                        selected_model.max_img_per_request > 1
                                    "
                                    id="image-count-range"
                                    v-model="userSelections.count as number"
                                    :disabled="(rpgUser as any)?.token_balance === 0 || !rpgUser?.id"
                                    :loading="loading"
                                    :max="maxImagesPossible"
                                    :min="1"
                                    :step="1"
                                    class="w-100 mb-2"
                                    label="Number of images"
                                />
                                <RangeComponent
                                    v-if="selected_model?.adherence?.length"
                                    id="prompt-adherence-range"
                                    v-model="userSelections.adherence as number"
                                    :enable-tooltip="true"
                                    :loading="loading"
                                    :max="selected_model.adherence[1]"
                                    :min="selected_model.adherence[0]"
                                    :step="0.1"
                                    class="w-100 mb-2"
                                    label="Prompt adherence"
                                    tooltip-text="Higher number limits AI's creativity."
                                />
                            </div>
                            <InputComponent
                                v-if="selected_model.negative_prompt"
                                id="custom-prompt"
                                class="mb-2"
                                v-model="userSelections.negative_prompt"
                                :loading="loading"
                                height="90px"
                                input-type="textarea"
                                label="Negative prompt"
                                placeholder="prompt"
                            />

                            <GenerateOption
                                id="rpg-generator-checkbox"
                                :isChecked="isRPGChecked"
                                :loading="loading"
                                activeText="Enabled"
                                class="w-100"
                                inactiveText="Disabled"
                                label="RPG Presets"
                                tooltipText="Enable or disable RPG presets for your AI-generated images."
                                @update:isChecked="toggleStatus"
                            />
                        </CollapseComponent>

                        <div class="button-action-row">
                            <span
                                v-if="
                                    rpgUser?.token_balance === 0 ||
                                    rpgUser.token_balance < selected_model.cost
                                "
                            >
                                <router-link
                                    class="fw-light py-2 fw-bold px-3 btn btn-primary ms-2 me-1"
                                    to="get-tokens"
                                    >Buy Tokens
                                </router-link>
                            </span>
                            <div
                                v-else
                                class="d-flex prompt-footer-btn-container justify-content-between align-items-center"
                            >
                                <button
                                    :disabled="!loading"
                                    class="btn me-2 btn-dark"
                                    @click="cancelImageRequest"
                                >
                                    Cancel
                                </button>
                                <div class="prompt-footer-btn-wrapper">
                                    <button
                                        v-if="isRPGChecked"
                                        :disabled="loading || promptLoading"
                                        class="btn accent-link-outline"
                                        @click="generateRandomPrompt"
                                    >
                                        <div class="d-flex align-items-center">
                                            <LoadSpinner v-if="loading || promptLoading" class="me-2" />
                                            Surprise Me
                                        </div>
                                    </button>
                                    <button
                                        :disabled="loading || promptLoading || rpgUser?.token_balance === 0"
                                        class="btn btn-primary ms-2"
                                        @click="() => handleSubmit(false)"
                                    >
                                        <div class="d-flex align-items-center">
                                            <LoadSpinner v-if="loading || promptLoading" class="me-2" />
                                            Generate
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- image generation column-->
            <div
                class="col-sm-12 col-lg-7 col-md-12 d-flex align-items-md-start align-items-center image-generation-column"
            >
                <div id="image-load-section" class="position-relative ms-0 mt-0">
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
                        :autoCloseDelay="4000"
                        :isError="isError"
                        :message="userStore.toastMessage"
                        :show="showToast"
                    />

                    <ToastComponent
                        :autoClose="true"
                        :autoCloseDelay="4000"
                        :isError="isError"
                        :message="aiStore.toastMessage"
                        :show="aiStore.showToast"
                    />
                </div>
            </div>
        </div>
        <modal-component id="model-selection-modal" modal-title="Select AI Model" size="lg">
            <h5 class="accent-text">Premium Models (Flux)</h5>
            <div class="model-grid mb-4">
                <template v-for="model in model_selection">
                    <div v-if="model.model_type === 'flux'" class="model-grid-item">
                        <ModelUIComponent :model="model" @select="selectModel" />
                    </div>
                </template>
            </div>
            <h5 class="accent-text">Standard Models (Stable Diffusion)</h5>
            <div class="model-grid">
                <template v-for="model in model_selection">
                    <div v-if="model.model_type === 'sd'" class="model-grid-item">
                        <ModelUIComponent :model="model" @select="selectModel" />
                    </div>
                </template>
            </div>
        </modal-component>
    </div>
</template>
<script lang="ts" setup>
import SelectComponent from "@/components/global/SelectComponent.vue";
import { characterTypes, styleOptions, rawOptions } from "@/utils/select-options";
import InputComponent from "@/components/global/InputComponent.vue";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { AiModel, UserAIPrompt } from "@/stores/types";
import { useAiStore } from "@/stores/ai";
import LoadSpinner from "@/components/global/LoadSpinner.vue";
import CollapseComponent from "@/components/global/CollapseComponent.vue";
import LoaderComponent from "@/components/global/LoaderComponent.vue";
import RangeComponent from "@/components/global/RangeComponent.vue";
import RadioGroupComponent from "@/components/global/RadioGroupComponent.vue";
import { useUserStore } from "@/stores/user";
import { useAuth0 } from "@auth0/auth0-vue";
import ToastComponent from "@/components/global/ToastComponent.vue";
import ModalComponent from "@/components/global/ModalComponent.vue";
import ModelUIComponent from "@/components/ModelUIComponent.vue";
import LightboxComponent from "@/components/global/LightboxComponent.vue";
import { model_selection } from "@/utils/model-utils";
import GenerateOption from "@/components/global/GenerateOption.vue";
import { storage } from "@/utils/storage";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";
import { homeScreenMetaTags } from "@/utils/meta-tags";

// Meta tags
useHead(homeScreenMetaTags);

/**
 * =*'^'*= DATA =*'^'*=
 */
const router = useRouter();
const route = router.currentRoute;
const indexRef = ref(0);
const isRPGChecked = ref(localStorage.getItem("rpg_presets") === "true");
const aiStore = useAiStore();
const userStore = useUserStore();
const { isAuthenticated, loginWithPopup } = useAuth0();
const showToast = ref(false);
const toastMessage = ref("");
const fluxModels = ref(["flux_pro", "flux_11_pro", "flux_dev", "flux_schnell"]);

const userSelections = ref<UserAIPrompt>({
    archetype: "fighter",
    model: "flux_pro",
    art_style: "stylized_realism",
    randomize: false,
    prompt: "",
    nsfw_pass: true,
    rpg_presets: true,
    preset_id: "",
    count: 2,
    negative_prompt: "((blurry)), worst quality, 3D, cgi, bad hands, ((deformed)), ((unnatural)), undefined",
    user_id: "",
    adherence: 7,
    cost: 1,
    raw: "no",
    size: {
        width: 1024,
        height: 1024,
    },
});

const models = ref<AiModel[]>([...model_selection]);
const selected_model = ref<AiModel>(models.value[0]);
const showLightbox = ref(false);

/**
 * =*'^'*= COMPUTED =*'^'*=
 */
const isFluxModelRequest = computed(() => fluxModels.value.includes(selected_model.value.value));
const rpgUser = computed(() => userStore.user || { token_balance: 0 });
const maxImagesPossible = computed(() => {
    if (rpgUser.value.token_balance === 0) {
        return 0;
    }

    if (rpgUser.value.token_balance >= selected_model.value.max_img_per_request) {
        return selected_model.value.max_img_per_request;
    } else {
        return isFluxModelRequest.value ? 1 : rpgUser.value.token_balance;
    }
});
const lightboxImages = computed(() => aiStore.generatedImagesV2.map((img) => img.image_url));
const loading = computed(() => aiStore.requestLoading);
const loaded = computed(() => aiStore.imagesLoaded);
const promptLoading = computed(() => aiStore.aiGeneratedPromptLoading);
const gridCount = computed(() => `grid-${userSelections.value.count}`);
const isError = computed(() => aiStore.toastError);
const imagesV2 = computed(() => {
    const existingImages = aiStore.generatedImagesV2 || [];
    const desiredCount = userSelections.value.count || 1;

    return [
        ...existingImages,
        ...Array.from({ length: Math.max(desiredCount - existingImages.length, 0) }, () => ({
            image_url: "",
        })),
    ];
});

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

const toggleNSFWStatus = (event) => {
    if (!rpgUser.value.nsfw_pass) {
        router.push({ name: "get-tokens", query: { tab: "product_offer" } });
    }
};

const generateRandomPrompt = async () => {
    if (!isAuthenticated.value) {
        await loginWithPopup();
    }

    userSelections.value.archetype = characterTypes[Math.floor(Math.random() * characterTypes.length)]?.value;
    userSelections.value.art_style = styleOptions[Math.floor(Math.random() * styleOptions.length)]?.value;
    await aiStore.getRandomPromptV2({
        archetype: userSelections.value.archetype,
        art_style: userSelections.value.art_style,
        nsfw_pass: true,
        // setting true to bypass nsfw logic - determined flow was confusing (10/24/24)
    });

    await handleSubmit(true);
};

const handleSubmit = async (randomize: boolean) => {
    if (!isAuthenticated.value) {
        await loginWithPopup();
    }

    resetImages();
    showToast.value = false;
    toastMessage.value = "";

    await nextTick();
    userSelections.value.randomize = randomize;

    if (userSelections.value.prompt?.length === 0) {
        const confirmation = confirm("You have not provided a prompt. Continue Anyway?");

        if (!confirmation) {
            return;
        }
    }

    const requestType = {
        flux: async () => await aiStore.getFluxImage(userSelections.value),
        sd: async () => await aiStore.getImageV2(userSelections.value),
    };

    if (selected_model.value.model_type) {
        await requestType[selected_model.value.model_type]();
    }
};

const cancelImageRequest = async () => {
    const requestType = {
        flux: async () => await aiStore.cancelFluxImageGenerationTask(),
        sd: async () => await aiStore.cancelImageGenerationTask(),
    };

    if (selected_model.value.model_type) {
        await requestType[selected_model.value.model_type]();
    }
};

const setAiModel = (modelObject: AiModel) => {
    selected_model.value = modelObject;
    userSelections.value.model = modelObject.value;
    userSelections.value.count = modelObject.default_img_per_request;
    userSelections.value.cost = modelObject.cost;
    userSelections.value.adherence = modelObject.adherence_default;
    storage.s("selected_model", modelObject);
};

const selectModel = (model: AiModel) => {
    setAiModel(model);
};

const firePresetFromRoute = async () => {
    if (route.value?.query?.preset_id && route.value?.query?.model && rpgUser.value?.id) {
        setAiModel(models.value.find((model) => model.value === route.value.query.model) || models.value[0]);
        userSelections.value.prompt = route.value.query.preset_id as string;
        userSelections.value.preset_id = route.value.query.preset_id as string;
        userSelections.value.user_id = rpgUser.value.id;
        await handleSubmit(false);
    }
};

/**
 * =*'^'*= LIFE-CYCLE =*'^'*=
 */
onMounted(async () => {
    userSelections.value.rpg_presets = localStorage.getItem("rpg_presets") === "true";
    setAiModel(storage.g("selected_model") || models.value[0]);

    aiStore.task_id = localStorage.getItem("task_id") || "";
    if (aiStore.task_id) {
        await aiStore.cancelImageGenerationTask();
    }

    if (rpgUser.value) {
        userSelections.value.nsfw_pass = rpgUser.value.nsfw_pass;
        userSelections.value.user_id = rpgUser.value.id;
    }

    await firePresetFromRoute();
});

/**
 * =*'^'*= WATCHERS =*'^'*=
 */
watch(
    () => rpgUser.value,
    async (newRgpUser) => {
        userSelections.value.nsfw_pass = newRgpUser.nsfw_pass;
        userSelections.value.user_id = newRgpUser.id;

        await firePresetFromRoute();
    }
);

watch(
    () => aiStore.random_ai_prompt,
    (newPrompt) => {
        userSelections.value.prompt = newPrompt;
    }
);

watch(
    () => selected_model.value,
    (newModel) => {
        if (newModel?.size_options?.length) {
            userSelections.value.size = newModel?.size_options?.find((opt) => opt.recommended)?.size ||
                newModel?.size_options[0]?.size || { width: 1, height: 1 };
        }
    }
);
</script>
