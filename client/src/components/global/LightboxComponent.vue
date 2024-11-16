<template>
    <vue-easy-lightbox :imgs="images" :index="index" :visible="show" @hide="$emit('update:show', false)">
        <template v-slot:toolbar="{ toolbarMethods }">
            <div class="vel-toolbar view-image-actions overflow-visible">
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
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Zoom In"
                >
                    <i class="fa-regular fa-magnifying-glass-plus"></i>
                </button>
                <button
                    class="btn action-btn btn-dark"
                    @click="toolbarMethods.zoomOut"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Zoom Out"
                >
                    <i class="fa-regular fa-magnifying-glass-minus"></i>
                </button>
                <button
                    v-if="!viewOnly"
                    class="btn action-btn btn-dark"
                    @click="downloadImage(images[index])"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Download"
                >
                    <i class="fa-solid fa-arrow-down-to-bracket"></i>
                </button>
                <button
                    v-if="!viewOnly"
                    class="btn action-btn btn-dark"
                    @click="copyImgURL(images[index])"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Copy"
                >
                    <i class="fa-regular fa-copy"></i>
                </button>
                <button
                    v-if="(allowDelete || isAdmin) && !viewOnly"
                    class="btn action-btn btn-dark"
                    @click="deleteImage(images[index])"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Delete"
                >
                    <i class="fa-regular fa-trash-alt"></i>
                </button>
                <button
                    v-if="isAdmin && !isImagePublished(images[index]) && !viewOnly"
                    class="btn action-btn btn-dark"
                    @click="publishImage(images[index])"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Publish"
                >
                    <i class="fa-regular fa-share-from-square"></i>
                </button>
                <button
                    v-if="isAdmin && isImagePublished(images[index]) && !viewOnly"
                    class="btn action-btn btn-dark"
                    @click="unPublish(images[index])"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Unpublish"
                >
                    <i class="fa-solid fa-square-xmark"></i>
                </button>
            </div>
        </template>
    </vue-easy-lightbox>
</template>
<script setup lang="ts">
import { nextTick, type PropType, ref } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import type { UserImage } from "@/stores/types"; // Ez-lightbox
import { v4 as uuid } from "uuid";

// Ez-lightbox
const sharedImgUrl = ref("");
const copySuccess = ref(false);

const userStore = useUserStore(); // The user store will always have the images, so it's ok to hardcode here.

const emit = defineEmits([
    "update:show",
    "downloadSuccess",
    "publishImage",
    "toastMessage",
    "error",
    "unpublishImage",
    "deleteImage",
]);

const props = defineProps({
    images: {
        type: Array as PropType<string[]>,
        default: () => [],
    },
    show: {
        type: Boolean,
        default: false,
    },
    index: {
        type: Number,
        default: 0,
    },
    allowDelete: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    viewOnly: {
        type: Boolean,
        default: false,
    },
});

const publishImage = async (imgUrl: string) => {
    await nextTick();
    emit("publishImage", imgUrl);
};

const unPublish = async (imgUrl: string) => {
    await nextTick();
    emit("unpublishImage", imgUrl);
};

const downloadImage = async (url) => {
    await nextTick();

    try {
        let blobUrl;

        // Check if the URL is a base64 string
        if (url.startsWith("data:image/")) {
            // Convert base64 to Blob
            const byteString = atob(url.split(",")[1]);
            const mimeType = url.match(/data:(.*?);base64,/)[1];
            const arrayBuffer = new Uint8Array(byteString.length);

            for (let i = 0; i < byteString.length; i++) {
                arrayBuffer[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([arrayBuffer], { type: mimeType });
            blobUrl = URL.createObjectURL(blob);
        } else {
            // If the URL is not base64, fetch it from the server
            const response = await axios.get(import.meta.env.VITE_APP_API_URL + "/download-image", {
                params: { url },
                responseType: "blob", // Expect binary response as a blob
            } as any);
            blobUrl = URL.createObjectURL(response.data);
        }

        // Create a link element for download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `rpgavatar.${uuid()}.jpeg`; // Set desired file name

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);

        emit("toastMessage", "Download completed!");
    } catch (err) {
        console.error("Error details:", (err as any).response || err);
        emit("error", err);
        emit("toastMessage", "Download failed");
    }
};

const isImagePublished = (url) => {
    // Find out if any of the published Images are included in the current URL
    const published_ids = userStore.selectedPrompt?.published_images?.map((pimg) => pimg.split(".")[0]);

    return published_ids?.some((pimg) => url.includes(pimg));
};

const deleteImage = async (imgUrl: string) => {
    await nextTick();
    // Targeting the specific image to delete using the provided index.  The order of images form backblaze is stable.
    try {
        if (userStore?.images[props.index]?.key) {
            emit("deleteImage", (userStore.images[props.index] as UserImage).key);

            emit("toastMessage", "Image deleted");
        }
    } catch (err) {
        console.error("Failed to delete image", err);
        emit("error", err);
        emit("toastMessage", "Failed to delete image");
    }
};

const copyImgURL = async (imgUrl: string) => {
    await nextTick();
    sharedImgUrl.value = imgUrl;
    navigator.clipboard
        .writeText(sharedImgUrl.value)
        .then(() => {
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
