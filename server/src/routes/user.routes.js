import express from 'express';
import { createUserController } from '../controllers/user.controller.js';
import validate from '../middleware/validate.middleware.js';
import { createUserSchema } from '../validations/user.validation.js';

const router = express.Router();

router.post('/', validate(createUserSchema), createUserController);

export default router;