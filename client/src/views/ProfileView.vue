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
                                <small class="image-cap-indicator"
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
                                <small class="image-cap-indicator">{{
                                    userStore.quickHistory?.length || 0
                                }}</small>
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
                            <div class="p-3">
                                <!-- User summary row-->
                                <div class="row pt-4 mb-3">
                                    <div class="col">
                                        <h5 class="user-greeting">
                                            Welcome,
                                            <span class="user-nickname">{{
                                                rpgUser.nickname
                                            }}</span>
                                        </h5>
                                    </div>
                                    <div class="col text-end">
                                        <router-link
                                            class="fw-light"
                                            data-bs-placement="top"
                                            data-bs-title="Buy More Tokens"
                                            data-bs-toggle="tooltip"
                                            to="get-tokens"
                                            ><h5
                                                :class="{
                                                    'border-danger':
                                                        rpgUser.token_balance ===
                                                        0,
                                                }"
                                                class="user-tokens-wrapper d-inline-block mb-0"
                                            >
                                                <span style="color: goldenrod"
                                                    ><i
                                                        class="fa-sharp fa-light fa-coins"
                                                    ></i
                                                ></span>
                                                <span
                                                    :class="{
                                                        'text-danger':
                                                            rpgUser.token_balance ===
                                                            0,
                                                    }"
                                                    class="ms-2"
                                                    >{{
                                                        rpgUser.token_balance ||
                                                        0
                                                    }}</span
                                                >
                                            </h5>
                                        </router-link>
                                    </div>
                                </div>

                                <!-- User details row-->
                                <dl class="row rounded-3 bg-dark-600">
                                    <dt>
                                        <h5 class="mb-5 text-white">
                                            User Details
                                        </h5>
                                    </dt>

                                    <dt class="col-sm-3">Email</dt>
                                    <dd class="col-sm-9">
                                        <p class="lead">
                                            {{
                                                rpgUser?.email ||
                                                "No email on file."
                                            }}
                                        </p>
                                    </dd>

                                    <dt class="col-sm-3">Nickname</dt>
                                    <dd class="col-sm-9">
                                        <p class="lead">
                                            {{ rpgUser.nickname }}
                                        </p>
                                    </dd>

                                    <dt class="col-sm-3">Images Saved</dt>
                                    <dd class="col-sm-9">
                                        <p class="lead">
                                            {{ rpgUser.image_count || 0 }}
                                        </p>
                                    </dd>

                                    <dt class="col-sm-3">
                                        Signed AI Disclaimer
                                    </dt>
                                    <dd class="col-sm-9">
                                        <p class="lead">
                                            {{
                                                rpgUser.disclaimer_signed_on_date
                                            }}
                                        </p>
                                    </dd>

                                    <dt class="col-sm-3">User ID</dt>
                                    <dd class="col-sm-9">
                                        <p class="lead text-success">
                                            {{ rpgUser.id }}
                                        </p>
                                    </dd>
                                </dl>

                                <!-- User passes row-->
                                <div class="row" id="redeem-passes-row">
                                    <div class="col bg-dark-600 rounded-3">
                                        <h5 class="text-white p-2 my-2">
                                            Redeem Codes
                                        </h5>
                                        <div
                                            class="position-relative p-2 flex-column flex-md-row d-flex gap-4"
                                        >
                                            <InputButtonSubmit
                                                id="token-code-submit"
                                                v-model="tokenCodeToRedeem"
                                                accent-text="TOKEN CODE"
                                                button-text="Redeem"
                                                label-text="Redeem a "
                                                placeholder-text="Code"
                                                @button-click="
                                                    redeemCodeV2(
                                                        'token',
                                                        tokenCodeToRedeem
                                                    )
                                                "
                                            />

                                            <InputButtonSubmit
                                                id="pass-code-submit"
                                                v-model="passCodeToRedeem"
                                                accent-text="CONTENT PASS CODE"
                                                button-text="Redeem"
                                                label-text="Redeem a "
                                                placeholder-text="Code"
                                                @button-click="
                                                    redeemCodeV2(
                                                        'pass',
                                                        passCodeToRedeem
                                                    )
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB - media lib -->
                        <div
                            class="tab-pane"
                            id="nav-media-library"
                            role="tabpanel"
                            aria-labelledby="nav-media-lib-tab"
                        >
                            <div class="p-3">
                                <div id="user-media-library" class="image-grid">
                                    <template
                                        v-for="image in userStore.imageThumbnails"
                                    >
                                        <div class="overflow-hidden">
                                            <img
                                                @click="openLightbox(image.key)"
                                                :src="image.url"
                                                :alt="image.key"
                                            />
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- TAB - prompt history -->
                        <div
                            class="tab-pane"
                            id="nav-prompt-history"
                            role="tabpanel"
                            aria-labelledby="nav-prompt-history"
                        >
                            <div class="p-3">
                                <div id="prompt-history" class="prompt-grid">
                                    <template
                                        v-for="item in userStore.quickHistory"
                                    >
                                        <div class="card">
                                            <div class="row g-0">
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
                                                        class="position-absolute top-0 start-100 translate-middle badge bg-primary"
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
                                                                    item.created
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
            :images="lightboxImages"
            :show="showLightbox"
            :index="lightboxIndex"
            @toast-message="onToastMessage"
            @update:show="showLightbox = false"
            @delete-image="onDeleteImage"
            :allow-delete="true"
        />

        <ToastComponent
            :autoClose="true"
            :autoCloseDelay="6000"
            :isError="userError"
            :message="toastMessage"
            :show="showToast"
        />
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import InputButtonSubmit from "@/components/global/InputButtonSubmit.vue";
import ToastComponent from "@/components/global/ToastComponent.vue";
import { isMoreThan24Hours } from "@/utils/date-utils";
import { STORAGE_KEYS } from "@/utils";
import LightboxComponent from "@/components/global/LightboxComponent.vue";
import { storage } from "@/utils/storage";
import { useAuth0, type User } from "@auth0/auth0-vue";

const { user } = useAuth0();

/**
 * =*'^'*= DATA =*'^'*=
 */
const userStore = useUserStore();
const tokenCodeToRedeem = ref("");
const passCodeToRedeem = ref("");
const showToast = ref(false);
const showLightbox = ref(false);
const lightboxIndex = ref(0);

/**
 * =*'^'*= COMPUTED =*'^'*=
 */
const rpgUser = computed(() => userStore.user);
const userError = computed(() => userStore.userError);
const loading = computed(() => userStore.userLoading);
const lightboxImages = computed(() => userStore.images.map((img) => img.url));
const toastMessage = computed(() => userStore.toastMessage);

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
const openLightbox = async (imageKey) => {
    const imgId = imageKey.split("/thumbnails/")[1].split(".")[0];

    lightboxIndex.value = lightboxImages.value?.findIndex((img) =>
        img.includes(`${imgId}.image`)
    );

    await nextTick();

    if (lightboxIndex.value > -1) {
        showLightbox.value = true;
    }
};

const onToastMessage = (message) => {
    showToast.value = true;
    userStore.toastMessage = message;
};

const redeemCodeV2 = async (codeType: "token" | "pass", code: string) => {
    showToast.value = false;
    await userStore.redeemCodeV2({
        user_id: rpgUser.value.id,
        code,
        type: codeType,
    });
    showToast.value = true;
    passCodeToRedeem.value = "";
    tokenCodeToRedeem.value = "";
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

const fetchOrLoadExisting = async (userId) => {
    const stored_images = storage.g(STORAGE_KEYS.images);
    const stored_thumbnails = storage.g(STORAGE_KEYS.thumbnails);
    const have_new_images = storage.g(STORAGE_KEYS.new_images);

    if (!stored_images || !stored_thumbnails || have_new_images === true) {
        console.log("fetching images");
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

        console.log("fetching prompts history");
        await userStore.fetchPromptsHistory(rpgUser.value.id);
    }
});
</script>
<style scoped>
#user-media-library {
    padding: 12px;

    @media (max-width: 768px) {
        padding: 5px;
    }
}

.prompt-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    grid-auto-rows: 1fr;
    align-items: start;
    cursor: pointer;

    .card img {
        transition: 0.2s ease-in-out;
    }
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    grid-auto-rows: 1fr;
    align-items: center;

    @media (min-width: 276px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(150px, 2fr));
        gap: 4px;
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 6px;
    }
}

.image-grid img {
    width: 100%;
    max-width: 200px;
    object-fit: cover;
    cursor: pointer;
    border-radius: 6px;
    transition: 0.2s ease-in-out;

    @media (max-width: 768px) {
        max-width: 100% !important;
    }
}

.image-grid > div {
    transition: 0.2s ease-in-out;
    border-radius: 6px;
}

.image-grid > div:hover,
.prompt-grid > div:hover {
    outline: 4px solid var(--lavender);

    img {
        transform: scale(1.05);
    }
}

.image-cap-indicator {
    background: var(--dark-300);
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 12px;
    color: #dcdcf8;
}
</style>
