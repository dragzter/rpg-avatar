<template>
    <div id="generate-image" class="container-fluid">
        <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-5">
                <div class="prompt-builder">
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

                        <div
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
                                :options="archetypeOptions"
                                class="w-100"
                                label="Archetype"
                                tooltip-text="Archetypes come with some presets about image settings, character placement and overall look and feel."
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
                                label="Image size (px)"
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
                                    class="btn me-2"
                                    @click="cancelImageRequest"
                                >
                                    Cancel
                                </button>
                                <!--                                <button-->
                                <!--                                    :disabled="loading"-->
                                <!--                                    class="btn accent-link-outline"-->
                                <!--                                    @click="handleSubmit"-->
                                <!--                                >-->
                                <!--                                    <div class="d-flex align-items-center">-->
                                <!--                                        <LoadSpinner-->
                                <!--                                            v-if="loading"-->
                                <!--                                            class="me-2"-->
                                <!--                                        />-->
                                <!--                                        Surprise Me-->
                                <!--                                    </div>-->
                                <!--                                </button>-->
                                <button
                                    :disabled="
                                        loading || rpgUser?.token_balance === 0
                                    "
                                    class="btn btn-info btn-large ms-3"
                                    @click="handleSubmit"
                                >
                                    <div class="d-flex align-items-center">
                                        <LoadSpinner
                                            v-if="loading"
                                            class="me-2"
                                        />

                                        Submit
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
                class="col-sm-12 col-lg-7 col-md-12 d-flex align-items-md-start align-items-center image-generation-column"
            >
                <div
                    id="image-load-section"
                    class="position-relative mx-auto mt-0"
                >
                    <div :class="` output-images-container ${gridCount}`">
                        <template v-for="(image, index) in imagesV2">
                            <div
                                :class="[
                                    `image-grid-block gblock-${index + 1}`,
                                    {
                                        'h-auto': loaded,
                                        'w-auto': loaded,
                                        'images-loaded': loaded,
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

                    <vue-easy-lightbox
                        :imgs="lightboxImages"
                        :index="indexRef"
                        :visible="visibleRef"
                        @hide="onHide"
                    >
                        <template v-slot:toolbar="{ toolbarMethods }">
                            <div
                                class="vel-toolbar view-image-actions overflow-visible"
                            >
                                <div
                                    style="
                                        position: absolute;
                                        top: -47px;
                                        left: 50%;
                                        width: 200px;
                                        transform: translate(-50%);
                                    "
                                    v-if="copySuccess"
                                    class="alert text-center alert-success mt-2 p-1 px-2 mb-0"
                                    role="alert"
                                >
                                    URL Copied!
                                </div>

                                <button
                                    class="btn action-btn btn-dark"
                                    @click="toolbarMethods.zoomIn"
                                >
                                    <i
                                        class="fa-regular fa-magnifying-glass-plus"
                                    ></i>
                                </button>
                                <button
                                    class="btn action-btn btn-dark"
                                    @click="toolbarMethods.zoomOut"
                                >
                                    <i
                                        class="fa-regular fa-magnifying-glass-minus"
                                    ></i>
                                </button>
                                <button
                                    class="btn action-btn btn-dark"
                                    @click="toolbarMethods.rotateLeft"
                                >
                                    <i
                                        class="fa-regular fa-arrows-rotate-reverse"
                                    ></i>
                                </button>
                                <button
                                    class="btn action-btn btn-dark"
                                    @click="toolbarMethods.rotateRight"
                                >
                                    <i class="fa-regular fa-arrows-rotate"></i>
                                </button>
                                <button
                                    class="btn action-btn btn-dark"
                                    @click="
                                        downloadImage(lightboxImages[indexRef])
                                    "
                                >
                                    <i
                                        class="fa-solid fa-arrow-down-to-bracket"
                                    ></i>
                                </button>
                                <button
                                    class="btn action-btn btn-dark"
                                    @click="
                                        copyImgURL(lightboxImages[indexRef])
                                    "
                                >
                                    <i class="fa-regular fa-copy"></i>
                                </button>
                            </div>
                        </template>
                    </vue-easy-lightbox>
                    <ToastComponent
                        :autoClose="true"
                        :autoCloseDelay="3000"
                        :isError="isError"
                        :message="toastMessage"
                        :show="showToast"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import SelectComponent from "@/components/global/SelectComponent.vue";
import { archetypeOptions, styleOptions } from "@/utils/select-options";
import InputComponent from "@/components/global/InputComponent.vue";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { UserAIPrompt } from "@/stores/types";
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
import axios from "axios";

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
const showToast = ref(false);
const toastMessage = ref("");
const isError = ref(false);
const copySuccess = ref(false);

// Ez-lightbox
const visibleRef = ref(false);
const indexRef = ref(0); // default 0 - only when using multiple images
const sharedImgUrl = ref("");

/**
 * COMPUTED
 */
const loading = computed(() => aiStore.requestLoading);
const loaded = computed(() => aiStore.imagesLoaded);
const gridCount = computed(() => `grid-${userSelections.value.count}`);
const rpgUser = computed(() => userStore.user || { token_balance: 0 });
const lightboxImages = computed(() =>
    aiStore.generatedImagesV2.map((img) => img.image_url)
);
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
    if (rpgUser.value) {
        userSelections.value.nsfw_pass = rpgUser.value.nsfw_pass;
        userSelections.value.user_id = rpgUser.value.id;
    }
});

/**
 * WATCHERS
 */

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
    resetImages();
    if (!isAuthenticated.value) {
        await loginWithPopup();
    } else {
        await aiStore.getImageV2(userSelections.value);
    }
    //await aiStore.generateImageWithUserData(userSelections.value);
};

const cancelImageRequest = async () => {
    await aiStore.cancelImageGenerationTask();
};

const downloadImage = async (url) => {
    isError.value = false;
    showToast.value = false;
    toastMessage.value = "";

    await nextTick();

    try {
        showToast.value = true;
        toastMessage.value = "Download in progress, enjoy!";

        // Fetch the image using Axios and get the image as a blob
        const response = await axios.get(url, {
            responseType: "blob", // This ensures we get the image as a binary blob
        });

        // Create a URL for the Blob object
        const blobUrl = URL.createObjectURL(new Blob([response.data]));

        // Create a link element for download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `rpgavatar.com-${rpgUser.value.nickname}-image.jpeg`; // Set the desired file name

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the Blob URL
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);

        toastMessage.value = "Download completed!";
    } catch (err) {
        console.error(err);
        showToast.value = true;
        isError.value = true;
        toastMessage.value = "Download failed.";
    }
};

const onShow = () => {
    visibleRef.value = true;
};

const onHide = () => (visibleRef.value = false);

const viewImage = (img: string) => {
    indexRef.value = lightboxImages.value.findIndex((image) => image === img);
    onShow();
};

const copyImgURL = async (imgUrl: string) => {
    await nextTick();
    sharedImgUrl.value = imgUrl;
    navigator.clipboard
        .writeText(sharedImgUrl.value)
        .then(() => {
            console.log("Image URL copied to clipboard");
            copySuccess.value = true;

            setTimeout(() => {
                copySuccess.value = false;
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy image URL to clipboard", err);
        });
};
</script>
