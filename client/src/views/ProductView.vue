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
          :wrapper-css-classes="['mt-5', 'mb-5', 'pt-3']"
          css-id="product-currency-title"
          size="h2"
          sub-text="Each token entitles you to one image prompt. Redeem your tokens one-for-one to bring your creative visions to life."
          titleHTML="Gen <span>Tokens</span>"
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
              class="fa-regular fa-triangle-exclamation me-2"
              style="font-size: 34px"
          ></i>
          <button
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="alert"
              type="button"
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
                  id="flexCheckDefault"
                  class="form-check-input"
                  type="checkbox"
                  value="false"
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
              v-if="product?.metadata?.type === 'currency'"
              :key="`product-offer-${product.name + index}`"
              class="product-card-item"
          >
            <div class="pricing-item">
              <h5
                  v-if="product?.metadata?.alt_title"
                  class="product-alt-title"
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
                                    <Popper :hover="true" placement="top">
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
              <hr/>
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
        <img alt="logo" src="/public/img/rpgavatarlogo.png"/>
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
              :class="{'client-purchased': rpgUser.nsfw_pass}"
              class="product-card-item product-passes"
          >
            <div class="pricing-item">

              <h3 style="color: goldenrod">
                {{ product.name }}

                <span class="fs-6 text-white">
                    <Popper :hover="true" placement="top">
                        <i
                            v-if="
                                product.metadata?.limited_notice
                            "
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
              <hr/>
              <p class="fs-4 product-description">{{ product.description }}</p>

              <h4>
                <span>{{ product.price }}</span>
              </h4>
              <div v-if="!rpgUser.nsfw_pass" class="pricing-button">
                <button @click="buy(product)">Buy Now</button>
              </div>
              <span v-else class="badge w-100 fs-4 mt-2 text-bg-info ">Purchased</span>

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
<script lang="ts" setup>
import {computed, onBeforeMount, onMounted, ref, watch} from "vue";
import type {ProductEnhanced} from "@/stores/types";
import {useProductStore} from "@/stores/product";
import ProductTitle from "@/components/global/ProductTitle.vue";
import {useUserStore} from "@/stores/user";
import {useAuth0} from "@auth0/auth0-vue";

/**
 * DATA
 */
const productStore = useProductStore();
const userStore = useUserStore();
const {isAuthenticated, loginWithPopup} = useAuth0();
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
  if (!rpgUser.value) {
    await loginWithPopup();
  }

  await productStore.beginCheckoutSession({
    user_id: rpgUser.value.id,
    product_id: product.id,
    line_items: [{price: product.priceId, quantity: 1}]
  });
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
