import * as http from "http";
import * as https from "https";
import { NimbusError } from "./NimbusError";

export interface RequestOptions extends http.RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  queryParameters?: Record<string, string>;
  body?: unknown;
}

interface HttpResponse<T> {
  data: T;
  status: number;
}

export default class HttpClient {
  private baseUrl: string | undefined;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  private async sendRequest<T>(
    url: string,
    options: RequestOptions
  ): Promise<HttpResponse<T>> {
    const protocol = url.startsWith("https:") ? https : http;
    return new Promise<HttpResponse<T>>((resolve, reject) => {
      const req = protocol.request(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (
            res.statusCode &&
            (res.statusCode < 400 || res.statusCode < 600)
          ) {
            const response: HttpResponse<T> = {
              data: JSON.parse(data),
              status: res.statusCode,
            };
            resolve(response);
          } else {
            reject(
              new NimbusError(
                `Request failed with status code: ${res.statusCode}`
              )
            );
          }
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }

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
      const queryString = Object.keys(queryParameters)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              queryParameters[key]
            )}`
        )
        .join("&");
      url += `?${queryString}`;
    }
    return url;
  }

  private buildRequestOptions(
    method: string,
    options: RequestOptions
  ): http.RequestOptions {
    const requestOptions: http.RequestOptions = {
      method,
      headers: options.headers || {}, // Use empty object if options.headers is undefined
    };
    if (options.body) {
      requestOptions.headers!["Content-Type"] = "application/json";
    }
    return requestOptions;
  }

  private async send<T>(
    method: RequestOptions["method"],
    path: string,
    options: RequestOptions
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, options.queryParameters);
    const requestOptions = this.buildRequestOptions(method, options);
    const response = await this.sendRequest<T>(
      url,
      requestOptions as RequestOptions
    );
    return response;
  }

  public async get<T>(
    path: string,
    options: RequestOptions = { method: "GET" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("GET", path, options);
  }

  public async post<T>(
    path: string,
    options: RequestOptions = { method: "POST" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("POST", path, options);
  }

  public async put<T>(
    path: string,
    options: RequestOptions = { method: "PUT" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("PUT", path, options);
  }
  public async patch<T>(
    path: string,
    options: RequestOptions = { method: "PATCH" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("PATCH", path, options);
  }

  public async delete<T>(
    path: string,
    options: RequestOptions = { method: "DELETE" }
  ): Promise<HttpResponse<T>> {
    return this.send<T>("DELETE", path, options);
  }
}
