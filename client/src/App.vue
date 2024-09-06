<script lang="ts" setup>
import "./assets/main.css";
import { RouterView } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import { onMounted } from "vue";
import AppFooter from "@/components/AppFooter.vue";
import { Tooltip } from "bootstrap";

onMounted(() => {
    const header = document.querySelector("#app-header-main") as HTMLElement;

    document.addEventListener("scroll", (e) => {
        const top = document.body.getClientRects()[0].top;
        header.style.background =
            top !== 0
                ? "linear-gradient(rgba(0, 0, 0, 0.9) 70%, rgba(17, 9, 25, 1) 100%) rgba(0, 0, 0, 0)"
                : "rgba(0,0,0,0)";
    });

    new Tooltip(document.body, {
        selector: "[data-bs-toggle='tooltip']",
    });
});
</script>

<template>
    <AppHeader />
    <RouterView />
    <AppFooter />
</template>

<style>
:root {
    --popper-theme-background-color: #fff;
    --popper-theme-background-color-hover: #fff;
    --popper-theme-text-color: #333;
    --popper-theme-border-width: 1px;
    --popper-theme-border-style: solid;
    --popper-theme-border-radius: 6px;
    --popper-theme-border-color: #fefefe;
    --popper-theme-padding: 12px;
    --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}
</style>
