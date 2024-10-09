import { createRouter as createVueRouter, createWebHistory, type Router } from "vue-router";
import { type App } from "vue";
import HomeView from "@/views/HomeView.vue";
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

export function createRouter(app: App): Router {
    const router = createVueRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: "/",
                name: "home",
                component: HomeView,
                meta: {
                    title: "RPG Art Generator",
                    description:
                        "Create unique RPG avatars and high-fantasy artwork with our AI generator. Design custom visuals and bring your imagination to life in your RPG universe.",
                    ogImage: "https://rpgartgenerator.com/assets/rogue-24-female.png",
                },
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
