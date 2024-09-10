import stripe from "stripe"
import "../config.js"
import checkoutSessionManager from "./checkout-session-manager.js";
import CodeRedemptionService from "./code-redemption-service.js";


class StripeService {
    client

    constructor() {
        this.client = stripe(process.env.STRIPE_SECRET_KEY)
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

    async getCheckoutSession({user_id, line_items, product_id}) {
        const session = await this.client.checkout.sessions.create({
            success_url: process.env.STRIPE_CHECKOUT_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CHECKOUT_CANCEL_URL,
            line_items: line_items,
            payment_method_types: ["card"],
            mode: "payment",
        });

        checkoutSessionManager.createSession({
            session_id: session.id,
            product_id,
            user_id
        })

        return session
    }

    async stripeWebHook(req, res) {
        const sig = req.headers["stripe-signature"];
        let event;

        try {
            event = this.client.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;

                const {user_id} = checkoutSessionManager.getSession(session.id);
                const lineItems = await this.client.checkout.sessions.listLineItems(session.id);
                const productsPurchased = await Promise.all(
                    lineItems.data
                        .filter(item => item.price?.product)
                        .map(item => this.getProduct(item.price.product))
                );

                if (productsPurchased?.length) {
                    const responses = [];
                    for (const product of productsPurchased) {
                        if (!product?.metadata) continue;

                        const product_types = {
                            currency: async () => {
                                return await CodeRedemptionService.assignPurchasedTokensToUser(user_id, parseInt(product.metadata.token_award));
                            },
                            passes: async () => {
                                const passes_list = {
                                    NSFW: async () => await CodeRedemptionService.grantNSFWAccess(user_id),
                                    FaceCrunch: () => ({}) // Todo: Implement FaceCrunch
                                };
                                return await passes_list[product.metadata.pass_id]();
                            }
                        };

                        if (product_types[product.metadata.type]) {
                            const response = await product_types[product.metadata.type]();
                            responses.push(response);
                        } else {
                            console.log(`Unhandled product type: ${product.metadata.type}`);
                        }
                    }
                    return res.status(200).send(responses);
                }

                break;
            case "payment_intent.succeeded":
                const paymentIntentSucceeded = event.data.object;
                console.log("Payment intent succeeded", paymentIntentSucceeded);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).send({received: true});
    }
}

export default new StripeService()