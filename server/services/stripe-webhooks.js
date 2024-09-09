import express from "express";
import StripeService from "./stripe-service.js";

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post("/", express.raw({type: "application/json"}), async (req, res) => await StripeService.stripeWebHook(req, res));

export default stripeWebhookRouter;