<template>
    <vue-easy-lightbox
        :imgs="images"
        :index="index"
        :visible="show"
        @hide="$emit('update:show', false)"
    >
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
                >
                    <i class="fa-regular fa-magnifying-glass-plus"></i>
                </button>
                <button
                    class="btn action-btn btn-dark"
                    @click="toolbarMethods.zoomOut"
                >
                    <i class="fa-regular fa-magnifying-glass-minus"></i>
                </button>
                <button
                    class="btn action-btn btn-dark"
                    @click="downloadImage(images[index])"
                >
                    <i class="fa-solid fa-arrow-down-to-bracket"></i>
                </button>
                <button
                    class="btn action-btn btn-dark"
                    @click="copyImgURL(images[index])"
                >
                    <i class="fa-regular fa-copy"></i>
                </button>
                <button
                    v-if="allowDelete"
                    class="btn action-btn btn-dark"
                    @click="deleteImage(images[index])"
                >
                    <i class="fa-regular fa-trash-alt"></i>
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

// Ez-lightbox
const sharedImgUrl = ref("");
const copySuccess = ref(false);

const userStore = useUserStore(); // The user store will always have the images, so it's ok to hardcode here.

const emit = defineEmits([
    "update:show",
    "downloadSuccess",
    "toastMessage",
    "error",
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
});

const downloadImage = async (url) => {
    await nextTick(); // Ensure that the DOM updates are complete

    try {
        // Call the Node.js server to download the image, passing the Backblaze URL as a query parameter
        const response = await axios.get(
            import.meta.env.VITE_APP_API_URL + "/download-image",
            {
                params: {
                    url: url, // Pass the Backblaze presigned URL as a query parameter
                },
                responseType: "blob", // Expect the binary response as a blob
            }
        );

        // Create a URL for the Blob object directly from response.data (the blob)
        const blobUrl = URL.createObjectURL(response.data);

        // Create a link element for download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `rpgavatar.com-image.jpeg`; // Set the desired file name

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the Blob URL
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);

        emit("toastMessage", "Download completed!");
    } catch (err: any) {
        console.log("Error details:", err.response ? err.response : err);
        emit("error", err);
        emit("toastMessage", "Download failed");
    }
};

const deleteImage = async (imgUrl: string) => {
    await nextTick();
    // Targeting the specific image to delete using the provided index.  The order of images form backblaze is stable.
    try {
        if (userStore?.images[props.index]?.key) {
            emit(
                "deleteImage",
                (userStore.images[props.index] as UserImage).key
            );

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