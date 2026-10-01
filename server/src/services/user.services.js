import User from '../models/User.js';

export const createUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        const error = new Error('Email already exists');
        error.statusCode = 409;
        throw error;
    }

    return await User.create(userData);
};

export const getUserById = async (id) => {
    return await User.findById(id);
};