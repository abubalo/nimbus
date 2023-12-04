import * as http from "http";
import * as https from "https";
import { NimbusError } from "./NimbusError";
import { Config, HttpResponse, RequestOptions } from "../types";

/**
 * An HTTP class for making requests.
 */
export default class HttpClient {
  private baseUrl: string | undefined;
  private static instance: HttpClient | null;
  /**
   * constructs an instance of HttpClient.
   * @params baseUrl Optional base URL for request.
   */
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }
  /**
   * Returns a singleton instance of HttpClient.
   * @returns An instance HttpClient
   */
  public static getInstance(): HttpClient {
    if (!this.instance) {
      this.instance = new HttpClient();
    }

    return this.instance;
  }

  /**
   * Validates the provided URL
   * @param url The URL to validate
   * @returns A boolean indicating URL validity
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url); //Tries to create a URL object from the provided URL
      return true; // Returns true if succussfull
    } catch (error) {
      return false; // Returns false if URL is invalid
    }
  }

  /**
   *  Creates an Instance of HttpClient with configuration settings.
   * @param config Configuration settings for the HttpClient.
   * @returns An instance of HttpClient with the provided configuration.
   */
  public static create<T>(config: Config<T>): HttpClient {
    const {
      baseURL,
      withCredential,
      headers,
      transformRequest,
      transformResponse,
      timeout,
      validateStatus,
    } = config;

    const instance = new HttpClient(baseURL);

    // Todo: Implement logic for each config
    if (headers) {
      // ... handle headers
    }
    if (withCredential) {
      // ... handle credentials
    }

    return instance;
  }

  /**
   * Sends HTTP request to specified URL with specified options.
   * @param url The URL to send the request to.
   * @param options Options for request.
   * @returns A Promise resolving to HTTP response.
   */
  private async sendRequest<T>(
    url: string,
    options: RequestOptions<T>
  ): Promise<HttpResponse<T>> {
    if (!this.isValidUrl(url)) {
      //If the URL is invalid, reject the Promise with an error
      return Promise.reject(new NimbusError("Invalid URL provided"));
    }

    const protocol = url.startsWith("https:") ? https : http;

    return new Promise<HttpResponse<T>>(async (resolve, reject) => {
      try {
        const request = protocol.request(url, options, (res) => {
          let data = "";
          if (options.responseType === "text") {
            data = "";
          }

          res.on("data", (chunk) => {
            data += chunk;
            if (options.onProgress && res.headers["content-length"]) {
              const contentLength = parseInt(res.headers["content-length"], 10);
              const progress = contentLength
                ? (data.length / contentLength) * 100
                : 0;
              options.onProgress(progress);
            }
          });

          res.on("end", async () => {
            if (
              res.statusCode &&
              res.statusCode >= 200 &&
              res.statusCode < 300
            ) {
              const response: HttpResponse<T> = {
                data: await this.parseResponseBody<T>(
                  data,
                  options.contentType || "json"
                ),
                status: res.statusCode,
                statusMessage: res.statusMessage,
                headers: res.headers,
              };
              resolve(response);
            } else {
              this.handleHttpError<T>(res);
            }
          });
        });

        if (options.body) {
          request.write(JSON.stringify(options.body));
        }

        if (options.timeout) {
          const timeoutId = setTimeout(() => {
            request!.destroy();
            reject(new NimbusError("Request timed out"));
          }, options.timeout);

          request.on("error", () => {
            clearTimeout(timeoutId);
          });
        }

        request.on("error", (error: any) => {
          reject(new NimbusError(`Request Error: ${error.message}`));
        });

        request.end();
      } catch (error: any) {
        reject(new NimbusError(`Request Error: ${error.message}`));
      }
    });
  }
/**
 * Builds a complete URL based on the base URL and path.
 * @param path Path to be appended to the URL.
 * @param queryParameters Optional query parameters.
 * @returns The complete URL.
 */
  private buildUrl(
    path: string,
    queryParameters?: Record<string, string>
  ): string {
    let url = this.baseUrl || "";
    if (url && !url.endsWith("/")) {
      url += "/";
    }
    url += path;

    if (queryParameters) {
      const queryParams = new URLSearchParam(Object.entries(queryParameters))
      url += `?${queryParams.toString()}`;
    }

    return url;
  }
/**
 * Builds Request option for HTTP request.
 * @param method The HTTP method request for request.
 * @param options Optionas for request.
 * @returns Request for making an HTTP request.
 */
  private buildRequestOptions<T>(
    method: string,
    options: RequestOptions<T>
  ): http.RequestOptions {
    const requestOptions: http.RequestOptions = {
      method,
      headers: options.headers || {}, // Use empty object if options.headers is undefined
    };

    if (options.body) {
      requestOptions.headers!["Content-Type"] =
        options.contentType || "application/json";
    }

    return requestOptions;
  }

  // Add properties for request and response interceptors
  private requestInterceptor:
    | ((options: RequestOptions<any>) => Promise<RequestOptions<any>>)
    | null = null;
  private responseInterceptor:
    | ((response: HttpResponse<any>) => Promise<HttpResponse<any>>)
    | null = null;

  // Method to set request interceptor
  public setRequestInterceptor<T>(
    interceptor: (options: RequestOptions<T>) => Promise<RequestOptions<T>>
  ) {
    this.requestInterceptor = interceptor;
  }

  // Method to set response interceptor
  public setResponseInterceptor<T>(
    interceptor: (response: HttpResponse<T>) => Promise<HttpResponse<T>>
  ) {
    this.responseInterceptor = interceptor;
  }
/**
 * Sends Request over HTTP/HTTPs connection.
 * @param method The HTTP method for the request.
 * @param path The ath to be appended to the baseURL.
 * @param options Options for the Request.
 * @param body Request body.
 * @returns HTTP response.
 */
  private async send<T>(
    method: RequestOptions<T>["method"],
    path: string,
    options: RequestOptions<T>,
    body?: T
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, options.queryParameters);

    if (body) {
      //Assign body to an option if provided
      options.body = body;
    }
    if (method) {
      //Assign method parameter to option if not provided
      options.method = method;
    }
    let requestOptions = this.buildRequestOptions(method, options);

    if (this.requestInterceptor) {
      const modifiedOptions = await this.requestInterceptor(options);
      if (modifiedOptions) {
        requestOptions = modifiedOptions;
      }
    }

    try {
      const response = await this.sendRequest<T>(
        url,
        requestOptions as RequestOptions<T>
      );

      if (this.responseInterceptor) {
        const modifiedResponse = await this.responseInterceptor(response);
        if (modifiedResponse) {
          return modifiedResponse.data;
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
/**
 * Handles HTTP error based on the response.
 * @param res The HTTP to handle errors for.
 */
  private handleHttpError<T>(res: http.IncomingMessage): void {
    let errorResponse: HttpResponse<Error>;

    if (res.statusCode && res.statusCode >= 400 && res.statusCode < 500) {
      errorResponse = {
        data: new NimbusError(`Client error: ${res.statusCode}`),
        status: res.statusCode,
        headers: res.headers,
      };
    } else if (
      res.statusCode &&
      res.statusCode >= 500 &&
      res.statusCode < 600
    ) {
      errorResponse = {
        data: new NimbusError(`Server error: ${res.statusCode}`),
        status: res.statusCode,
        headers: res.headers,
      };
    } else {
      errorResponse = {
        data: new NimbusError(`Unexpected status code: ${res.statusCode}`),
        status: res.statusCode,
        headers: res.headers,
      };
    }

    throw errorResponse;
  }

  /**
   * Initiates a GET request to the specified URL.
   * @param path The path to send a request to.
   * @param options Options for the GET Request.
   * @returns A Promise resolving to HTTP response.
   */
  public async get<T>(
    path: string,
    options: RequestOptions<T> = { method: "GET" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("GET", path, options);
  }
/**
 * Initiates a POST request to specified URL.
 * @param path Path to senf a request to.
 * @param body HTTP body contain data object.
 * @param options Options for the POST request. 
 * @returns A promise resolving to HTTP response.
 */
  public async post<T>(
    path: string,
    body?: T,
    options: RequestOptions<T> = { method: "POST" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("POST", path, options, body);
  }
/**
 * Initiates a PUT request to specified URL.
 * @param path Path to senf a request to.
 * @param body HTTP body contain data object.
 * @param options Options for the POST request.
 * @returns A promise resolving to HTTP response.
 */
  public async put<T>(
    path: string,
    body?: T,
    options: RequestOptions<T> = { method: "PUT" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("PUT", path, options, body);
  }
  /**
 * Initiates a PATCH request to specified URL.
 * @param path Path to senf a request to.
 * @param body HTTP body contain data object.
 * @param options Options for the PATCH request .
 * @returns A promise resolving to HTTP response.
 */
  public async patch<T>(
    path: string,
    body?: T,
    options: RequestOptions<T> = { method: "PATCH" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("PATCH", path, options, body);
  }
 /**
   * Initiates a DELETE request to the specified URL.
   * @param path The path to send a request to.
   * @param options Options for the DELETE Request.
   * @returns A Promise resolving to HTTP response.
   */
  public async delete<T>(
    path: string,
    options: RequestOptions<T> = { method: "DELETE" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("DELETE", path, options);
  }

  /**
   * Parses HTTP response body base on response type.
   * @param response The response body.
   * @param responseType The expected response type.
   * @returns A parsed response based on specified type.
   */
  private async parseResponseBody<T>(
    response: any,
    responseType: string | undefined
  ): Promise<T> {
    switch (responseType) {
      case "json":
        return JSON.parse(response);
      case "text":
        return response;
      case "xml":
        const parser = new DOMParser();
        const xlmDoc = parser.parseFromString(response, "text/xml");
        return xlmDoc as unknown as T;
      default:
        throw new NimbusError(`Unsupported response type: ${responseType}`);
    }
  }
}
