export function sendError(error, callback) {
    let errorBody = {
        errorMessage: error.message,
        errorType: error.code,
        stackTrace: error.stack,
    };
    console.log(errorBody);
    callback(null, {
        statusCode: 500,
        body: JSON.stringify(errorBody),
    });
}
