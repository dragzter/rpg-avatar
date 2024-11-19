<template>
    <div class="col-6 col-md-4 col-lg-3 d-flex character-preset-card">
        <div class="card flex-fill overflow-hidden">
            <div class="card-corner"></div>
            <div class="cost-indicator">
                <h4 class="m-0 fw-bold">
                    <i class="fa-sharp fa-regular fa-coin-vertical"></i> {{ data.cost }}
                </h4>
            </div>

            <img
                v-lazy="{ src: `assets/presets/${data.image}` }"
                @click="clickImage(`assets/presets/${data.image}`)"
                class="card-img-top"
                alt="Fantasy Character"
            />
            <div class="card-body d-flex flex-column">
                <h5 class="card-title mb-3 text-capitalize accent-text">
                    <span>{{ data.name }}</span>
                </h5>
                <hr />
                <p class="card-text">{{ data.description }}</p>
                <button @click="createFromPreset" class="btn btn-primary mt-auto">
                    <i class="fa-sharp fa-solid fa-wand-magic-sparkles"></i> CREATE
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

const emit = defineEmits(["clickImage"]);
const router = useRouter();
const { isAuthenticated, loginWithPopup } = useAuth0();
const props = defineProps<{
    data: {
        name: string;
        description: string;
        image: string;
        cost: number;
        model: string;
        api_preset_id: string;
    };
}>();

const createFromPreset = async () => {
    console.log(isAuthenticated.value);
    if (!isAuthenticated.value) {
        await loginWithPopup();
    }

    await router.push({
        name: "generate-image",
        query: {
            preset_id: props.data.api_preset_id,
            model: props.data.model,
        },
    });
};

const clickImage = (url) => {
    emit("clickImage", url);
};
</script>
