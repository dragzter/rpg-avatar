<template>
    <div class="card h-100 model-details-select" @click="handleClick" data-bs-dismiss="modal">
        <img
            style="height: 140px; object-position: left"
            :src="`assets/${model.img}`"
            class="card-img-top object-fit-cover"
            alt="..."
        />
        <div class="card-body">
            <small class="card-title">{{ model.label }}</small>
            <p class="card-text">
                <p
                ><i class="fa-light fa-coins text-warning me-2"></i
                ><span class="accent-text fw-bold">{{ model.cost }}</span> per image
                </p>
            </p>
            <p class="model-description d-none d-md-block">{{ model.description }}</p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import type {PropType} from "vue";

const props = defineProps({
    model: {
        type: Object as PropType<ModelSelection>,
        required: true,
    },
});

const emit = defineEmits(["select"]);

const handleClick = () => {
    emit("select", props.model);
};
</script>
