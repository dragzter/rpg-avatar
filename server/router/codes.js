import express from "express"
import CodeService from "../services/code-service.js";

const router = express.Router();

router.post("/api/codes", async (req, res) => {
    try {

        const _cs = new CodeService()
        const response = await _cs.addCodes(req.body);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post("/api/redeem-v2", async (req, res) => {
    try {
        const _cs = new CodeService()
        console.log(req.body, "req.body redeem")

        const response = await _cs.redeemCode(req.body);

        console.log(response, "response")

        res.status(200).json(response);
    } catch (error) {
        console.log(error, "error 500")
        res.status(500).json(error);
    }
})

router.get("/api/codes/token", async (req, res) => {
    try {
        const {type} = req.params;
        const _cs = new CodeService()

        const codes = await _cs.getTokenCodes();
        res.status(200).json({
            success: true,
            message: "Codes successfully retrieved.",
            codes
        });
    } catch (error) {
        res.status(500).json(error);
    }
})

export {router};