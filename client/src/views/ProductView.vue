<template>
    <div class="pricing-area">
        <div class="container">
            <ProductTitle
                :show-logo="true"
                css-id="product-currency-title"
                size="h1"
                sub-text=" <br><strong>NOTE</strong>: Token redemption and Pass purchases are final and non-refundable."
                titleHTML="Tokens <span>&</span> Passes"
            />

            <ProductTitle
                :wrapper-css-classes="['mt-3', 'mb-5', 'pt-3']"
                css-id="product-currency-title"
                size="h2"
                sub-text="Each token entitles you to one image prompt. Redeem your tokens one-for-one to bring your creative visions to life."
                titleHTML="Gen <span>Tokens</span>"
            />

            <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
                <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                    />
                </symbol>
                <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
                    />
                </symbol>
                <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                    />
                </symbol>
            </svg>

            <div
                style="max-width: 1030px; border: 3px solid var(--dark-500)"
                class="alert rounded-5 d-flex text-white bg-dark-600 align-items-start mx-auto mb-5"
                role="alert"
            >
                <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Info:">
                    <use xlink:href="#check-circle-fill" />
                </svg>
                <h4 class="mb-0">
                    Each user receives
                    <strong class="accent-text">free storage</strong> for up to
                    <strong class="accent-text">300</strong> of your generated images.
                </h4>
            </div>

            <!-- disclaimer-->
            <div
                v-if="showDisclaimer"
                class="alert alert-warning alert-dismissible mx-auto fade show"
                role="alert"
                style="max-width: 1030px"
            >
                <div class="d-flex align-items-start">
                    <i class="fa-regular fa-triangle-exclamation me-2" style="font-size: 34px"></i>
                    <button
                        aria-label="Close"
                        class="btn-close"
                        data-bs-dismiss="alert"
                        type="button"
                    ></button>

                    <div class="ms-3">
                        <div>
                            <strong>Disclaimer:</strong> AI image generation is an experimental technology.
                            While we strive to provide high-quality results, outcomes may vary based on the
                            nature of the input and other factors. Please be aware that not all generated
                            images will meet specific expectations.
                        </div>
                        <div class="form-check mt-4">
                            <input
                                id="flexCheckDefault"
                                class="form-check-input"
                                type="checkbox"
                                value="false"
                                @input="disclaimerSigned"
                            />
                            <label class="form-check-label" for="flexCheckDefault"> I UNDERSTAND </label>
                        </div>
                    </div>
                </div>
            </div>

            <div id="product-currency-items" class="row pb-5">
                <template v-for="(product, index) in productsEnhanced">
                    <div
                        v-if="product?.metadata?.type === 'currency'"
                        :key="`product-offer-${product.name + index}`"
                        class="product-card-item"
                    >
                        <div class="pricing-item">
                            <h5 v-if="product?.metadata?.alt_title" class="product-alt-title">
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
                                    <Popper :hover="true" placement="top">
                                        <i
                                            v-if="product.metadata?.limited_notice"
                                            class="fa-regular fa-circle-question"
                                        ></i>
                                        <template #content
                                            ><p class="m-0">
                                                {{ product.metadata?.limited_notice }}
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
                <img alt="logo" src="/assets/rpgavatarlogo.png" />
            </div>
            <ProductTitle
                :wrapper-css-classes="['mt-5']"
                css-id="product-currency-title"
                size="h2"
                sub-text="Take advantage of other types of content and services with passes."
                titleHTML="Content <span>Passes</span>"
            />

            <div id="product-passes" class="row">
                <template v-for="(product, index) in productsEnhanced">
                    <div
                        v-if="product?.metadata?.type === 'passes'"
                        :key="`product-offer-${product.name + index}`"
                        :class="{ 'client-purchased': rpgUser.nsfw_pass }"
                        class="product-card-item product-passes"
                    >
                        <div class="pricing-item">
                            <h3 style="color: goldenrod">
                                {{ product.name }}

                                <span class="fs-6 text-white">
                                    <Popper :hover="true" placement="top">
                                        <i
                                            v-if="product.metadata?.limited_notice"
                                            class="fa-regular fa-circle-question"
                                        ></i>
                                        <template #content
                                            ><p class="m-0">
                                                {{ product.metadata?.limited_notice }}
                                            </p>
                                        </template>
                                    </Popper>
                                </span>
                            </h3>
                            <hr />
                            <p class="fs-4 product-description">
                                {{ product.description }}
                            </p>

                            <h4>
                                <span>{{ product.price }}</span>
                            </h4>
                            <ul v-if="product.metadata?.type === 'passes'">
                                <li class="pb-0">
                                    <span style="color: goldenrod"><i class="fa-solid fa-check"></i></span>
                                    <p class="mb-0 pb-0">
                                        {{ product.metadata.item ? product.metadata.item : product.name }}
                                    </p>
                                </li>
                            </ul>
                            <div v-if="!rpgUser.nsfw_pass" class="pricing-button">
                                <button @click="buy(product)">Buy Now</button>
                            </div>
                            <span v-else class="badge w-100 fs-4 mt-2 text-bg-info">Purchased</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from "vue";
import type { ProductEnhanced } from "@/stores/types";
import { useProductStore } from "@/stores/product";
import ProductTitle from "@/components/global/ProductTitle.vue";
import { useUserStore } from "@/stores/user";
import { useAuth0 } from "@auth0/auth0-vue";
import { scrollToOffer } from "@/utils";

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
const productsEnhanced = computed(() => productStore.productsEnhanced as ProductEnhanced[]);
const rpgUser = computed(() => userStore.user);

/**
 * WATCHERS
 */
watch(
    () => rpgUser.value,
    (newUser) => {
        setTimeout(() => {
            showDisclaimer.value = !newUser.disclaimer_signed;
        }, 200);
    }
);

/**
 * LIFE-CYCLE
 */
onMounted(async () => {
    await nextTick();
    scrollToOffer("product-passes", "tab", "product_offer");
});

onBeforeMount(async () => {
    await Promise.all([productStore.getProducts(), productStore.getPrices()]);
});

/**
 * HANDLERS
 */
const buy = async (product: ProductEnhanced) => {
    if (!rpgUser.value) {
        await loginWithPopup();
    }

    await productStore.beginCheckoutSession({
        user_id: rpgUser.value.id,
        product_id: product.id,
        line_items: [{ price: product.priceId, quantity: 1 }],
    });
};

const disclaimerSigned = async (e: Event) => {
    if ((e.target as HTMLInputElement).checked) {
        if (!isAuthenticated.value) {
            await loginWithPopup();
            await userStore.signPurchaseDisclaimer(rpgUser.value.id);
        } else {
            await userStore.signPurchaseDisclaimer(rpgUser.value.id);
        }
    }
};
</script>