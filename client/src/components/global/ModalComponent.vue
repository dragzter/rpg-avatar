<template>
    <!-- Modal -->
    <div
        class="modal fade modal-lg view-image-modal"
        :id="id"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <img
                        v-if="imgSrc"
                        class="img-fluid"
                        :src="imgSrc"
                        alt="Viewing selected image"
                    />
                </div>
                <div
                    class="modal-footer d-flex align-items-center justify-content-center"
                >
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                    >
                        Close
                    </button>
                    <button type="button" class="btn btn-primary">
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    id: String,
    imgSrc: String,
});
</script>
