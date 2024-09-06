import { defineStore } from "pinia";
import type { Price, Product } from "@/stores/types";
import { API, getCurrencyLabel } from "@/utils/";
import axios from "axios";

export const useProductStore = defineStore("product", {
    state: () => ({
        products: [] as Product[],
        prices: { data: [] as Price[] },
        generatedImageUrl: "",
    }),
    actions: {
        async getProducts() {
            try {
                const response = await axios.get(API.products);

                this.products = response.data?.data?.reverse();
            } catch (err) {
                console.log(err);
            }
        },
        async getPrices() {
            try {
                const response = await axios.get(API.prices);
                this.prices = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        async getProductById(productId: string) {
            try {
                const response = await axios.get(
                    `${API.productById}/${productId}`
                );

                this.products = response.data;
            } catch (err) {
                console.log(err);
            }
        },
    },
    getters: {
        productsEnhanced: (state) => {
            return (
                state.products?.map((p) => {
                    const priceId = p.default_price;

                    const price = state.prices?.data?.find(
                        (price) => price.id === priceId
                    );

                    if (price) {
                        return {
                            id: p.id,
                            name: p.name,
                            price: getCurrencyLabel(price.unit_amount),
                            priceId,
                            description: p.description,
                            images: p.images,
                            active: p.active,
                            metadata: p.metadata,
                        };
                    }

                    return {};
                }) || []
            );
        },
    },
});
