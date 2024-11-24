import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            //"@": fileURLToPath(new URL("./src", import.meta.url)),
            "@": path.resolve(__dirname, "./src"), // Ensures '@' maps to 'src' directory
            "vue-easy-lightbox$": "vue-easy-lightbox/dist/external-css/vue-easy-lightbox.esm.min.js",
        },
    },
});
