import * as http from "https";

/**
 * Respresent the option for making HTTP requests
 */
export interface RequestOptions extends http.RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; // Allowed HTTP methods
  headers?: Record<string, string>;
  queryParameters?: Record<string, string>;
  body?: unknown;
  responseType?: "json" | "text" | "xml"; // Specify expected response format
  timeout?: number; // Timeout in milliseconds
  onProgress?: (progress: number) => void; // Progress tracking callback
  interceptors?: {
    request?: (
      options: RequestOptions
    ) => RequestOptions | Promise<RequestOptions>;
    response?: (
      response: HttpResponse<any>
    ) => HttpResponse<any> | Promise<HttpResponse<any>>;
  };
}


/**
 * Represents Structure of HTTP response
 */
export interface HttpResponse<T> {
  data: T;
  status: number;
  headers?: Record<string, any>
}

/**
 * Represents object takes configurarion keys and values
 */
export interface Config {
  baseURL: string;
  withCrendential?: boolean;
  headers?: Record<string, unknown>;
  transformRequest?: () => void;
  transformResponse?: () => void;
  timeout?: number;
  validateStatus: number;
}

export interface WindowObject extends Window {
  nimbus: {
    get<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    post<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    put<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    patch<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    delete<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>>;
  };
}
