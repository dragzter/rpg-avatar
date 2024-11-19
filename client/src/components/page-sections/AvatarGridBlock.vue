<template>
    <div class="container-fluid mb-4">
        <div v-if="title" class="row">
            <div class="col">
                <h4 class="text-white">{{ title }}</h4>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="grid-container-large g-2">
                    <template v-for="item in items">
                        <div
                            class="grid-item"
                            data-bs-dismiss="modal"
                            style="outline: 1px solid var(--lavender)"
                        >
                            <img
                                @click="$emit('imageSelected', item)"
                                v-lazy="item"
                                alt="Avatar Base Image Option"
                            />
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    items: Array,
    title: String,
});
</script>
