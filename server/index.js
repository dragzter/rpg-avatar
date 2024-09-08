import express from "express"
import cors from "cors"
import router from "./router/index.js";
import db from "./db/index.js"


const app = express()
const port = 3000;

app.use(cors());
app.use(express.json());

db.once("open", () => {
    console.log("Connected to Database.");
    app.use("/", router);

    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
});