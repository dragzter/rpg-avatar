<template>
    <div class="p-3">
        <div id="user-media-library" class="image-grid">
            <template v-for="image in userStore.imageThumbnails">
                <div class="overflow-hidden" style="background: #142434">
                    <img
                        :alt="image.key"
                        :class="{ 'images-loading': loading }"
                        :src="image.url"
                        class="media-gallery-image"
                        @click="openLightbox(image.key)"
                    />
                </div>
            </template>
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
</template>
<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { computed, nextTick, ref } from "vue";
import LightboxComponent from "@/components/global/LightboxComponent.vue";

/**
 * =*'^'*= DATA =*'^'*=
 */
const userStore = useUserStore();
const lightboxIndex = ref(0);
const showLightbox = ref(false);
const showToast = ref(false);

/**
 * =*'^'*= COMPUTED =*'^'*=
 */
const lightboxImages = computed(() => userStore.images.map((img) => img.url));
const rpgUser = computed(() => userStore.user);
const loading = computed(() => userStore.imagesLoading);

/**
 * =*'^'*= METHODS =*'^'*=
 */
const openLightbox = async (imageKey) => {
    const imgId = imageKey.split("/thumbnails/")[1].split(".")[0];

    lightboxIndex.value = lightboxImages.value?.findIndex((img) => img.includes(`${imgId}.image`));

    await nextTick();

    if (lightboxIndex.value > -1) {
        showLightbox.value = true;
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

const onToastMessage = (message) => {
    showToast.value = true;
    userStore.toastMessage = message;
};
</script>
