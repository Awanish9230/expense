import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import User from '../models/User.js';

export const createExpense = async (data) => {
    if (!mongoose.Types.ObjectId.isValid(data.userId)) {
        const error = new Error('Invalid userId');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(data.userId);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return await Expense.create(data);
};

export const getExpenses = async (queryParams) => {
    let { page = 1, limit = 10, userId, category, fromDate, toDate } = queryParams;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        const error = new Error('Invalid pagination');
        error.statusCode = 400;
        throw error;
    }

    const filter = {};

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            const error = new Error('Invalid userId');
            error.statusCode = 400;
            throw error;
        }
        filter.userId = userId;
    }

    if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) {
            const from = new Date(fromDate);
            if (isNaN(from.getTime())) {
                const error = new Error('Invalid fromDate format');
                error.statusCode = 400;
                throw error;
            }
            filter.createdAt.$gte = from;
        }
        if (toDate) {
            const to = new Date(toDate);
            if (isNaN(to.getTime())) {
                const error = new Error('Invalid toDate format');
                error.statusCode = 400;
                throw error;
            }
            to.setHours(23, 59, 59, 999);
            filter.createdAt.$lte = to;
        }
    }

    const skip = (page - 1) * limit;
    const [expenses, total] = await Promise.all([
        Expense.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Expense.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        data: expenses,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
};

export const getExpenseById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Invalid expense ID');
        error.statusCode = 400;
        throw error;
    }

    const expense = await Expense.findById(id);
    if (!expense) {
        const error = new Error('Expense not found');
        error.statusCode = 404;
        throw error;
    }

    return expense;
};

export const updateExpense = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Invalid expense ID');
        error.statusCode = 400;
        throw error;
    }

    const expense = await Expense.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!expense) {
        const error = new Error('Expense not found');
        error.statusCode = 404;
        throw error;
    }

    return expense;
};

export const deleteExpense = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Invalid expense ID');
        error.statusCode = 400;
        throw error;
    }

    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
        const error = new Error('Expense not found');
        error.statusCode = 404;
        throw error;
    }

    return expense;
};

export const getExpenseSummary = async (queryParams) => {
    const { userId, fromDate, toDate, category } = queryParams;
    const filter = {};

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            const error = new Error('Invalid userId');
            error.statusCode = 400;
            throw error;
        }
        filter.userId = new mongoose.Types.ObjectId(userId);
    }

    if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) {
            const from = new Date(fromDate);
            if (isNaN(from.getTime())) {
                const error = new Error('Invalid fromDate format');
                error.statusCode = 400;
                throw error;
            }
            filter.createdAt.$gte = from;
        }
        if (toDate) {
            const to = new Date(toDate);
            if (isNaN(to.getTime())) {
                const error = new Error('Invalid toDate format');
                error.statusCode = 400;
                throw error;
            }
            to.setHours(23, 59, 59, 999);
            filter.createdAt.$lte = to;
        }
    }

    const summaryResult = await Expense.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
                totalCount: { $sum: 1 }
            }
        }
    ]);

    const categoryResult = await Expense.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                category: '$_id',
                totalAmount: 1,
                count: 1
            }
        },
        { $sort: { totalAmount: -1 } }
    ]);

    return {
        totalAmount: summaryResult[0]?.totalAmount || 0,
        totalCount: summaryResult[0]?.totalCount || 0,
        byCategory: categoryResult
    };
};
