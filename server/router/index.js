import express from "express"
import dotenv from "dotenv"

import {router as stripeRouter} from "./stripe.js"
import {router as imageRouter} from "./image.js"
import {router as userRouter} from "./user.js"

dotenv.config()

const router = express.Router();

router.use(stripeRouter)
router.use(imageRouter)
router.use(userRouter)

export default router