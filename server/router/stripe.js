import express from "express"
import StripeService from "../services/stripe-service.js";

const router = express.Router();


router.post("/api/create-checkout-session", (req, res) => {
    res.send("Checkout session started")
})

router.get("/api/products", async (req, res) => {
    try {
        const products = await StripeService.getProducts()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

router.get("/api/product/:productId", async (req, res) => {
    try {
        const product = await StripeService.getProduct(res.body?.productId || "")
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

router.get("/api/price/:priceId", async (req, res) => {
    try {
        const product = await StripeService.getPrice(res.body?.priceId || "")
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

router.get("/api/prices", async (req, res) => {
    try {
        const prices = await StripeService.getPrices()
        res.json(prices)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

router.post("/api/checkout", async (req, res) => {
    console.log(req.body)
    try {
        const sessionURL = await StripeService.getCheckoutSession(req.body.data)
        res.status(200).json(sessionURL)
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})

export {router}