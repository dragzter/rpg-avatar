<template>
    <div class="deletion-status container">
        <div class="row">
            <div class="col">
                <div class="p-4 text-bg-info rounded-4">
                    <h1>Account Status</h1>

                    <p v-if="loading">Loading...</p>
                    <div v-if="!loading && status">
                        <p class="fs-5">
                            Confirmation Code: {{ confirmationCode }}
                        </p>
                        <p class="fs-5">Status: {{ status }}</p>
                    </div>
                    <p v-if="error">{{ error }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios"; // Props

// Props
const props = defineProps<{ confirmationCode: string }>();

// State variables
const status = ref("");
const loading = ref(true);
const error = ref<null | string>(null);

// Get confirmation code from route
const route = useRoute();
const confirmationCode =
    props.confirmationCode || (route.params.confirmationCode as string);

// Fetch the deletion status on component mount
onMounted(async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/deletion-status/${confirmationCode}`
        );
        status.value = response.data.status;
    } catch (err) {
        error.value =
            "Error fetching status or your confirmation code is invalid.";
    } finally {
        loading.value = false;
    }
});
</script>
