import express from "express";
import cors from "cors";
import 'dotenv/config.js';
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import incomeRouter from "./routes/incomeRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js"; // Import the dashboard route

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB
connectDB();

//Routes
app.use("/api/users", userRouter);
app.use("/api/income",incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter); // Import and use the dashboard route


app.get("/", (req, res) => {
  res.send("API working");
})

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
})