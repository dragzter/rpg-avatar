<template>
    <section id="app-header-main">
        <div class="container">
            <div class="row">
                <div class="d-flex justify-content-between">
                    <div
                        class="brand-container d-flex align-items-center position-relative"
                    >
                        <img
                            id="main-logo"
                            class="img-fluid me-3"
                            src="../assets/img/rpgavatarlogo.png"
                            alt="RPG Avatar"
                        />
                        <code>rpgavatar.com</code>
                        <div
                            style="
                                left: 4px;
                                bottom: -24px;
                                border: 2px solid #f0b93e;
                                border-radius: 8px;
                                color: #f0b93e;
                            "
                            class="position-absolute px-1 fw-bolder"
                        >
                            BETA
                        </div>
                    </div>
                    <button
                        aria-controls="navbarText"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        class="navbar-toggler d-md-none"
                        data-bs-target="#navbarText"
                        data-bs-toggle="collapse"
                        type="button"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div id="nav-column" class="d-flex align-items-center">
                        <router-link
                            aria-current="page"
                            class="nav-link fs-6 mx-2"
                            to="/"
                            >HOME
                        </router-link>
                        <router-link
                            to="get-tokens"
                            class="nav-link fs-6 mx-2 btn-outline-special"
                            >GET TOKENS
                        </router-link>
                        <router-link
                            class="nav-link fs-6 mx-2 accent-link"
                            to="community-gallery"
                            >GALLERY
                        </router-link>
                    </div>

                    <div id="auth-column">
                        <div class="mx-3 welcome-user" v-if="isAuthenticated">
                            <span class="text-white">{{ user?.nickname }}</span>
                        </div>
                        <button
                            v-if="!isAuthenticated"
                            @click="login"
                            class="btn btn-lg fw-normal btn-primary"
                        >
                            SIGN IN
                        </button>

                        <div v-else class="dropdown">
                            <button
                                class="btn btn-info dropdown-toggle border-0 shadow-0"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
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
                                        to="profile"
                                        class="dropdown-item"
                                        >Profile
                                    </router-link>
                                </li>
                                <li>
                                    <router-link
                                        to="generate-image"
                                        class="dropdown-item"
                                        >Generate Art
                                    </router-link>
                                </li>
                                <hr />
                                <li>
                                    <router-link
                                        to="return-policy"
                                        class="dropdown-item"
                                        >Return Policy
                                    </router-link>
                                </li>
                                <li>
                                    <hr />
                                    <button
                                        @click="logOut"
                                        class="dropdown-item"
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { useAuth0, type User } from "@auth0/auth0-vue";
import { watch } from "vue";
import { useUserStore } from "@/stores/user";

// DATA
const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
const userStore = useUserStore();

const login = () => {
    loginWithRedirect({ redirect_uri: window.location.href });
};

watch(
    () => user.value,
    async (newVal) => {
        console.log(newVal);

        if (newVal?.sub) {
            await userStore.getUser(newVal as User);
        }
    }
);

const logOut = () =>
    logout({ logoutParams: { returnTo: window.location.href } });
</script>
