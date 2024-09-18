<template>
    <MobileMenu />
    <section id="app-header-main">
        <div class="container">
            <div class="row">
                <div class="d-flex justify-content-between">
                    <div
                        class="brand-container d-flex align-items-center position-relative"
                    >
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

                    <div
                        id="nav-column"
                        class="d-flex align-items-center d-none d-md-inline-flex"
                    >
                        <router-link
                            aria-current="page"
                            class="nav-link mx-1"
                            to="/"
                            >HOME
                        </router-link>
                        <router-link
                            class="nav-link mx-1 btn-outline-special"
                            to="get-tokens"
                            >BUY
                        </router-link>

                        <router-link
                            class="nav-link mx-1 accent-link"
                            to="community-gallery"
                            >GALLERY
                        </router-link>
                        <router-link
                            class="btn btn-secondary mx-2"
                            to="generate-image"
                            >GENERATE
                        </router-link>
                    </div>

                    <div id="auth-column">
                        <div v-if="isAuthenticated" class="mx-2 welcome-user">
                            <span
                                class="me-2 border border-2 p-1 px-2"
                                style="border-radius: 5px"
                                ><i
                                    class="fa-light fa-coin-vertical"
                                    style="color: goldenrod"
                                ></i>
                                {{ rpgUser.token_balance }}</span
                            >
                            <span class="user-nickname text-white">{{
                                user?.nickname
                            }}</span>
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
                                    <router-link
                                        class="dropdown-item"
                                        to="profile"
                                        >Profile
                                    </router-link>
                                </li>

                                <li>
                                    <router-link
                                        class="dropdown-item"
                                        to="generate-image"
                                        >Generate Art
                                    </router-link>
                                </li>
                                <hr />
                                <li>
                                    <router-link
                                        class="dropdown-item"
                                        to="return-policy"
                                        >Refund Policy
                                    </router-link>
                                </li>
                                <li>
                                    <router-link
                                        class="dropdown-item"
                                        to="privacy-policy"
                                        >Privacy Policy
                                    </router-link>
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
                                <li v-if="rpgUser?.id">
                                    <button
                                        class="dropdown-item text-danger"
                                        @click="deleteAccount"
                                    >
                                        Delete Account
                                    </button>
                                </li>
                                <li>
                                    <button
                                        class="dropdown-item"
                                        @click="logOut"
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <!-- Mobile menu -->
                        <div class="mobile-menu-toggle d-md-none">
                            <button
                                aria-controls="navbarText"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                                class="navbar-toggler d-md-none ms-4 mt-1"
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
    loginWithRedirect({ redirect_uri: window.location.href } as Record<
        string,
        string
    >);
};

watch(
    () => user.value,
    async (newVal) => {
        console.log(newVal, "user new");

        if (newVal?.sub) {
            await userStore.getUser(newVal as User);
        }
    }
);

const deleteAccount = async () => {
    await userStore.deleteUserAccount({ userId: rpgUser.value.id });
    await logOut();
};

const logOut = () =>
    logout({ logoutParams: { returnTo: window.location.href } });

// Initialize the modal instance
const initializeModal = () => {
    const modalElement = document.getElementById("mobile-menu");
    if (modalElement) {
        modalInstance.value =
            Modal.getInstance(modalElement) || new Modal(modalElement);
    }
};

const openMobileMenu = () => {
    modalInstance?.value?.show();
};

const closeModal = () => {
    modalInstance?.value?.hide();
};

onMounted(() => {
    initializeModal();
    router.afterEach(() => {
        closeModal();
    });
});
</script>
