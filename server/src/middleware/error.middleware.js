const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    if (err.code === 11000) {
        statusCode = 409;
        message = 'Email already exists';
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorHandler;
