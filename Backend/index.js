import express from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.config.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import publicRoutes from "./routes/pubic.route.js";
import depatrmentRoutes from "./routes/department.route.js"

config();

const PORT = process.env.PORT || 8080;
const app = express();

connectDB();

app.use(
  "/uploads",
  express.static(path.join(new URL(".", import.meta.url).pathname, "uploads"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1/user", userRouter);

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/department", depatrmentRoutes);


app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});
