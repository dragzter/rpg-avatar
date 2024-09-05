import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@rpgavatardev.rcppy.mongodb.net/?retryWrites=true&w=majority&appName=RPGAvatarDev`;

// Establish connection
mongoose
    .connect(uri, {
        dbName: "rpgavatarDB",
        serverSelectionTimeoutMS: 5000,
    })
    .catch((err) => console.log(err));

// Hold connection

export default mongoose.connection