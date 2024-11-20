<template>
    <MobileMenu />
    <section id="app-header-main">
        <div class="container">
            <div class="row">
                <div class="d-flex justify-content-between">
                    <div class="brand-container d-flex align-items-center position-relative">
                        <router-link to="/">
                            <img
                                id="main-logo"
                                alt="RPG Avatar"
                                class="img-fluid me-3"
                                src="/assets/rpgavatarlogo.png"
                            />
                            <code>rpgavatar.com</code>
                        </router-link>
                    </div>

                    <div id="nav-column" class="d-flex align-items-center d-none d-lg-inline-flex">
                        <router-link class="mx-1 btn btn-primary px-2 py-1" to="create-avatar"
                            ><i class="fa-sharp fa-solid fa-user-ninja"></i> Avatar Maker
                        </router-link>
                        <router-link aria-current="page" class="nav-link mx-1" to="/generate-image"
                            >Generate AI Art
                        </router-link>
                        <router-link class="nav-link mx-1 btn-outline-special" to="get-tokens"
                            >Buy Tokens
                        </router-link>
                        <router-link class="nav-link mx-1 accent-link" to="gallery">AI Gallery </router-link>
                    </div>

                    <div id="auth-column">
                        <div v-if="isAuthenticated" class="mx-1 welcome-user">
                            <span class="me-2 border border-2 p-1 px-2" style="border-radius: 5px"
                                ><i class="fa-light fa-coin-vertical" style="color: goldenrod"></i>
                                {{ rpgUser.token_balance }}</span
                            >
                            <span class="user-nickname text-white">{{ user?.nickname }}</span>
                        </div>
                        <button
                            v-if="!isAuthenticated"
                            class="btn btn-lg fw-normal btn-primary"
                            @click="login"
                        >
                            SIGN IN
                        </button>
                        <div v-else class="dropdown">
                            <button
                                aria-expanded="false"
                                class="btn btn-info dropdown-toggle border-0 shadow-0"
                                data-bs-toggle="dropdown"
                                type="button"
                            >
                                <img
                                    v-if="user?.picture"
                                    :src="user?.picture"
                                    alt="User profile picture"
                                    style="width: 40px; border-radius: 50%"
                                />
                                <i v-else class="fa-solid fa-user"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <router-link class="dropdown-item profile-link fw-bold" to="profile"
                                        >Profile
                                    </router-link>
                                </li>

                                <li>
                                    <router-link class="dropdown-item" to="generate-image"
                                        >Generate Art
                                    </router-link>
                                </li>
                                <hr />
                                <li>
                                    <router-link class="dropdown-item" to="return-policy"
                                        >Refund Policy
                                    </router-link>
                                </li>
                                <li>
                                    <router-link class="dropdown-item" to="privacy-policy"
                                        >Privacy Policy
                                    </router-link>
                                </li>
                                <hr />
                                <li v-if="rpgUser?.id">
                                    <button class="dropdown-item text-danger" @click="deleteAccount">
                                        Delete Account
                                    </button>
                                </li>
                                <hr />
                                <li>
                                    <router-link
                                        v-if="rpgUser?.admin"
                                        class="dropdown-item text-bg-warning"
                                        to="dashboard"
                                        >Admin Dashboard
                                    </router-link>
                                </li>

                                <li>
                                    <button class="dropdown-item" @click="logOut">Log Out</button>
                                </li>
                            </ul>
                        </div>

                        <!-- Mobile menu -->
                        <div class="mobile-menu-toggle d-lg-none">
                            <button
                                aria-controls="navbarText"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                                class="navbar-toggler d-lg-none ms-4 mt-1"
                                @click="openMobileMenu"
                                type="button"
                            >
                                <i class="fa-solid fs-2 fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { useAuth0, type User } from "@auth0/auth0-vue";
import { computed, onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import MobileMenu from "@/components/MobileMenu.vue"; // DATA
import { Modal } from "bootstrap";
import { useRouter } from "vue-router"; // Import Bootstrap

// DATA
const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
const userStore = useUserStore();
const router = useRouter();
const modalInstance = ref(null);

const rpgUser = computed(() => userStore.user);
const loading = computed(() => userStore.userLoading);

const login = () => {
    loginWithRedirect({ redirect_uri: window.location.href } as Record<string, string>);
};

watch(
    () => user.value,
    async (newVal) => {
        if (newVal?.sub) {
            await userStore.getUser(newVal as User);
        }
    }
);

const deleteAccount = async () => {
    const confirmation = confirm(
        "Are you sure you want to delete your account? This will permanently remove all stored PROMPTS, TOKENS and IMAGES, and cannot be undone. Bonus tokens will not be reissued."
    );

    if (confirmation) {
        await userStore.deleteUserAccount({ userId: rpgUser.value.id });
        await logOut();
    }
};

const logOut = () => logout({ logoutParams: { returnTo: window.location.href } });

// Initialize the modal instance
const initializeModal = () => {
    const modalElement = document.getElementById("mobile-menu");
    if (modalElement) {
        // @ts-ignore
        modalInstance.value = Modal.getInstance(modalElement) || new Modal(modalElement);
    }
};

const openMobileMenu = () => {
    // @ts-ignore
    modalInstance?.value?.show();
};

const closeModal = () => {
    // @ts-ignore
    modalInstance?.value?.hide();
};

onMounted(() => {
    initializeModal();
    router.afterEach(() => {
        closeModal();
    });
});
</script>
