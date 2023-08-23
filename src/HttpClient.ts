import * as http from "http";

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  queryParameters?: Record<string, string>;
  body?: unknown;
}

interface HttpResponse<T> {
  data: T;
  status: number;
}

export default class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async sendRequest<T>(url: string, options: RequestOptions): Promise<HttpResponse<T>> {
    return new Promise<HttpResponse<T>>((resolve, reject) => {
      const req = http.request(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const response: HttpResponse<T> = {
            data: JSON.parse(data) as T,
            status: res.statusCode || 200,
          };
          resolve(response);
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

  private buildUrl(path: string, queryParameters?: Record<string, string>): string {
    let url = `${this.baseUrl}${path}`;
    if (queryParameters) {
      const queryString = Object.keys(queryParameters)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key])}`)
        .join("&");
      url += `?${queryString}`;
    }
    return url;
  }

  private buildRequestOptions(method: string, options: RequestOptions): http.RequestOptions {
    const requestOptions: http.RequestOptions = {
      method,
      headers: options.headers ?? {}, // Use empty object if options.headers is undefined
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
  ): Promise<T> {
    const url = this.buildUrl(path, options.queryParameters);
    const requestOptions = this.buildRequestOptions(method, options);
    const response = await this.sendRequest<HttpResponse<T>>(url, requestOptions);
    return this.parseResponseBody<T>(response.data);
  }

  public async get<T>(path: string, options: RequestOptions = { method: "GET" }): Promise<T> {
    return this.send<T>("GET", path, options);
  }

  public async post<T>(path: string, options: RequestOptions = { method: "POST" }): Promise<T> {
    return this.send<T>("POST", path, options);
  }

  public async put<T>(path: string, options: RequestOptions = { method: "PUT" }): Promise<T> {
    return this.send<T>("PUT", path, options);
  }

  public async delete<T>(path: string, options: RequestOptions = { method: "DELETE" }): Promise<T> {
    return this.send<T>("DELETE", path, options);
  }

  private parseResponseBody<T>(response: string): T {
    return JSON.parse(response) as T;
  }
}
