import express from "express"
import cors from "cors"
import router from "./router/index.js";
import db from "./db/index.js"
import stripeWebhookRouter from "./services/stripe-webhooks.js";

const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors());
app.set('trust proxy', 1);

// Stripe webhook, this is using the raw body parser to validate the stripe signature
// It must be done before using the express.json() middleware 🐣
app.use("/stripe-payment-events", stripeWebhookRouter);

app.use(express.json())
app.use("/", router);

db.once("open", async () => {
    console.log("Connected to Database.");

    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
});
