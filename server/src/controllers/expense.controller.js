import * as expenseService from '../services/expense.services.js';

export const createExpenseController = async (req, res, next) => {
    try {
        const expense = await expenseService.createExpense(req.body);
        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

export const getExpensesController = async (req, res, next) => {
    try {
        const result = await expenseService.getExpenses(req.query);
        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

export const getExpenseByIdController = async (req, res, next) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id);
        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

export const updateExpenseController = async (req, res, next) => {
    try {
        const expense = await expenseService.updateExpense(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

export const deleteExpenseController = async (req, res, next) => {
    try {
        await expenseService.deleteExpense(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getExpenseSummaryController = async (req, res, next) => {
    try {
        const summary = await expenseService.getExpenseSummary(req.query);
        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};
