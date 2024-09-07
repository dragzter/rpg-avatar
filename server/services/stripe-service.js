import dotenv from "dotenv"
import stripe from "stripe"

dotenv.config()


class StripeService {
    client

    constructor() {
        this.client = stripe(process.env.STRIPE_SECRET_LIVE_KEY)
    }

    async getProduct(productId) {
        try {
            return await this.client.products.retrieve(productId);
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getProducts() {
        try {
            return await this.client.products.list({limit: 10});
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getPrice(priceId) {
        try {
            return await this.client.prices.retrieve(priceId);
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getPrices() {
        try {
            return await this.client.prices.list();
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getCheckoutSession(lineItems) {
        const session = await this.client.checkout.sessions.create({
            success_url: "http://localhost:5173/get-tokens",
            cancel_url: "http://localhost:5173/get-tokens",
            line_items: lineItems,
            payment_method_types: ["card"],
            mode: "payment",
        });

        console.log(session)
        return session
    }
}

export default new StripeService()