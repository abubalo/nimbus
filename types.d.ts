import * as http from "https";

/**
 * Represents the options for making HTTP requests.
 */
export interface RequestOptions<T> extends http.RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; // Allowed HTTP methods
  headers?: Record<string, string>; // Headers for the HTTP request
  queryParameters?: Record<string, string>; // Query parameters for the request
  body?: T; // Request body data
  responseType?: "json" | "text" | "xml"; // Expected response format
  contentType?:
    | "application/json"
    | "application/xml"
    | "text/plain"
    | "multipart/form-data"; // Content type for the request
  timeout?: number; // Timeout in milliseconds for the request
  onProgress?: (progress: number) => void; // Progress tracking callback
  interceptors?: {
    request?: (
      options: RequestOptions<T>
    ) => RequestOptions<T> | Promise<RequestOptions<T>>; // Request interceptor
    response?: (
      response: HttpResponse<T>
    ) => HttpResponse<T> | Promise<HttpResponse<T>>; // Response interceptor
  };
}

/**
 * Represents the structure of an HTTP response.
 */
export interface HttpResponse<T> {
  data: T; // Actual HTTP response data
  status?: number; // The HTTP status code of the response
  statusMessage?: string; // The HTTP statusMessage corresponding to the status
  headers: Record<string, any>; // An object containing the response headers sent by the server
}

/**
 * Represents an object containing configuration keys and values.
 */
export interface Config<T> {
  baseURL: string; // Base URL for the requests
  withCredential?: boolean; // Boolean indicating whether to include credentials in the request
  headers?: Record<string, unknown>; // Headers for the requests
  transformRequest?: (value: T) => T; // Transformation function for the request data
  transformResponse?: (value: T) => T; // Transformation function for the response data
  validateStatus: number; // HTTP status code for which the request should be considered successful
  timeout?: (status: number) => boolean; // Timeout in milliseconds for the requests
  responseType?: string;
}
