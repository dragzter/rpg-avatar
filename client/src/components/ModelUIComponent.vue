<template>
    <div class="card h-100 model-details-select" @click="handleClick" data-bs-dismiss="modal">
        <img
            style="height: 140px; object-position: left"
            :src="`assets/${model.img}`"
            class="card-img-top object-fit-cover"
            :alt="model.img"
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
                <div v-for="tag in model.tags" :key="tag" class="model-tag d-inline-block">
                    {{tag}}
                </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import type {PropType} from "vue";
import type {AiModel} from "@/stores/types";

const props = defineProps({
    model: {
        type: Object as PropType<AiModel>,
        required: true,
    },
});

const emit = defineEmits(["select"]);

const handleClick = () => {
    emit("select", props.model);
};
</script>
<style>
.model-tag {
    background: #9e9ef0;
    color: #111;
    font-size: 12px;
    padding: 2px 6px;
    margin-right: 3px;
    border-radius: 6px;
}
</style>
