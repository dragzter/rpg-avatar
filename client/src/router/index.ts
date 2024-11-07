import { createRouter as createVueRouter, createWebHistory, type Router } from "vue-router";
import { type App } from "vue";
import GenerateImageView from "@/views/GenerateImageView.vue";
import ProductView from "@/views/ProductView.vue";
import ReturnPolicyView from "@/views/ReturnPolicyView.vue";
import ProfileView from "@/views/ProfileView.vue";
import { createAuthGuard, useAuth0, User } from "@auth0/auth0-vue";
import GalleryView from "@/views/GalleryView.vue";
import LoaderView from "@/views/LoaderView.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import SupportView from "@/views/SupportView.vue";
import { useUserStore } from "@/stores/user";
import PageNotFound from "@/views/PageNotFound.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import DeletionStatusView from "@/views/DeletionStatusView.vue";
import CharacterCatalog from "@/views/CharacterCatalog.vue";

export function createRouter(app: App): Router {
    const router = createVueRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: "/",
                name: "home",
                component: GenerateImageView,
            },
            {
                path: "/generate-image",
                name: "generate-image",
                component: GenerateImageView,
            },
            {
                path: "/support",
                name: "support",
                component: SupportView,
            },
            {
                path: "/characters",
                name: "characters",
                component: CharacterCatalog,
            },
            {
                path: "/deletion-status/:confirmationCode",
                name: "DeletionStatus",
                component: DeletionStatusView,
                props: true,
            },
            {
                path: "/get-tokens",
                name: "get-tokens",
                component: ProductView,
            },
            {
                path: "/privacy-policy",
                name: "privacy-policy",
                component: PrivacyPolicy,
            },
            {
                path: "/dashboard",
                name: "admin-dashboard",
                component: AdminDashboard,
                beforeEnter: createAuthGuard(app),
                meta: { requiresAdmin: true, needAuth: true },
            },
            {
                path: "/loaders",
                name: "loaders",
                component: LoaderView,
            },
            {
                path: "/gallery",
                name: "gallery",
                component: CharacterCatalog,
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
            {
                // Catch-all route for handling 404 pages
                path: "/:pathMatch(.*)*",
                name: "PageNotFound",
                component: PageNotFound,
            },
        ],
    });

    router.beforeEach(async (to, from, next) => {
        const userStore = useUserStore();
        const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

        if (!isAuthenticated.value && to.meta.needAuth) {
            try {
                await getAccessTokenSilently(); // Attempt silent login
            } catch (error) {
                console.error("User not authenticated or token fetch failed", error);
                return next({ name: "home" });
            }

            // If the user is authenticated, fetch the user data
            await userStore.getUser(user.value as User);
        }

        if (to.meta.requiresAdmin && !userStore.isAdmin) {
            console.log("not admin");
            return next({ name: "home" });
        }

        next();
    });

    return router;
}
