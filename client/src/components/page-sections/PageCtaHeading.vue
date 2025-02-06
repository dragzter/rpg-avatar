<template>
    <div class="solution-area mtb-192">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h2 class="title-2" v-html="content"></h2>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    content: {
        type: String,
        required: true,
    },
});
</script>
