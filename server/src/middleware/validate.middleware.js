const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const firstError = result.error.issues?.[0]?.message || 'Validation failed';
            return res.status(400).json({
                success: false,
                message: firstError
            });
        }

        req.body = result.data;
        next();
    };
};

export default validate;