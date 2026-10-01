import { createUser } from '../services/user.services.js';

export const createUserController = async (req, res, next) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
