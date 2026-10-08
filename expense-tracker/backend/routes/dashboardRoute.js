import express from "express";
import { getDashboardData, getMonthlyTrend } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/auth.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/data", authMiddleware, getDashboardData);
dashboardRouter.get("/monthly-trend", authMiddleware, getMonthlyTrend);

export default dashboardRouter;
