export default class CustomError {
  static createError({ name = 'error', cause, message, code }) {
    const error = new Error(message);
    error.name = name;
    error.code = code;
    error.cause = cause;  // Attach the cause property directly

    throw error;
  }
}
