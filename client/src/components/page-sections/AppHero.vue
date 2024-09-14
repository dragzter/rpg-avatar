<template>
    <section id="app-hero" class="waves-1_bg">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <div id="intro" class="m-auto my-5">
                        <h1 class="fw-bolder hero-title pe-md-5">
                            Effortlessly Create Unique RPG Avatars
                        </h1>
                        <p class="fs-5 my-4 pe-md-5">
                            Our AI-driven generator makes it easy to design
                            personalized RPG avatars. With just a few clicks,
                            bring your fantasy character to life in vivid
                            detail.
                        </p>
                        <div
                            class="d-flex justify-content-between justify-content-md-start"
                        >
                            <router-link
                                class="btn btn-lg me-3 fw-normal btn-primary"
                                to="generate-image"
                                >GET STARTED
                            </router-link>
                            <router-link
                                class="btn btn-lg fw-normal btn-info btn-special"
                                to="generate-image"
                                >LEARN MORE
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 text-center">
                    <div class="accent-frame hero-image-main">
                        <div>
                            <img
                                alt=""
                                class="img-fluid"
                                src="/assets/rogue-24-female.png"
                                style="border-radius: 10px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <SolutionsSection :content="SolutionContentItems" />
    <CtaSection />
</template>
<script setup>
import CtaSection from "@/components/page-sections/CtaSection.vue";
import SolutionsSection from "@/components/page-sections/SolutionsSection.vue";
import { SolutionContentItems } from "@/utils/content";
</script>
