import Income from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDataRange from "../utils/datafilter.js";

// Add income
export async function addIncome(req, res) {
    const userId = req.user._id || req.user.id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || amount === undefined || amount === null || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid date"
            });
        }

        const newIncome = new Income({
            description,
            amount: numericAmount,
            userId,
            category,
            date: parsedDate
        });

        await newIncome.save();

        res.status(201).json({
            success: true,
            message: "Income added successfully",
            income: newIncome
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// Get all income
export async function getAllIncome(req, res) {
    const userId = req.user._id || req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        res.json(income);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// Update income
export async function updateIncome(req, res) {
    const userId = req.user._id || req.user.id;
    const incomeId = req.params.id;

    const { description, amount, category, date } = req.body;

    try {
        if (!description || amount === undefined || amount === null || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid date"
            });
        }

        const updatedIncome = await Income.findOneAndUpdate(
            { _id: incomeId, userId },
            {
                description,
                amount: numericAmount,
                category,
                date: parsedDate
            },
            { returnDocument: 'after' }
        );

        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Income updated successfully",
            income: updatedIncome
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// Delete income
export async function deleteIncome(req, res) {
    const userId = req.user._id || req.user.id;

    try {
        const income = await Income.findOneAndDelete({
            _id: req.params.id,
            userId
        });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Income deleted successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// Download income data as Excel
export async function downloadIncomeData(req, res) {
    const userId = req.user._id || req.user.id;

    try {
        const incomeData = await Income.find({
            userId
        }).sort({ date: -1 });

        const plainData = incomeData.map(income => ({
            Description: income.description,
            Amount: income.amount,
            Category: income.category,
            Date: income.date ? income.date.toISOString().split("T")[0] : ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Income Data");

        const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="income_details.xlsx"'
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        return res.send(excelBuffer);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// Get income overview
export async function getIncomeOverview(req, res) {

    try {
        const userId = req.user._id || req.user.id;

        const { range = "monthly" } = req.query;

        const { start, end } = getDataRange(range);

        const income = await Income.find({
            userId,
            date: {
                $gte: start,
                $lte: end
            }
        }).sort({ date: -1 });

        const totalIncome = income.reduce(
            (acc, cur) => acc + cur.amount,
            0
        );

        const averageIncome =
            income.length > 0
                ? totalIncome / income.length
                : 0;

        const numberOfTransactions = income.length;

        const recentTransactions = income.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}