import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/main.css";
import "./assets/loader.css";

// Vue easy lightbox plugin
import "vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css";
import VueEasyLightbox from "vue-easy-lightbox";

import Popper from "vue3-popper";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createRouter } from "./router";
import { createAuth0 } from "@auth0/auth0-vue";
import { createHead } from "@vueuse/head";
import "animate.css";

const app = createApp(App);
const head = createHead(); // Initialize `createHead`

app.use(
    createAuth0({
        domain: "dev-g8dl84yolh7g3giy.us.auth0.com",
        clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
        cacheLocation: "localstorage",
        useRefreshTokens: true,
        authorizationParams: {
            redirect_uri: window.location.origin,
        },
    })
);

app.component("Popper", Popper);

app.use(createPinia()).use(head).use(createRouter(app)).use(VueEasyLightbox).mount("#app");
