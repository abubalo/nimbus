export class NimbusError<T> extends Error {
  name: string;
  status: number | undefined;
  response: T | undefined;
  constructor(message: string, status?: number, response?: T) {
    super(message);
    
    this.name = "NimbusError";

    this.status = status; // HTTP status code
    this.response = response; // Response data or any other relevant information

    // Ensure the stack trace is captured
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NimbusError);
    }
  }
}

