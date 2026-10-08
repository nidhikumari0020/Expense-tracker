import incomeModel from "../models/incomeModel.js";
import expenseModel from "../models/expenseModel.js";

// Get dashboard data
export async function getDashboardData(req, res) {
    const userId = req.user._id || req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    try {
        const totalIncome = await incomeModel.aggregate([
            { $match: { userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpenses = await expenseModel.aggregate([
            { $match: { userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const monthlyIncome = totalIncome[0]?.total || 0;
        const monthlyExpense = totalExpenses[0]?.total || 0;
        const savings = monthlyIncome - monthlyExpense;
        const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

        // Fetch recent income and expense documents
        const recentIncomes = await incomeModel.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ date: -1, createdAt: -1 }).limit(8).lean();

        const recentExpenses = await expenseModel.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ date: -1, createdAt: -1 }).limit(8).lean();

        const recentTransactions = [
            ...recentIncomes.map(item => ({ ...item, type: "income" })),
            ...recentExpenses.map(item => ({ ...item, type: "expense" }))
        ]
        .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
        .slice(0, 8);

        // Aggregate expense by category
        const categoryExpenses = await expenseModel.aggregate([
            { $match: { userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: "$category", amount: { $sum: "$amount" } } },
            { $sort: { amount: -1 } }
        ]);

        const expenseDistribution = categoryExpenses.map(item => ({
            category: item._id || "Other",
            amount: item.amount,
            percent: monthlyExpense === 0 ? 0 : Math.round((item.amount / monthlyExpense) * 100)
        }));

        return res.status(200).json({
            success: true,
            data: {
                monthlyIncome,
                monthlyExpense,
                savings,
                savingsRate,
                recentTransactions,
                expenseDistribution
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard data"
        });
    }
}

// Monthly income vs expense trend for the last N months (default 6, max 12)
export async function getMonthlyTrend(req, res) {
    const userId = req.user._id || req.user.id;
    const months = Math.min(Math.max(parseInt(req.query.months, 10) || 6, 1), 12);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const groupByMonth = (model) => model.aggregate([
        { $match: { userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: { y: { $year: "$date" }, m: { $month: "$date" } }, total: { $sum: "$amount" } } }
    ]);

    try {
        const [incomeRows, expenseRows] = await Promise.all([
            groupByMonth(incomeModel),
            groupByMonth(expenseModel)
        ]);

        const key = (y, m) => `${y}-${m}`;
        const incomeMap = new Map(incomeRows.map(r => [key(r._id.y, r._id.m), r.total]));
        const expenseMap = new Map(expenseRows.map(r => [key(r._id.y, r._id.m), r.total]));

        const trend = [];
        for (let i = 0; i < months; i++) {
            const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
            const k = key(d.getFullYear(), d.getMonth() + 1);
            trend.push({
                month: d.toLocaleString("en-US", { month: "short" }),
                year: d.getFullYear(),
                income: incomeMap.get(k) || 0,
                expense: expenseMap.get(k) || 0
            });
        }

        return res.status(200).json({ success: true, data: trend });
    } catch (error) {
        console.error("Error fetching monthly trend:", error);
        res.status(500).json({ success: false, message: "Error fetching monthly trend" });
    }
}
