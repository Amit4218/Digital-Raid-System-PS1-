import express from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.config.js";
import userRouter from "./routes/user.route.js";

config();

const PORT = process.env.PORT || 8080;
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});
