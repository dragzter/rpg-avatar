<template>
    <main>
        <AppHero />
    </main>
</template>

<script lang="ts" setup>
import AppHero from "@/components/page-sections/AppHero.vue";
import { onMounted } from "vue";

onMounted(async () => {
    //const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_TEST_PK);
    // const stripe = await loadStripe(import.meta.env.VITE_APP_STRIPE_TEST_PK);
    //
    // const elements = stripe.elements({
    //     mode: "payment",
    //     currency: "usd",
    //     amount: 1099,
    //     clientSecret: import.meta.env.VITE_APP_SECRET_TEST_KEY,
    // });
    //
    // const paymentElement = elements.create("payment");
    //
    // console.log(paymentElement)
    //   async function createPaymentIntent() {
    //     const stripe = await stripePromise;
    //
    //     // Define your payment request object
    //     const paymentRequest = {
    //       payment_method_types: ['card'],
    //       amount: 1000, // Amount in cents (e.g., $10.00)
    //       currency: 'usd',
    //     };
    //
    //     // Your server would create the payment intent
    //     const paymentIntent = await fetch('/create-payment-intent', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(paymentRequest),
    //     });
    //
    //     const {client_secret} = await paymentIntent.json();
    //
    //     // Confirm card payment
    //     const {
    //       error,
    //       paymentIntent: confirmedPaymentIntent
    //     } = await stripe.confirmCardPayment(client_secret, {
    //       payment_method: {
    //         card: cardElement, // Assuming you've created an Element called cardElement
    //         billing_details: {
    //           name: 'Customer Name',
    //         },
    //       },
    //     });
    //
    //     if (error) {
    //       console.error('Payment error:', error);
    //     } else {
    //       console.log('Payment successful:', confirmedPaymentIntent);
    //     }
    //   }
    //
    // // Call the function to handle payment
    //   createPaymentIntent();
});

// async function getImage() {
//   await axios.post("http://localhost:3000/api/image", {imageOptions: {model: "dalle-3"}})
// }
</script>
