import expenseModel from "../models/expenseModel.js";
import getDataRange from "../utils/datafilter.js";
import XLSX from "xlsx";

// Add expense
export async function addExpense(req, res) {
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

        const newExpense = new expenseModel({
            description,
            amount: numericAmount,
            category,
            date: parsedDate,
            userId
        });
        await newExpense.save();
        res.status(200).json({
            success: true,
            message: "Expense added successfully",
            data: newExpense
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding expense"
        });
    } 
  }

  //to get all expenses
  export async function getAllExpenses(req, res) {
    const userId = req.user._id || req.user.id;
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching expenses"
        });
    }
  }

  // to upadate an expense
  export async function updateExpense(req, res) {
    const expenseId = req.params.id;
    const userId = req.user._id || req.user.id;
    const { description, amount, category, date } = req.body;

    try {
        const expense = await expenseModel.findOne({ _id: expenseId, userId });
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        if (description !== undefined) {
            if (!description) {
                return res.status(400).json({ success: false, message: "Description cannot be empty" });
            }
            expense.description = description;
        }

        if (amount !== undefined) {
            const numericAmount = Number(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                return res.status(400).json({ success: false, message: "Amount must be a positive number" });
            }
            expense.amount = numericAmount;
        }

        if (category !== undefined) {
            if (!category) {
                return res.status(400).json({ success: false, message: "Category cannot be empty" });
            }
            expense.category = category;
        }

        if (date !== undefined) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ success: false, message: "Please provide a valid date" });
            }
            expense.date = parsedDate;
        }

        await expense.save();
        res.json({
            success: true,
            message: "Expense updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating expense"
        });
    }
  }

    // to delete an expense
    export async function deleteExpense(req, res) {
        const expenseId = req.params.id;
        const userId = req.user._id || req.user.id;

        try {
            const expense = await expenseModel.findOneAndDelete({ _id: expenseId, userId });
            if (!expense) {
                return res.status(404).json({
                    success: false,
                    message: "Expense not found"
                });
            }
            res.json({
                success: true,
                message: "Expense deleted successfully"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error deleting expense"
            });
        }
    }

    //download excel expenses
    export async function downloadExcelExpenses(req, res) {
       const userId = req.user._id || req.user.id;

    try {
        const expenseData = await expenseModel.find({
            userId
        }).sort({ date: -1 });

        const plainData = expenseData.map(expense => ({
            Description: expense.description,
            Amount: expense.amount,
            Category: expense.category,
            Date: expense.date ? expense.date.toISOString().split("T")[0] : ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Data");

        const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="expense_details.xlsx"'
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

//to get overview of expenses
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id || req.user.id;

        const { range = "monthly" } = req.query;

        const { start, end } = getDataRange(range);

        const expense = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });

        const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense =
            expense.length > 0 ? totalExpense / expense.length : 0;
        const numberOfTransactions = expense.length;
        const recentTransactions = expense.slice(0, 5);

        res.json({
            success: true,
            date: {
                totalExpense,
                averageExpense,
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