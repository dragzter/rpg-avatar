<template>
    <!-- Mobile Menu Modal-->
    <div
        class="modal fade mobile-menu-component waves-1_bg"
        id="mobile-menu"
        tabindex="1"
        aria-labelledby="mobile-menu-label"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content position-relative waves-3_bg">
                <div class="modal-header">
                    <div class="mobile-menu-logo">
                        <router-link to="/">
                            <img
                                id="logo-mobile"
                                alt="RPG Avatar"
                                class="img-fluid me-2"
                                src="/assets/rpgavatarlogo.png"
                            />
                            <code>rpgavatar.com</code>
                        </router-link>
                    </div>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    <div class="link-wrapper-mobile-menu">
                        <div id="nav-column-mobile" class="d-flex flex-column">
                            <router-link
                                aria-current="page"
                                class="nav-link"
                                to="/"
                                >HOME
                            </router-link>
                            <router-link class="nav-link" to="get-tokens"
                                >BUY
                            </router-link>

                            <router-link class="nav-link" to="community-gallery"
                                >GALLERY
                            </router-link>
                            <router-link
                                class="btn btn-primary"
                                to="generate-image"
                                >GENERATE
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
