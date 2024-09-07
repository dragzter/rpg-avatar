<template>
    <div class="pricing-area">
        <div class="container">
            <ProductTitle
                css-id="product-currency-title"
                size="h1"
                :show-logo="true"
                titleHTML="Tokens <span>&</span> Passes"
                sub-text=" <br><strong>NOTE</strong>: Token redemption and Pass purchases are final and non-refundable."
            />

            <ProductTitle
                wrapper-css-classes="mt-5 mb-5 pt-3"
                css-id="product-currency-title"
                size="h2"
                titleHTML="Gen <span>Tokens</span>"
                sub-text="Each token entitles you to one image prompt. Redeem your tokens one-for-one to bring your creative visions to life."
            />

            <!-- disclaimer-->
            <div
                v-if="showDisclaimer"
                class="alert alert-warning alert-dismissible mx-auto fade show"
                role="alert"
                style="max-width: 1030px"
            >
                <div class="d-flex align-items-start">
                    <i
                        style="font-size: 34px"
                        class="fa-regular fa-triangle-exclamation me-2"
                    ></i>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                    ></button>

                    <div class="ms-3">
                        <div>
                            <strong>Disclaimer:</strong> AI image generation is
                            an experimental technology. While we strive to
                            provide high-quality results, outcomes may vary
                            based on the nature of the input and other factors.
                            Please be aware that not all generated images will
                            meet specific expectations.
                        </div>
                        <div class="form-check mt-4">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                value="false"
                                id="flexCheckDefault"
                                @input="disclaimerSigned"
                            />
                            <label
                                class="form-check-label"
                                for="flexCheckDefault"
                            >
                                I UNDERSTAND
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div id="product-currency-items" class="row pb-5">
                <template v-for="(product, index) in productsEnhanced">
                    <div
                        class="product-card-item"
                        :key="`product-offer-${product.name + index}`"
                        v-if="product?.metadata?.type === 'currency'"
                    >
                        <div class="pricing-item">
                            <h5
                                class="product-alt-title"
                                v-if="product?.metadata?.alt_title"
                            >
                                {{ product.metadata?.alt_title }}
                            </h5>
                            <h3
                                v-if="product.metadata?.type === 'currency'"
                                class="text-muted d-flex justify-content-center py-2"
                            >
                                <span style="color: goldenrod"
                                    ><i class="fa-sharp fa-light fa-coins"></i
                                ></span>
                                <span>{{ product.metadata.subtitle }}</span>
                            </h3>

                            <h3 v-else style="color: goldenrod">
                                {{ product.name }}

                                <span class="fs-6">
                                    <Popper placement="top" :hover="true">
                                        <i
                                            v-if="
                                                product.metadata?.limited_notice
                                            "
                                            class="fa-regular fa-circle-question"
                                        ></i>
                                        <template #content
                                            ><p class="m-0">
                                                {{
                                                    product.metadata
                                                        ?.limited_notice
                                                }}
                                            </p>
                                        </template>
                                    </Popper>
                                </span>
                            </h3>
                            <hr />
                            <p class="fs-4">{{ product.description }}</p>

                            <h4>
                                <span>{{ product.price }}</span>
                            </h4>
                            <div class="pricing-button">
                                <button @click="buy(product)">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div class="text-center my-5">
                <img src="../assets/img/rpgavatarlogo.png" alt="logo" />
            </div>
            <ProductTitle
                css-id="product-currency-title"
                titleHTML="Content <span>Passes</span>"
                size="h2"
                sub-text="Spend your tokens on NSFW art."
                :wrapper-css-classes="['mt-5']"
            />
            <div id="product-passes" class="row">
                <template v-for="(product, index) in productsEnhanced">
                    <div
                        v-if="product?.metadata?.type === 'passes'"
                        class="product-card-item"
                        :key="`product-offer-${product.name + index}`"
                    >
                        <div class="pricing-item">
                            <h3 style="color: goldenrod">
                                {{ product.name }}

                                <span class="fs-6 text-white">
                                    <Popper placement="top" :hover="true">
                                        <i
                                            v-if="
                                                product.metadata?.limited_notice
                                            "
                                            class="fa-regular fa-circle-question"
                                        ></i>
                                        <template #content
                                            ><p class="m-0">
                                                {{
                                                    product.metadata
                                                        ?.limited_notice
                                                }}
                                            </p>
                                        </template>
                                    </Popper>
                                </span>
                            </h3>
                            <hr />
                            <p class="fs-4">{{ product.description }}</p>

                            <h4>
                                <span>{{ product.price }}</span>
                            </h4>
                            <div class="pricing-button">
                                <button @click="buy(product)">Buy Now</button>
                            </div>
                            <ul v-if="product.metadata?.type === 'passes'">
                                <li class="pb-0">
                                    <span style="color: goldenrod"
                                        ><i class="fa-solid fa-check"></i
                                    ></span>
                                    <p class="mb-0 pb-0">
                                        {{
                                            product.metadata.item
                                                ? product.metadata.item
                                                : product.name
                                        }}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import type { ProductEnhanced } from "@/stores/types";
import { useProductStore } from "@/stores/product";
import axios from "axios";
import { API } from "@/utils/";
import ProductTitle from "@/components/global/ProductTitle.vue";
import { useUserStore } from "@/stores/user";
import { useAuth0 } from "@auth0/auth0-vue";

/**
 * DATA
 */
const productStore = useProductStore();
const userStore = useUserStore();
const { isAuthenticated, loginWithPopup } = useAuth0();
const showDisclaimer = ref(false);

/**
 * COMPUTED
 */
const productsEnhanced = computed(
    () => productStore.productsEnhanced as ProductEnhanced[]
);
const rpgUser = computed(() => userStore.user);

/**
 * WATCHERS
 */
watch(
    () => rpgUser.value,
    (newUser) => {
        showDisclaimer.value = !newUser.disclaimer_signed;
    }
);

/**
 * LIFE-CYCLE
 */
onMounted(() => {
    if (rpgUser.value) {
        showDisclaimer.value = !rpgUser.value.disclaimer_signed;
    }
});

onBeforeMount(async () => {
    await Promise.all([productStore.getProducts(), productStore.getPrices()]);
});

/**
 * HANDLERS
 */
const buy = async (product: ProductEnhanced) => {
    const response = await axios.post(API.checkout, {
        data: [{ price: product.priceId, quantity: 1 }],
    });

    console.log(response.data);
    window.location.href = response.data.url;
};

const disclaimerSigned = async (e: Event) => {
    if ((e.target as HTMLInputElement).checked) {
        if (!isAuthenticated.value) {
            await loginWithPopup();
            await userStore.signPurchaseDisclaimer(rpgUser.value.id);
        } else {
            console.log("signing...");
            await userStore.signPurchaseDisclaimer(rpgUser.value.id);
        }
    }
};
</script>
