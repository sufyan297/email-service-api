/**
 * @class AppError
 * @extends Error
 * @description This is the base error class for the application.
 * All custom application errors should extend this class.
 * It provides a standard structure for error messages and HTTP status codes.
 */
export class AppError extends Error {
    /**
     * @property {number} status - The HTTP status code associated with the error.
     */
    status: number;

    /**
     * Creates an instance of AppError.
     * @param {string} message - A descriptive error message.
     * @param {number} status - The HTTP status code for the error.
     */
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

/**
 * @class BadRequestException
 * @extends AppError
 * @description Represents an HTTP 400 Bad Request error.
 * This exception should be thrown when the client sends an invalid request,
 * e.g., missing required parameters, invalid data format, etc.
 */
export class BadRequestException extends AppError {
    /**
     * Creates an instance of BadRequestException.
     * @param {string} message - A descriptive error message for the bad request.
     */
    constructor(message: string) {
        super(message, 400); // Sets the HTTP status code to 400
    }
}

/**
 * @class ResourceNotFoundException
 * @extends AppError
 * @description Represents an HTTP 404 Not Found error.
 * This exception should be thrown when a requested resource (e.g., a user, an item)
 * does not exist on the server.
 */
export class ResourceNotFoundException extends AppError {
    /**
     * Creates an instance of ResourceNotFoundException.
     * @param {string} message - A descriptive error message indicating the resource was not found.
     */
    constructor(message: string) {
        super(message, 404); // Sets the HTTP status code to 404
    }
}

/**
 * @class UnAuthorizedAccessException
 * @extends AppError
 * @description Represents an HTTP 401 Unauthorized error.
 * This exception should be thrown when a request lacks valid authentication credentials
 * for the target resource.
 */
export class UnAuthorizedAccessException extends AppError {
    /**
     * Creates an instance of UnAuthorizedAccessException.
     * @param {string} message - A descriptive error message for the unauthorized access attempt.
     */
    constructor(message: string) {
        super(message, 401); // Sets the HTTP status code to 401
    }
}
