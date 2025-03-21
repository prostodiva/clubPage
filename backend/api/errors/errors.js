class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

class BadRequestError extends AppError {
    constructor(message = "Missing required parameters or does not match the constraints.") {
        super(message, 400);
    }
}

class DuplicateUserError extends AppError {
    constructor(message = "User with these credentials already exists") {
        super(message, 409);
    }
}

class PasswordValidationError extends AppError {
    constructor(message = "Passwords do not match") {
        super(message, 400);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Not found") {
        super(message, 404);
    }

}



module.exports = {
    BadRequestError,
    DuplicateUserError,
    PasswordValidationError,
    NotFoundError
}