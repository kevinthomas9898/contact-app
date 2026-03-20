exports.constants = {
    SUCCESS: 200,              // OK
    CREATED: 201,              // Resource created
    NO_CONTENT: 204,           // Success but no response body

    VALIDATION_ERROR: 400,          // Validation error / bad input
    UNAUTHORIZED: 401,         // Auth required / invalid token
    FORBIDDEN: 403,            // Access denied
    NOT_FOUND: 404,            // Resource not found

    CONFLICT: 409,             // Duplicate / conflict
    INTERNAL_SERVER_ERROR: 500 // Server error
};