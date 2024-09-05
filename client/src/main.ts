import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/main.css";
import "./assets/loader.css";

import Popper from "vue3-popper";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createRouter } from "./router";
import { createAuth0 } from "@auth0/auth0-vue";

const app = createApp(App);

app.use(
    createAuth0({
        domain: "dev-g8dl84yolh7g3giy.us.auth0.com",
        clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: window.location.origin,
        },
    })
);

app.component("Popper", Popper);

app.use(createPinia()).use(createRouter(app)).mount("#app");
