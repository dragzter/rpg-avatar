<template>
    <div class="model-select-wrapper-modal">
        <div
            id="model-select-modal"
            @click="handleClick"
            :style="{
                backgroundImage: `url(assets/${model.img})`,
            }"
            data-bs-dismiss="modal"
            class="d-flex align-items-end justify-content-end"
        >
            <div class="model-select-inner">
                <h5 class="m-0">
                    {{ model.label }}
                </h5>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    model: {
        img: string;
        label: string;
    };
}>();

const emit = defineEmits<{
    select: () => void;
}>();

const handleClick = () => {
    console.log("Model selected", props.model);
    emit("select", props.model);
};
</script>
<style scoped></style>
