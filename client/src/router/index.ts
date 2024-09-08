import {
    createRouter as createVueRouter,
    createWebHistory,
    type Router,
} from "vue-router";
import { type App } from "vue";
import HomeView from "@/views/HomeView.vue";
import GenerateImageView from "@/views/GenerateImageView.vue";
import ProductView from "@/views/ProductView.vue";
import ReturnPolicyView from "@/views/ReturnPolicyView.vue";
import ProfileView from "@/views/ProfileView.vue";
import { createAuthGuard } from "@auth0/auth0-vue";
import GalleryView from "@/views/GalleryView.vue";
import LoaderView from "@/views/LoaderView.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";

export function createRouter(app: App): Router {
    const router = createVueRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: "/",
                name: "home",
                component: HomeView,
            },
            {
                path: "/generate-image",
                name: "generate-image",
                component: GenerateImageView,
            },
            {
                path: "/get-tokens",
                name: "get-tokens",
                component: ProductView,
            },
            {
                path: "/admin-dashboard",
                name: "admin-dashboard",
                component: AdminDashboard,
                beforeEnter: createAuthGuard(app),
            },
            {
                path: "/loaders",
                name: "loaders",
                component: LoaderView,
            },
            {
                path: "/community-gallery",
                name: "gallery",
                component: GalleryView,
            },
            {
                path: "/return-policy",
                name: "return-policy",
                component: ReturnPolicyView,
            },
            {
                path: "/profile",
                name: "profile",
                component: ProfileView,
                beforeEnter: createAuthGuard(app),
            },
        ],
    });

    return router;
}
