import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().trim().min(1, 'name is required'),
    email: z.string().trim().email('email must be valid')
});