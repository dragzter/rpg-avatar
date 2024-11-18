<template>
    <div id="generate-avatar">
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-7">
                    <div class="avatar-generator p-3 mb-4">
                        <div class="row mb-4">
                            <div class="col d-flex align-items-center justify-content-between mb-3">
                                <h3 class="m-0 accent-text">Avatar Maker</h3>

                                <router-link
                                    class="fw-light ms-3"
                                    data-bs-placement="top"
                                    data-bs-title="Buy More Tokens"
                                    data-bs-toggle="tooltip"
                                    to="get-tokens"
                                >
                                    <h5
                                        :class="{ 'border-danger': rpgUser.token_balance === 0 }"
                                        class="user-tokens-wrapper mb-0"
                                    >
                                        <span style="color: goldenrod"
                                            ><i class="fa-sharp fa-light fa-coins"></i
                                        ></span>
                                        <span
                                            :class="{ 'text-danger': rpgUser.token_balance === 0 }"
                                            class="ms-2"
                                            >{{ rpgUser.token_balance || 0 }}</span
                                        >
                                    </h5>
                                </router-link>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="image-selection-wrapper d-flex align-items-start">
                                <div
                                    class="base-image-wrapper me-2 flex-column"
                                    :class="{ 'pe-none': loading }"
                                >
                                    <h5 class="mb-3">
                                        <span class="prompt-info-text"><strong>1.</strong></span>
                                        <span class="text-white">Base</span> Img
                                        <Popper :hover="true">
                                            <i class="fa-regular fa-circle-question"></i>
                                            <template #content>
                                                <small
                                                    class="mx-auto"
                                                    style="max-width: 260px; display: block"
                                                >
                                                    To ensure accurate face integration, please upload a base
                                                    image where the face is clear, centered, well-lit, and
                                                    fully visible.
                                                </small>
                                            </template>
                                        </Popper>
                                    </h5>
                                    <div
                                        class="base-image"
                                        data-bs-toggle="modal"
                                        data-bs-target="#base-image-presets"
                                    >
                                        <img
                                            v-if="baseImage"
                                            :src="baseImage"
                                            alt="Base Image"
                                            class="position-relative"
                                        />
                                        <div v-if="!baseImage" class="position-absolute p-3">
                                            <p class="text-info text-center">Click to add base Image</p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="user-face-image-wrapper ms-2 flex-column"
                                    :class="{ 'pe-none': loading }"
                                >
                                    <h5 class="mb-3">
                                        <span class="prompt-info-text"><strong>2.</strong></span
                                        ><span class="text-white">Face</span> Img
                                        <Popper :hover="true" placement="top">
                                            <i class="fa-regular fa-circle-question"></i>
                                            <template #content>
                                                <p class="text-black">A clear Image of a human face.</p>
                                                <hr />
                                                <small class="d-block mb-2"
                                                    >Files:
                                                    <strong>.jpeg, .jpg, .png, .webp, .heic</strong></small
                                                >
                                                <small class="d-block mb-2"
                                                    >Max Size: <strong>10mb </strong></small
                                                >
                                                <small
                                                    >Max Resolution: <strong>2048x2048 pixels</strong></small
                                                >
                                            </template>
                                        </Popper>
                                    </h5>
                                    <div
                                        class="user-face-image position-relative"
                                        :class="{ 'face-image-selected': uploadedImage }"
                                        @click="triggerFileUpload"
                                    >
                                        <img v-if="uploadedImage" :src="uploadedImage" alt="Uploaded Image" />
                                        <div v-if="!uploadedImage" class="position-absolute p-3">
                                            <p class="text-info text-center">Click to add your Image</p>
                                        </div>
                                        <button
                                            v-if="uploadedImage"
                                            @click.stop="uploadedImage = ''"
                                            type="button"
                                            class="btn btn-tertiary clear-uploaded-image p-0"
                                        >
                                            <div class="position-relative">
                                                <i
                                                    class="fa-sharp fa-regular fs-5 fa-xmark position-absolute"
                                                ></i>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <input
                                    ref="fileInput"
                                    type="file"
                                    accept=".jpeg, .jpg, .png, .webp"
                                    @change="handleImageUpload"
                                    style="display: none"
                                    data-max-size="10485760"
                                />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col d-flex align-items-center">
                                <button
                                    @click="createAvatar"
                                    :disabled="!uploadedImage || !baseImage || loading"
                                    class="w-100 btn btn-primary fs-5 generate-avatar-btn d-flex align-items-center justify-content-center"
                                >
                                    <i
                                        v-if="!loading"
                                        class="fa-light fa-hand-point-right me-2"
                                        :class="{
                                            'animate__animated animate__heartBeat animate__infinite	infinite':
                                                uploadedImage && baseImage,
                                        }"
                                    ></i>
                                    <LoadSpinner v-if="loading" class="me-2" />
                                    <template v-if="!baseImage && !uploadedImage">Select Images</template>
                                    <template v-else-if="baseImage && !uploadedImage">
                                        Add Face Img (You)
                                    </template>
                                    <template v-else-if="!baseImage && uploadedImage">
                                        Add Base Img
                                    </template>
                                    <template v-else>Create Avatar</template>
                                </button>
                                <div class="cost-indicator d-flex align-items-center justify-content-center">
                                    <div class="fs-3 text-warning">
                                        <span class="fw-bold me-1">6</span>
                                        <i class="fa-sharp fa-light fa-coins"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="savedBaseImages?.length" class="row">
                            <div class="col">
                                <div class="mb-2">
                                    <span class="accent-text">
                                        <i class="fa-regular fa-image"></i> MY <span>UPLOADS</span>
                                    </span>
                                    <small class="text-end ms-3 text-white"
                                        >{{ savedBaseImages.length }} / 6</small
                                    >
                                </div>

                                <div class="grid-container g-size-6 g-size-xs-3 g-2">
                                    <template v-for="base in savedBaseImages">
                                        <div
                                            class="grid-item position-relative"
                                            :class="{
                                                active: isBaseImgActive((base as any).src),
                                                'pe-none': loading,
                                            }"
                                        >
                                            <img
                                                @click="setBaseImage((base as any).src)"
                                                class="img-fluid h-100 object-fit-cover"
                                                :src="(base as any).src"
                                                alt="Stored Image"
                                            />
                                            <button
                                                v-if="base"
                                                @click.stop="handleDeleteSavedBase((base as any)?.id || '')"
                                                type="button"
                                                class="btn btn-tertiary clear-uploaded-image small-x p-0"
                                            >
                                                <div class="position-relative">
                                                    <i
                                                        class="fa-sharp fa-regular fs-6 fa-xmark position-absolute"
                                                    ></i>
                                                </div>
                                            </button>
                                        </div>
                                    </template>
                                    <!-- placeholders -->
                                    <template
                                        v-for="index in Array(6 - savedBaseImages.length).fill(0)"
                                        :key="'placeholder-' + index"
                                    >
                                        <div
                                            @click="triggerBaseFileUpload"
                                            class="grid-item grid-placeholder"
                                            :class="{ 'pe-none': loading }"
                                        >
                                            <div
                                                class="placeholder-box h-100 d-flex align-items-center justify-content-center"
                                            >
                                                <i class="fa-solid fs-2 fa-plus"></i>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <hr />
                        <div class="row quick-select-base-image-row mb-4 d-none d-md-block">
                            <h6 class="text-white">
                                <i class="fa-solid fa-bolt-lightning text-warning"></i> SAMPLE BASE IMAGES
                            </h6>
                            <div class="quick-select-base-image-container">
                                <div class="grid-container g-size-xs-3 g-size-6 g-2">
                                    <template v-for="sample in baseImages[0].items">
                                        <div
                                            class="grid-item"
                                            :class="{ active: isBaseImgActive(sample), 'pe-none': loading }"
                                        >
                                            <img
                                                @click="setBaseImage(sample)"
                                                :src="sample"
                                                alt="Placeholder Image 1"
                                            />
                                        </div>
                                    </template>
                                    <div
                                        @click="triggerBaseFileUpload"
                                        class="grid-item"
                                        :class="{ 'pe-none': loading }"
                                    >
                                        <div class="upload-custom-base position-relative w-100">
                                            <div
                                                class="position-absolute text-center w-100"
                                                style="transform: translate(-50%, -50%); left: 50%; top: 50%"
                                            >
                                                <i
                                                    class="fa-solid text-white fs-4 fa-arrow-up-from-bracket"
                                                ></i>
                                                <small
                                                    style="font-size: 12px"
                                                    class="text-center p-1 d-block fw-bold accent-text"
                                                    >Upload My own</small
                                                >
                                            </div>

                                            <input
                                                ref="fileInputBase"
                                                type="file"
                                                accept=".jpeg, .jpg, .png, .webp"
                                                @change="handleBaseUpload"
                                                style="display: none"
                                                data-max-size="10485760"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row see-more-options-row">
                            <div class="col">
                                <button
                                    class="btn btn-beveled btn-tertiary w-100"
                                    data-bs-toggle="modal"
                                    data-bs-target="#base-image-presets"
                                    :disabled="loading"
                                >
                                    <i class="fa-regular fa-gallery-thumbnails text-warning me-2"></i> Browse
                                    Base Images
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 text-center">
                    <div
                        class="result-image-container overflow-hidden mx-auto"
                        :class="{ 'h-auto': avatarUrl }"
                    >
                        <LoaderComponent v-if="loading" />
                        <img
                            v-if="avatarUrl"
                            @click="handleClickImage(avatarUrl)"
                            :src="`data:image/jpeg;base64,${avatarUrl}`"
                            class="img-fluid object-fit-contain position-relative"
                            alt="Generated Avatar result"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Full screen modal -->
        <modal-component id="base-image-presets" :full-size="true" modal-title="Pick Base Image" size="lg">
            <template v-for="(gallery, key) in baseImages.slice(1)">
                <AvatarGridBlock
                    :items="gallery.items"
                    :title="gallery.title"
                    @image-selected="setBaseImage"
                />
            </template>
            <template #header>
                <div class="ms-auto base-image-modal-upload me-4" @click="triggerBaseFileUpload">
                    <button class="btn btn-primary text-center w-100">
                        <i class="fa-solid text-white fs-4 fa-arrow-up-from-bracket"></i>
                        <small class="text-center ms-2 fw-bold"
                            >UPLOAD <span class="d-inline-block d-md-none">CUSTOM BASE IMG</span></small
                        >
                    </button>

                    <input
                        ref="fileInputBase"
                        accept=".jpeg, .jpg, .png, .webp"
                        data-max-size="10485760"
                        style="display: none"
                        type="file"
                        @change="handleBaseUpload"
                    />
                </div>
            </template>
            <template #footer>
                <button data-bs-dismiss="modal" class="btn btn-tertiary">Close</button>
            </template>
        </modal-component>

        <!-- Full screen modal -->
        <lightbox-component
            :images="lightboxImages"
            :show="showThumbnailLightBox"
            :index="lightboxThumbnailIndex"
            @update:show="showThumbnailLightBox = false"
            :is-admin="false"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { useAiStore } from "@/stores/ai";
import ModalComponent from "@/components/global/ModalComponent.vue";
import AvatarGridBlock from "@/components/page-sections/AvatarGridBlock.vue";
import LoadSpinner from "@/components/global/LoadSpinner.vue";
import LoaderComponent from "@/components/global/LoaderComponent.vue";
import {
    deleteImageFromIndexedDB,
    getAllImagesFromIndexedDB,
    saveImageToIndexedDB,
} from "@/utils/index-db-service";
import { AvatarTags } from "@/utils";
import { useAuth0 } from "@auth0/auth0-vue";
import LightboxComponent from "@/components/global/LightboxComponent.vue";
import { AvatarBaseImages } from "@/utils/avatar-base-image-repo";
import { Modal } from "bootstrap";

const baseImages = ref(AvatarBaseImages);

const realismSamples = ref(["/assets/avatar-bases/army_1.jpeg", "/assets/avatar-bases/captain.jpeg"]);

const userStore = useUserStore();
const aiStore = useAiStore();
const { isAuthenticated, loginWithPopup } = useAuth0();

const fileInput = ref(null); // Reference to the hidden file input
const fileInputBase = ref(null);
const uploadedImage = ref(""); // URL of the uploaded image
const baseImage = ref(""); // URL of the base image
const savedBaseImages = ref([]);
const showToast = ref(false);
const showThumbnailLightBox = ref(false);
const lightboxThumbnailIndex = ref(0);
const lightboxImages = ref([] as string[]);
const modalInstance = ref<Modal | null>(null);

// Computed
const rpgUser = computed(() => userStore.user || { token_balance: 0, id: "" });
const avatarUrl = computed(() => aiStore.generatedAvatarUrl);
const loading = computed(() => aiStore.avatarRequestLoading);

// Methods
const onToastMessage = (message) => {
    showToast.value = true;
    userStore.toastMessage = message;
};

const triggerFileUpload = () => {
    (fileInput.value as unknown as HTMLInputElement)?.click();
};

const triggerBaseFileUpload = () => {
    (fileInputBase.value as unknown as HTMLInputElement)?.click();
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        uploadedImage.value = URL.createObjectURL(file);
    }
};

const isBaseImgActive = (src) => {
    return baseImage.value === src;
};

const handleBaseUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        baseImage.value = URL.createObjectURL(file);

        await saveImageToIndexedDB(file);
        await loadBaseImages();

        modalInstance.value?.hide();
    }
};

const handleClickImage = (url) => {
    let dataUrl = url;

    if (!url.startsWith("data:image/")) {
        const mimeType = "image/jpeg"; // Replace with actual mime type if known
        dataUrl = `data:${mimeType};base64,${url}`;
    }

    lightboxImages.value = [dataUrl];
    showThumbnailLightBox.value = true;
};

const handleDeleteSavedBase = async (id) => {
    if (!id) return;
    await deleteImageFromIndexedDB(id);
    await loadBaseImages();
};

const setBaseImage = (sample: string) => {
    if (!loading.value) {
        baseImage.value = sample;
    }

    // Close modal
    modalInstance.value?.hide();
};

const createAvatar = async () => {
    if (!isAuthenticated.value) {
        await loginWithPopup();
    } else {
        // Create the avatar
        const faceImg = await axios.get(uploadedImage.value, { responseType: "blob" } as any);
        const baseImg = await axios.get(baseImage.value, { responseType: "blob" } as any);

        await aiStore.createAvatar({
            baseImageBlob: baseImg.data,
            faceImageBlob: faceImg.data,
            cost: 6,
            user_id: rpgUser.value.id,
        });
    }
};

const loadBaseImages = async () => {
    try {
        const storedImages = await getAllImagesFromIndexedDB();
        savedBaseImages.value = (storedImages as any)?.map((item: any) => ({
            id: item.id, // Assuming you have an ID
            src: URL.createObjectURL(item.file), // Create object URL for each file
        }));
    } catch (error) {
        console.error("Failed to load images:", error);
    }
};

// Life-cycle
onMounted(async () => {
    await loadBaseImages();

    const modalElement = document.getElementById("base-image-presets");
    if (modalElement) {
        // @ts-ignore
        modalInstance.value = Modal.getInstance(modalElement) || new Modal(modalElement);
    }
});
</script>
