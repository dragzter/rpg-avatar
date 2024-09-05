<template>
    <div class="pricing-area">
        <div class="container">
            <ProductTitle
                css-id="product-currency-title"
                titleHTML="Gen <span>Tokens</span>"
            />

            <div
                class="alert alert-warning alert-dismissible fade show"
                role="alert"
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
                <div
                    v-for="(product, index) in productsEnhanced"
                    class="col-md-4"
                    :key="`product-offer-${product.name + index}`"
                >
                    <div
                        class="pricing-item"
                        v-if="product?.metadata?.type === 'currency'"
                    >
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
                                        v-if="product.metadata?.limited_notice"
                                        class="fa-regular fa-circle-question"
                                    ></i>
                                    <template #content
                                        ><p class="m-0">
                                            {{
                                                product.metadata?.limited_notice
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
            </div>

            <hr />
            <ProductTitle
                css-id="product-currency-title"
                titleHTML="Content <span>Passes</span>"
                :wrapper-css-classes="['mt-5']"
            />
            <div id="product-passes" class="row">
                <div
                    v-for="(product, index) in productsEnhanced"
                    class="col-md-4"
                    :key="`product-offer-${product.name + index}`"
                >
                    <div
                        class="pricing-item"
                        v-if="product?.metadata?.type === 'passes'"
                    >
                        <h3 style="color: goldenrod">
                            {{ product.name }}

                            <span class="fs-6 text-white">
                                <Popper placement="top" :hover="true">
                                    <i
                                        v-if="product.metadata?.limited_notice"
                                        class="fa-regular fa-circle-question"
                                    ></i>
                                    <template #content
                                        ><p class="m-0">
                                            {{
                                                product.metadata?.limited_notice
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
                            <li>
                                <span style="color: goldenrod"
                                    ><i class="fa-solid fa-check"></i
                                ></span>
                                <p class="mb-0">
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
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import type { ProductEnhanced } from "@/stores/types";
import { useProductStore } from "@/stores/product";
import axios from "axios";
import { API } from "@/utils/product";
import ProductTitle from "@/components/global/ProductTitle.vue";

/**
 * DATA
 */
const productStore = useProductStore();

/**
 * COMPUTED
 */
const productsEnhanced = computed(
    () => productStore.productsEnhanced as ProductEnhanced[]
);

/**
 * LIFE-CYCLE
 */
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
</script>
