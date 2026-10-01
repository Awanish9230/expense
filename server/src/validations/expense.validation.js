import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdValidator = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid userId'
});

export const createExpenseSchema = z.object({
    userId: objectIdValidator,
    title: z.string().trim().min(1, 'title is required'),
    amount: z.number({ invalid_type_error: 'amount must be a number' }).gt(0, 'amount must be greater than 0'),
    category: z.string().trim().min(1, 'category is required'),
    description: z.string().trim().optional()
});

export const updateExpenseSchema = z.object({
    title: z.string().trim().min(1, 'title cannot be empty').optional(),
    amount: z.number({ invalid_type_error: 'amount must be a number' }).gt(0, 'amount must be greater than 0').optional(),
    category: z.string().trim().min(1, 'category cannot be empty').optional(),
    description: z.string().trim().optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update'
});