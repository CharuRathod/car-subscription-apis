import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import connectDB from "./app/config/db.js";
import corsMiddleware from "./app/config/cors.js";
import routes from "./app/routes/index.js";
import { updateExpiredSubscriptions } from "./app/utils/expiredSubscription.js";

dotenv.config();

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
routes(app);

cron.schedule("*/2 * * * *", async () => {    
    await updateExpiredSubscriptions();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});