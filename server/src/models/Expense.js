import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;