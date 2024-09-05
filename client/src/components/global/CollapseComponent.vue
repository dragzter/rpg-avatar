<template>
    <div class="mb-4">
        <p class="d-inline-flex gap-1">
            <a
                class="link-light link-offset-2"
                :href="`#${collapseId}`"
                data-bs-toggle="collapse"
                role="button"
                :aria-expanded="isExpanded.toString()"
                :aria-controls="collapseId"
                @click="toggleChevron"
            >
                {{ label }}
                <i :class="chevronClass"></i>
            </a>
        </p>
        <div
            style="transition: 0s"
            class="collapse"
            :id="collapseId"
            @shown="isExpanded = true"
            @hidden="isExpanded = false"
        >
            <div class="card card-body">
                <slot>
                    <!-- Default content if no slot content is provided -->
                    Some placeholder content for the collapse component. This
                    panel is hidden by default but revealed when the user
                    activates the relevant trigger.
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";

const props = defineProps({
    collapseId: {
        type: String,
        default: "collapseExample", // Default ID for the collapse element
    },
    label: {
        type: String,
        default: "Collapse", // Label for the link
    },
});

const isExpanded = ref(false);

const chevronClass = computed(() =>
    isExpanded.value ? "fa-regular fa-chevron-up" : "fa-regular fa-chevron-down"
);

const toggleChevron = () => {
    isExpanded.value = !isExpanded.value;
};
</script>
