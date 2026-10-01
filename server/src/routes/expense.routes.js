import express from 'express';
import {
    createExpenseController,
    getExpensesController,
    getExpenseByIdController,
    updateExpenseController,
    deleteExpenseController,
    getExpenseSummaryController
} from '../controllers/expense.controller.js';
import validate from '../middleware/validate.middleware.js';
import { createExpenseSchema, updateExpenseSchema } from '../validations/expense.validation.js';

const router = express.Router();

router.post('/', validate(createExpenseSchema), createExpenseController);
router.get('/summary', getExpenseSummaryController);
router.get('/', getExpensesController);
router.get('/:id', getExpenseByIdController);
router.put('/:id', validate(updateExpenseSchema), updateExpenseController);
router.delete('/:id', deleteExpenseController);

export default router;
