<template>
    <div id="user-profile">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h2 class="mb-4 title-2 text-start">User <span>Profile</span></h2>

                    <nav>
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <button
                                class="nav-link active ms-2"
                                id="nav-profile-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-profile"
                                type="button"
                                role="tab"
                                aria-controls="nav-home"
                                aria-selected="true"
                            >
                                Profile
                            </button>
                            <button
                                class="nav-link ms-1 d-flex align-items-center flex-column flex-md-row"
                                id="nav-library-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-media-library"
                                type="button"
                                role="tab"
                                aria-controls="nav-profile"
                                aria-selected="false"
                            >
                                <span>Images</span>
                                <small class="image-cap-indicator ms-1"
                                    >{{ totalImages }}/{{ rpgUser.image_storage_cap }}</small
                                >
                            </button>

                            <button
                                class="nav-link ms-1 d-flex align-items-center flex-column flex-md-row"
                                id="nav-prompt-history-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-prompt-history"
                                type="button"
                                role="tab"
                                aria-controls="nav-prompt-history"
                                aria-selected="false"
                            >
                                <span>Prompt History</span>
                                <small class="image-cap-indicator ms-1">{{
                                    userStore.quickHistory?.length || 0
                                }}</small>
                            </button>
                        </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                        <!-- TAB - user details -->
                        <div
                            class="tab-pane show active container-fluid user-details"
                            id="nav-profile"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                        >
                            <UserDetails />
                        </div>

                        <!-- TAB - media lib -->
                        <div
                            class="tab-pane position-relative"
                            id="nav-media-library"
                            role="tabpanel"
                            aria-labelledby="nav-media-lib-tab"
                        >
                            <ImgCountsIndicator
                                v-if="imageCount > 50"
                                :changePage="changePage"
                                :currentPage="currentPage"
                                :endImage="endImage"
                                :startImage="startImage"
                                :totalImages="totalImages"
                                :totalPages="totalPages"
                            />

                            <MediaLibraryProfile v-if="imageCount > 1" />
                            <p v-else class="text-muted p-4 m-0">
                                You have no images. You can generate some
                                <router-link to="/">here</router-link>.
                            </p>

                            <ImgCountsIndicator
                                v-if="imageCount > 50"
                                :changePage="changePage"
                                :currentPage="currentPage"
                                :endImage="endImage"
                                :startImage="startImage"
                                :totalImages="totalImages"
                                :totalPages="totalPages"
                            />
                        </div>

                        <!-- TAB - prompt history -->
                        <div
                            class="tab-pane"
                            id="nav-prompt-history"
                            role="tabpanel"
                            aria-labelledby="nav-prompt-history"
                        >
                            <ImgCountsIndicator
                                v-if="imageCount > 50"
                                :changePage="changePage"
                                :currentPage="currentPage"
                                :endImage="endImage"
                                :startImage="startImage"
                                :totalImages="totalImages"
                                :totalPages="totalPages"
                            >
                                <p class="text-end text-sm-center p-3 pb-1 mb-2">
                                    Showing images {{ startImage }} - {{ endImage }} <br />
                                    (<span class="text-white">{{ totalImages }}</span> Images) - (<span
                                        class="text-white"
                                        >{{ userStore.quickHistory.length }}</span
                                    >
                                    Prompts)
                                </p>
                            </ImgCountsIndicator>
                            <div class="p-3 prompt-history-tab">
                                <div class="container">
                                    <div class="row py-2">
                                        <div
                                            class="col px-0 d-flex align-items-center justify-content-between"
                                        >
                                            <div>
                                                <button
                                                    :disabled="startSelect"
                                                    class="btn btn-secondary"
                                                    @click="startSelect = true"
                                                >
                                                    <i class="fa-light fa-grid-2-plus"></i>
                                                    Bulk Select
                                                </button>
                                                <button
                                                    v-if="startSelect"
                                                    class="btn btn-tertiary ms-2"
                                                    @click="cancelSelections"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr />
                                <div id="prompt-history" class="prompt-grid">
                                    <template v-for="item in userStore.quickHistory">
                                        <div
                                            v-if="item.urls?.length"
                                            class="card prompt-item"
                                            :class="{
                                                'prompt-selected': promptSelection.includes(item.prompt_id),
                                                'is-selectable': startSelect,
                                            }"
                                            @click="getPrompt(item)"
                                        >
                                            <div class="position-relative">
                                                <div
                                                    v-if="startSelect"
                                                    style="top: 3px; right: 3px"
                                                    class="position-absolute display-inline-block"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        class="form-check"
                                                        :checked="promptSelection.includes(item.prompt_id)"
                                                        style="
                                                            width: 18px;
                                                            height: 18px;
                                                            pointer-events: none;
                                                        "
                                                    />
                                                </div>
                                            </div>

                                            <div class="row h-100">
                                                <div
                                                    v-if="item.urls?.length"
                                                    class="col-md-4 position-relative"
                                                >
                                                    <div
                                                        class="overflow-hidden w-100 h-100 position-relative"
                                                    >
                                                        <img
                                                            :src="item.urls[0]"
                                                            alt="image"
                                                            class="object-fit-cover w-100 h-100"
                                                        />
                                                    </div>

                                                    <span
                                                        class="position-absolute badge top-0 count-indicator-prompt-history-item"
                                                    >
                                                        {{ (item.urls as string[]).length }}

                                                        <span class="visually-hidden">images available</span>
                                                    </span>

                                                    <span
                                                        v-if="item.published_images?.length"
                                                        class="position-absolute badge top-0 count-published-images-item"
                                                    >
                                                        {{ (item.published_images as string[]).length }}

                                                        <span class="visually-hidden">images available</span>
                                                    </span>
                                                </div>
                                                <div class="col-md-8">
                                                    <div class="card-body">
                                                        <p v-if="item?.preset" class="preset-indicator">
                                                            <i
                                                                class="fa-sharp fa-solid fa-wand-magic-sparkles"
                                                            ></i>
                                                            AI Preset
                                                        </p>
                                                        <p v-else class="card-text">
                                                            {{ item.prompt_excerpt }}
                                                        </p>
                                                        <p class="card-text">
                                                            <small class="text-muted">{{
                                                                nicerDate(item.created || ("" as string))
                                                            }}</small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <ImgCountsIndicator
                                v-if="imageCount > 50"
                                :changePage="changePage"
                                :currentPage="currentPage"
                                :endImage="endImage"
                                :startImage="startImage"
                                :totalImages="totalImages"
                                :totalPages="totalPages"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <lightbox-component
            :images="lightboxThumbnails"
            :show="showThumbnailLightBox"
            :index="lightboxThumbnailIndex"
            @toast-message="announce"
            @update:show="showThumbnailLightBox = false"
            @delete-image="onDeleteImage"
            :is-admin="rpgUser.admin"
            @publish-image="publishImage"
            @unpublish-image="unpublishImage"
            @on-index-change="handleChangeIndex"
        />

        <ToastComponent
            :autoClose="true"
            :autoCloseDelay="6000"
            :isError="userError"
            :message="toastMessage"
            :show="showToast"
        />

        <ModalComponent id="prompt-selected" modal-title="Prompt Details" size="lg">
            <div class="row mb-3">
                <div class="col-md-6">
                    <p class="text-muted mb-1">Prompt</p>
                    <template v-if="selectedPrompt?.preset">
                        <p class="mt-2">
                            This prompt was created using
                            <span class="accent-text fw-bold">{{ selectedPrompt.prompt }}</span>
                            from the character catalog.
                        </p>
                        <button
                            class="preset-prompt-button btn btn-primary mt-2"
                            style="border-radius: 6px !important"
                            @click="
                                reRunPrompt(selectedPrompt.prompt, selectedPrompt.model || ('' as string))
                            "
                        >
                            <i class="fa-sharp fa-solid fa-wand-magic-sparkles"></i> Re-run this prompt
                        </button>
                    </template>
                    <p
                        v-else
                        class="text-white"
                        style="cursor: copy"
                        @click="copyPrompt(selectedPrompt.prompt)"
                    >
                        {{ selectedPrompt.prompt?.replace('"', "") }}
                    </p>
                </div>
                <div class="col-md-6">
                    <div v-if="selectedPrompt.negative_prompt" class="form-floating mb-2">
                        <input
                            readonly
                            class="form-control read-only"
                            id="floatingTextarea"
                            :value="selectedPrompt.negative_prompt"
                        />
                        <label for="floatingTextarea">Negative Prompt</label>
                    </div>

                    <div v-if="selectedPrompt.adherence" class="form-floating mb-2">
                        <input
                            readonly
                            class="form-control read-only"
                            id="floatingTextarea"
                            :value="selectedPrompt.adherence"
                        />
                        <label for="floatingTextarea">Adherence</label>
                    </div>

                    <div v-if="selectedPrompt?.model" class="form-floating mb-2">
                        <input
                            readonly
                            class="form-control read-only"
                            id="floatingTextarea"
                            :value="selectedPrompt.model"
                        />
                        <label for="floatingTextarea">Model</label>
                    </div>

                    <div v-if="selectedPrompt?.rpg_presets" class="form-floating mb-2">
                        <input
                            readonly
                            class="form-control read-only"
                            id="floatingTextarea"
                            :value="selectedPrompt.rpg_presets.toString()"
                        />
                        <label for="floatingTextarea">RPG Presets</label>
                    </div>

                    <p
                        v-if="selectedPrompt?.count"
                        class="mb-1 rounded-3 p-2"
                        style="background: var(--dark-600)"
                    >
                        {{ selectedPrompt?.count }}
                        {{ selectedPrompt.count > 1 ? "images" : "image" }}
                        prompted
                    </p>

                    <p class="mb-1 rounded-3 p-2" style="background: var(--dark-600)">
                        {{ selectedPrompt?.size?.width || 0 }}
                        <i class="fa-solid fa-xmark fw-bold"></i>
                        {{ selectedPrompt?.size?.height || 0 }} (px)
                    </p>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="thumbnails-wrapper">
                        <h5 class="fw-light mb-3">Images</h5>
                        <div class="prompt-grid">
                            <template v-for="(url, index) in selectedPrompt.urls" :key="index">
                                <div class="overflow-hidden rounded-2 position-relative">
                                    <img
                                        v-if="url"
                                        @click="openThumbnailLightbox(url)"
                                        :src="url"
                                        alt="prompt image"
                                        style="transition: 0.2s ease-in-out"
                                        class="object-fit-cover w-100 h-100"
                                    />
                                    <div v-if="isImagePublished(url)" class="published-tag">
                                        <i class="fa-solid fa-check"></i> Published
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div v-if="!selectedPrompt.urls?.length">
                            <p class="text-warning">No images on record.</p>
                            <small class="text-muted"
                                >All images in this prompt have been deleted or no images were created.</small
                            >
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <button @click="deletePrompt" class="btn btn-danger">
                    <i class="fa-regular fa-trash-can"></i> Delete
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </template>
        </ModalComponent>

        <!-- Bulk Delete Toolbar -->
        <div
            v-if="startSelect"
            class="bulk-delete-toolbar position-fixed rounded-3 p-2 text-center"
            style="
                bottom: 15px;
                left: 50%;
                z-index: 1000;
                transform: translateX(-50%);
                background: var(--dark-800);
                max-width: 400px;
                min-width: 360px;
                width: auto;
                outline: 2px solid var(--dark-100);
            "
        >
            <button @click="cancelSelections" class="btn btn-tertiary" v-if="startSelect">Cancel</button>
            <div v-if="startSelect" class="ms-3 badge badge-info">
                Selected:
                {{ promptSelection.length }}
            </div>
            <button
                :disabled="!promptSelection.length"
                @click="deleteSelections"
                class="btn btn-danger ms-3 position-relative"
            >
                <i v-if="!userStore.userPromptsLoading" class="fa-regular fa-trash-can"></i>
                <load-spinner v-if="userStore.userPromptsLoading" />
                Delete
                <span
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary count-indicator-prompt-history-item"
                >
                    {{ promptSelection.length }}
                    <span class="visually-hidden">delete selected</span>
                </span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { computed, defineComponent, nextTick, h, onMounted, onUnmounted, ref, watch } from "vue";
import ToastComponent from "@/components/global/ToastComponent.vue";
import { isMoreThan24Hours, nicerDate } from "@/utils/date-utils";
import { API, STORAGE_KEYS } from "@/utils";
import LightboxComponent from "@/components/global/LightboxComponent.vue";
import { storage } from "@/utils/storage";
import { useAuth0, type User } from "@auth0/auth0-vue";
import ModalComponent from "@/components/global/ModalComponent.vue";
import { Modal } from "bootstrap";
import LoadSpinner from "@/components/global/LoadSpinner.vue";
import UserDetails from "@/components/page-sections/UserDetails.vue";
import MediaLibraryProfile from "@/components/page-sections/MediaLibraryProfile.vue";
import axios from "axios";
import MediaPagination from "@/components/page-sections/MediaPagination.vue";
import { useRouter } from "vue-router";
import ImgCountsIndicator from "@/components/page-sections/ImgCountsIndicator.vue";

const { user } = useAuth0();

/**
 * =*'^'*= DATA =*'^'*=
 */
const router = useRouter();
const userStore = useUserStore();
const tokenCodeToRedeem = ref("");
const passCodeToRedeem = ref("");
const showToast = ref(false);
const showLightbox = ref(false);
const showThumbnailLightBox = ref(false);
const lightboxThumbnailIndex = ref(0);
const modalInstance = ref<Modal | null>(null);
const startSelect = ref(false);
const promptSelection = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(50);

/**
 * =*'^'*= COMPUTED =*'^'*=
 */
const rpgUser = computed(() => userStore.user);
const imageCount = computed(() => rpgUser.value?.image_count || 0);
const userError = computed(() => userStore.userError);
const loading = computed(() => userStore.userLoading);
const toastMessage = computed(() => userStore.toastMessage);
const selectedPrompt = computed(() => userStore.selectedPrompt);
const totalImages = computed(() => rpgUser.value.image_count || 0);
const lightboxThumbnails = computed(() => userStore.selectedPrompt.imgURLS);
const totalPages = computed(() => {
    return Math.ceil(userStore.totalPages);
});
const startImage = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const endImage = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalImages.value || 0));

/**
 * =*'^'*= WATCHERS =*'^'*=
 */
watch(
    () => [userError.value, loading.value],
    (newValues) => {
        if (!newValues[0] && !newValues[1]) {
            passCodeToRedeem.value = "";
            showToast.value = false;
            tokenCodeToRedeem.value = "";
        }
    }
);

watch(
    () => rpgUser.value.id,
    async (newId) => {
        await fetchOrLoadExistingImages(newId, { page: currentPage.value, limit: itemsPerPage.value }, true);
    }
);

/**
 * =*'^'*= METHODS =*'^'*=
 */

// Function to change page and load new data
const changePage = async (page: number) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        await fetchOrLoadExistingImages(rpgUser.value.id, { page, limit: itemsPerPage.value });
    }
};

const announce = (msg) => {
    userStore.toastMessage = msg;

    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 2000);
};

const deletePrompt = async () => {
    const confirm = window.confirm(
        "Are you sure you want to delete this prompt? You will also lose all associated images."
    );
    if (confirm) {
        await userStore.deletePrompt(selectedPrompt.value.prompt_id);

        modalInstance.value?.hide();
    }
};

const isImagePublished = (url) => {
    // Find out if any of the published Images are included in the current URL
    const published_ids = selectedPrompt.value?.published_images?.map((pimg) => pimg.split(".")[0]);

    return published_ids?.some((pimg) => url.includes(pimg));
};

const publishImage = async (imgUrl) => {
    try {
        const file_key = imgUrl.split("/")[imgUrl.split("/").length - 1].split("?")[0];

        const publishResponse = await axios.post(API.publish_image, {
            file_key,
            prompt_id: selectedPrompt.value.prompt_id,
            user_id: rpgUser.value.id,
        });

        await nextTick();
        await Promise.all([
            userStore.fetchPromptByPromptId(selectedPrompt.value.prompt_id),
            userStore.fetchQuickPromptsHistory(rpgUser.value.id),
        ]);

        announce(publishResponse.data.message);
    } catch (error) {
        console.log(error);
        userStore.userError = true;
        userStore.toastMessage = (error as any).message;
    }
};

const unpublishImage = async (url) => {
    const confirm = window.confirm("Are you sure you want to unpublish this image?");
    if (confirm) {
        try {
            const file_key = url.split("/")[url.split("/").length - 1].split("?")[0];

            const resp = await axios.post(API.unpublish_image, {
                file_key,
                prompt_id: selectedPrompt.value.prompt_id,
            });

            await nextTick();

            await Promise.all([
                userStore.fetchPromptByPromptId(selectedPrompt.value.prompt_id),
                userStore.fetchQuickPromptsHistory(rpgUser.value.id),
            ]);

            announce(resp.data.message);
        } catch (error) {
            console.log(error);
        }
    }
};

const getPrompt = async (prompt) => {
    if (startSelect.value) {
        if (promptSelection.value.includes(prompt.prompt_id)) {
            promptSelection.value = promptSelection.value.filter((id) => id !== prompt.prompt_id);
        } else {
            promptSelection.value.push(prompt.prompt_id);
        }
    } else {
        await userStore.fetchPromptByPromptId(prompt.prompt_id);
        modalInstance.value?.show();
    }
};

const cancelSelections = () => {
    startSelect.value = false;
    promptSelection.value = [];
};

const deleteSelections = async () => {
    const confirm = window.confirm(
        "Are you sure you want to delete these prompts? You will also lose all associated images."
    );

    if (confirm) {
        await userStore.deleteManyPrompts({
            prompt_ids: promptSelection.value,
            user_id: rpgUser.value.id,
        });
        promptSelection.value = [];
    }
};

const openThumbnailLightbox = async (url) => {
    const imgId = url.split("/thumbnails/")[1].split(".")[0];

    lightboxThumbnailIndex.value =
        lightboxThumbnails.value?.findIndex((img) => img.includes(`${imgId}.image`)) || 0;

    await nextTick();

    if (lightboxThumbnailIndex.value > -1) {
        showThumbnailLightBox.value = true;
    }
};

const onDeleteImage = async (imageKey) => {
    const confirmDelete = confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) {
        return;
    }

    if (rpgUser.value.id) {
        await userStore.deleteImage({
            file_key: imageKey,
            user_id: rpgUser.value.id,
        });
        await userStore.fetchQuickPromptsHistory(rpgUser.value.id);
        showLightbox.value = false;
    }
};

const copyPrompt = async (promptText: string) => {
    await nextTick();
    navigator.clipboard
        .writeText(promptText)
        .then(() => {
            announce("Prompt copied to clipboard");
        })
        .catch((err) => {
            console.error("Failed to copy to clipboard", err);
        });
};

const handleChangeIndex = (_, newIndex) => {
    lightboxThumbnailIndex.value = newIndex;
};

const fetchOrLoadExistingImages = async (
    userId: string,
    p = { page: currentPage.value, limit: itemsPerPage.value },
    force: boolean = false
) => {
    const stored_images = storage.g(STORAGE_KEYS.images);
    const stored_thumbnails = storage.g(STORAGE_KEYS.thumbnails);
    const have_new_images = storage.g(STORAGE_KEYS.new_images);
    const stored_page = parseInt(storage.g(STORAGE_KEYS.page));

    if (!stored_images || !stored_thumbnails || have_new_images === true || stored_page !== p.page || force) {
        await userStore.fetchImagesPaginated(userId, p);
        await Promise.all([
            userStore.getUser(user.value as User),
            userStore.fetchQuickPromptsHistory(userId),
        ]);

        return;
    }

    const lastRequested = storage.g(STORAGE_KEYS.images_requested_on);

    if (isMoreThan24Hours(lastRequested)) {
        await userStore.fetchImagesPaginated(userId, p);
        await Promise.all([
            userStore.getUser(user.value as User),
            userStore.fetchQuickPromptsHistory(userId),
        ]);
    } else {
        userStore.imageThumbnails = storage.g(STORAGE_KEYS.thumbnails).thumbnails;
        userStore.images = storage.g(STORAGE_KEYS.images).images;
    }
};

const reRunPrompt = (preset_id: string, model: string) => {
    router.push({
        name: "generate-image",
        query: {
            preset_id,
            model,
        },
    });
};

/**
 * =*'^'*= LIFE-CYCLE =*'^'*=
 */
onMounted(async () => {
    if (rpgUser.value.id) {
        await fetchOrLoadExistingImages(
            rpgUser.value.id,
            { page: currentPage.value, limit: itemsPerPage.value },
            true
        );
        await userStore.deleteEmptyPrompts(rpgUser.value.id);
    }

    const modalElement = document.getElementById("prompt-selected");
    if (modalElement) {
        // @ts-ignore
        modalInstance.value = Modal.getInstance(modalElement) || new Modal(modalElement);
    }
});

onUnmounted(() => {
    modalInstance.value?.dispose();
});
</script>
