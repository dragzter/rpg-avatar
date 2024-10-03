<template>
    <div id="user-profile">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h2 class="mb-4 title-2 text-start">
                        User <span>Profile</span>
                    </h2>

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
                                class="nav-link ms-1"
                                id="nav-library-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-media-library"
                                type="button"
                                role="tab"
                                aria-controls="nav-profile"
                                aria-selected="false"
                            >
                                Images
                                <small
                                    class="image-cap-indicator d-none d-md-inline-block"
                                    >{{ rpgUser.image_count || 0 }}/{{
                                        rpgUser.image_storage_cap
                                    }}</small
                                >
                            </button>

                            <button
                                class="nav-link ms-1"
                                id="nav-prompt-history-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-prompt-history"
                                type="button"
                                role="tab"
                                aria-controls="nav-prompt-history"
                                aria-selected="false"
                            >
                                Prompt History
                                <small
                                    class="image-cap-indicator d-none d-md-inline-block"
                                    >{{
                                        userStore.quickHistory?.length || 0
                                    }}</small
                                >
                            </button>

                            <!--                            <button-->
                            <!--                                class="nav-link ms-1"-->
                            <!--                                id="nav-passes-tab"-->
                            <!--                                data-bs-toggle="tab"-->
                            <!--                                data-bs-target="#nav-passes"-->
                            <!--                                type="button"-->
                            <!--                                role="tab"-->
                            <!--                                aria-controls="nav-passes"-->
                            <!--                                aria-selected="false"-->
                            <!--                            >-->
                            <!--                                Content Passes-->
                            <!--                            </button>-->
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
                            class="tab-pane"
                            id="nav-media-library"
                            role="tabpanel"
                            aria-labelledby="nav-media-lib-tab"
                        >
                            <MediaLibraryProfile />
                        </div>

                        <!-- TAB - prompt history -->
                        <div
                            class="tab-pane"
                            id="nav-prompt-history"
                            role="tabpanel"
                            aria-labelledby="nav-prompt-history"
                        >
                            <div class="p-3">
                                <div class="container">
                                    <div class="row py-2">
                                        <div
                                            class="col px-0 d-flex align-items-center"
                                        >
                                            <button
                                                :disabled="startSelect"
                                                @click="startSelect = true"
                                                class="btn btn-secondary"
                                            >
                                                <i
                                                    class="fa-light fa-grid-2-plus"
                                                ></i>
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <hr />
                                <div id="prompt-history" class="prompt-grid">
                                    <template
                                        v-for="item in userStore.quickHistory"
                                    >
                                        <div
                                            class="card prompt-item"
                                            :class="{
                                                'prompt-selected':
                                                    promptSelection.includes(
                                                        item.prompt_id
                                                    ),
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
                                                        :checked="
                                                            promptSelection.includes(
                                                                item.prompt_id
                                                            )
                                                        "
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
                                                        <small
                                                            style="
                                                                left: 5px;
                                                                bottom: 3px;
                                                                right: 5px;
                                                                background: rgba(
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0.5
                                                                );
                                                            "
                                                            class="position-absolute text-center w-auto"
                                                            >First Image</small
                                                        >
                                                    </div>
                                                    <span
                                                        style="
                                                            outline: 2px solid
                                                                var(--lavender);
                                                            background: var(
                                                                --dark-900
                                                            );
                                                        "
                                                        class="position-absolute top-0 start-100 translate-middle badge"
                                                    >
                                                        {{
                                                            (
                                                                item.urls as string[]
                                                            ).length
                                                        }}

                                                        <span
                                                            class="visually-hidden"
                                                            >images
                                                            available</span
                                                        >
                                                    </span>
                                                </div>
                                                <div class="col-md-8">
                                                    <div class="card-body">
                                                        <p class="card-text">
                                                            {{
                                                                item.prompt_excerpt
                                                            }}
                                                        </p>
                                                        <p class="card-text">
                                                            <small
                                                                class="text-muted"
                                                                >{{
                                                                    niceDate(
                                                                        item.created ||
                                                                            ("" as string)
                                                                    )
                                                                }}</small
                                                            >
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- TAB - content passes -->
                        <div
                            class="tab-pane"
                            id="nav-passes"
                            role="tabpanel"
                            aria-labelledby="nav-profile-passes"
                        >
                            <div class="p-3 passes-section">
                                <div class="card">
                                    <div class="card-header bg-info text-dark">
                                        Content Passes
                                    </div>
                                    <div class="card-body">
                                        <div
                                            v-if="!rpgUser.nsfw_pass"
                                            class="alert alert-warning alert-dismissible fade show"
                                            role="alert"
                                        >
                                            <strong>Content Limited!</strong>
                                            You currently do not have an NSFW
                                            content pass.
                                            <button
                                                class="btn btn-link p-0 m-0 align-baseline"
                                                type="button"
                                            >
                                                Upgrade
                                            </button>
                                            <button
                                                aria-label="Close"
                                                class="btn-close"
                                                data-bs-dismiss="alert"
                                                type="button"
                                            ></button>
                                        </div>

                                        <div
                                            class="d-flex mb-3 align-items-center nsfw-pass-entry"
                                        >
                                            <h5 class="mb-0">NSFW:</h5>
                                            <div
                                                v-if="!rpgUser.nsfw_pass"
                                                class="ms-2 badge fs-6 text-bg-secondary"
                                            >
                                                Unavailable
                                            </div>
                                            <div
                                                v-else
                                                class="ms-2 badge fs-6 text-bg-success"
                                            >
                                                Purchased
                                            </div>
                                        </div>

                                        <div
                                            class="d-flex mb-3 align-items-center nsfw-pass-entry"
                                        >
                                            <h5 class="mb-0">FaceCrunch:</h5>
                                            <div
                                                class="ms-2 badge fs-6 text-bg-secondary"
                                            >
                                                Unavailable
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <lightbox-component
            :images="lightboxThumbnails"
            :show="showThumbnailLightBox"
            :index="lightboxThumbnailIndex"
            @toast-message="onToastMessage"
            @update:show="showThumbnailLightBox = false"
            @delete-image="onDeleteImage"
        />

        <ToastComponent
            :autoClose="true"
            :autoCloseDelay="6000"
            :isError="userError"
            :message="toastMessage"
            :show="showToast"
        />

        <ModalComponent
            id="prompt-selected"
            modal-title="Prompt Details"
            size="lg"
        >
            <div class="row mb-3">
                <div class="col-md-6">
                    <p class="text-muted mb-1">Prompt</p>
                    <p
                        @click="copyPrompt(selectedPrompt.prompt)"
                        class="text-white"
                        style="cursor: copy"
                    >
                        {{ selectedPrompt.prompt?.replace('"', "") }}
                    </p>
                </div>
                <div class="col-md-6">
                    <div class="form-floating mb-2">
                        <input
                            readonly
                            class="form-control read-only"
                            id="floatingTextarea"
                            :value="selectedPrompt.negative_prompt"
                        />
                        <label for="floatingTextarea">Negative Prompt</label>
                    </div>

                    <div class="form-floating mb-2">
                        <input
                            readonly
                            class="form-control read-only"
                            id="floatingTextarea"
                            :value="selectedPrompt.adherence"
                        />
                        <label for="floatingTextarea">Adherence</label>
                    </div>

                    <div
                        v-if="selectedPrompt?.model"
                        class="form-floating mb-2"
                    >
                        <input
                            readonly
                            class="form-control read-only"
                            id="floatingTextarea"
                            :value="selectedPrompt.model"
                        />
                        <label for="floatingTextarea">Model</label>
                    </div>

                    <div
                        v-if="selectedPrompt?.rpg_presets"
                        class="form-floating mb-2"
                    >
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

                    <p
                        class="mb-1 rounded-3 p-2"
                        style="background: var(--dark-600)"
                    >
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
                            <template
                                v-for="(url, index) in selectedPrompt.urls"
                                :key="index"
                            >
                                <div class="overflow-hidden rounded-2">
                                    <img
                                        v-if="url"
                                        @click="openThumbnailLightbox(url)"
                                        :src="url"
                                        alt="prompt image"
                                        style="transition: 0.2s ease-in-out"
                                        class="object-fit-cover w-100 h-100"
                                    />
                                </div>
                            </template>
                        </div>
                        <div v-if="!selectedPrompt.urls?.length">
                            <p class="text-warning">No images on record.</p>
                            <small class="text-muted"
                                >All images in this prompt have been deleted or
                                no images were created.</small
                            >
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <button @click="deletePrompt" class="btn btn-danger">
                    <i class="fa-regular fa-trash-can"></i> Delete
                </button>
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Close
                </button>
            </template>
        </ModalComponent>

        <div
            v-if="startSelect"
            class="bulk-delete-toolbar position-fixed rounded-3 p-2 text-center"
            style="
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--dark-800);
                max-width: 400px;
                min-width: 360px;
                width: auto;
                outline: 2px solid var(--dark-100);
            "
        >
            <button
                @click="cancelSelections"
                class="btn btn-tertiary"
                v-if="startSelect"
            >
                Cancel
            </button>
            <div v-if="startSelect" class="ms-3 badge badge-info">
                Selected:
                {{ promptSelection.length }}
            </div>
            <button
                :disabled="!promptSelection.length"
                @click="deleteSelections"
                class="btn btn-danger ms-3 position-relative"
            >
                <i
                    v-if="!userStore.userPromptsLoading"
                    class="fa-regular fa-trash-can"
                ></i>
                <load-spinner v-if="userStore.userPromptsLoading" />
                Delete
                <span
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
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
import { computed, nextTick, onMounted, ref, watch } from "vue";
import ToastComponent from "@/components/global/ToastComponent.vue";
import { isMoreThan24Hours, niceDate } from "@/utils/date-utils";
import { STORAGE_KEYS } from "@/utils";
import LightboxComponent from "@/components/global/LightboxComponent.vue";
import { storage } from "@/utils/storage";
import { useAuth0, type User } from "@auth0/auth0-vue";
import ModalComponent from "@/components/global/ModalComponent.vue";
import { Modal } from "bootstrap";
import LoadSpinner from "@/components/global/LoadSpinner.vue";
import UserDetails from "@/components/page-sections/UserDetails.vue";
import MediaLibraryProfile from "@/components/page-sections/MediaLibraryProfile.vue";

const { user } = useAuth0();

/**
 * =*'^'*= DATA =*'^'*=
 */
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

/**
 * =*'^'*= COMPUTED =*'^'*=
 */
const rpgUser = computed(() => userStore.user);
const userError = computed(() => userStore.userError);
const loading = computed(() => userStore.userLoading);
const toastMessage = computed(() => userStore.toastMessage);
const selectedPrompt = computed(() => userStore.selectedPrompt);
const lightboxThumbnails = computed(() => userStore.selectedPrompt.imgURLS);

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
        await fetchOrLoadExisting(newId);
        await userStore.fetchQuickPromptsHistory(rpgUser.value.id);
    }
);

/**
 * =*'^'*= METHODS =*'^'*=
 */
const deletePrompt = async () => {
    const confirm = window.confirm(
        "Are you sure you want to delete this prompt? You will also lose all associated images."
    );
    if (confirm) {
        await userStore.deletePrompt(selectedPrompt.value);

        modalInstance.value?.hide();
    }
};

const getPrompt = async (prompt) => {
    if (startSelect.value) {
        if (promptSelection.value.includes(prompt.prompt_id)) {
            promptSelection.value = promptSelection.value.filter(
                (id) => id !== prompt.prompt_id
            );
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
        lightboxThumbnails.value?.findIndex((img) =>
            img.includes(`${imgId}.image`)
        ) || 0;

    await nextTick();

    if (lightboxThumbnailIndex.value > -1) {
        showThumbnailLightBox.value = true;
    }
};

const onToastMessage = (message) => {
    showToast.value = true;
    userStore.toastMessage = message;
};

const onDeleteImage = async (imageKey) => {
    const confirmDelete = confirm(
        "Are you sure you want to delete this image?"
    );
    if (!confirmDelete) {
        return;
    }

    if (rpgUser.value.id) {
        await userStore.deleteImage({
            file_key: imageKey,
            user_id: rpgUser.value.id,
        });
        showLightbox.value = false;
    }
};

const copyPrompt = async (promptText: string) => {
    await nextTick();
    navigator.clipboard
        .writeText(promptText)
        .then(() => {
            showToast.value = true;
            userStore.toastMessage = "Prompt copied!";

            setTimeout(() => {
                showToast.value = false;
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy to clipboard", err);
        });
};

const fetchOrLoadExisting = async (userId: string) => {
    const stored_images = storage.g(STORAGE_KEYS.images);
    const stored_thumbnails = storage.g(STORAGE_KEYS.thumbnails);
    const have_new_images = storage.g(STORAGE_KEYS.new_images);

    if (!stored_images || !stored_thumbnails || have_new_images === true) {
        await userStore.fetchImages(userId);
        await userStore.getUser(user.value as User);
        return;
    }

    const lastRequested = storage.g(STORAGE_KEYS.images_requested_on);

    if (isMoreThan24Hours(lastRequested)) {
        await userStore.fetchImages(userId);
        await userStore.getUser(user.value as User);
    } else {
        userStore.imageThumbnails = storage.g(
            STORAGE_KEYS.thumbnails
        ).thumbnails;
        userStore.images = storage.g(STORAGE_KEYS.images).images;
    }
};

/**
 * =*'^'*= LIFE-CYCLE =*'^'*=
 */
onMounted(async () => {
    if (rpgUser.value.id) {
        await fetchOrLoadExisting(rpgUser.value.id);
        await userStore.fetchQuickPromptsHistory(rpgUser.value.id);
    }

    const modalElement = document.getElementById("prompt-selected");
    if (modalElement) {
        // @ts-ignore
        modalInstance.value =
            Modal.getInstance(modalElement) || new Modal(modalElement);
    }
});
</script>
