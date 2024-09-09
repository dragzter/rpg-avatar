import dotenv from "dotenv";

if (process.env.NODE_ENV === 'development') {
    dotenv.config({path: '.env.development'});
} else {
    dotenv.config(); // Default to .env for production
}