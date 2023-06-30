import * as http from "http";

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  queryParameters?: Record<string, string>;
  body?: any;
}

export default class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async get<T>(path: string, options: RequestOptions = {
      method: "GET"
  }): Promise<T> {
    const url = this.buildUrl(path, options.queryParameters);
    const requestOptions = this.buildRequestOptions("GET", options);
    const response = await this.sendRequest(url, requestOptions);
    return this.parseResponseBody<T>(response);
  }

  public async post<T>(path: string, options: RequestOptions = {
      method: "POST"
  }): Promise<T> {
    const url = this.buildUrl(path, options.queryParameters);
    const requestOptions = this.buildRequestOptions("POST", options);
    const response = await this.sendRequest(url, requestOptions);
    return this.parseResponseBody<T>(response);
  }

  public async put<T>(path: string, options: RequestOptions = {
      method: "PUT"
  }): Promise<T> {
    const url = this.buildUrl(path, options.queryParameters);
    const requestOptions = this.buildRequestOptions("PUT", options);
    const response = await this.sendRequest(url, requestOptions);
    return this.parseResponseBody<T>(response);
  }

  public async delete<T>(path: string, options: RequestOptions = {
      method: "DELETE"
  }): Promise<T> {
    const url = this.buildUrl(path, options.queryParameters);
    const requestOptions = this.buildRequestOptions("DELETE", options);
    const response = await this.sendRequest(url, requestOptions);
    return this.parseResponseBody<T>(response);
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
      headers: options.headers || {},
    };
    if (options.body) {
      requestOptions.headers["Content-Type"] = "application/json";
    }
    return requestOptions;
  }

  private sendRequest(url: string, options: http.RequestOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const req = http.request(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
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

  private parseResponseBody<T>(response: string): T {
    return JSON.parse(response) as T;
  }
}

// Example usage
const client = new HttpClient("http://api.example.com");

// GET request
client.get<User>("/users/123")
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.error(error);
  });

// POST request
const newUser = { name: "John Doe", email: "johndoe@example.com" };
client.post<User>("/users", { body: newUser })
  .then((createdUser) => {
    console.log(createdUser);
  })
  .catch((error) => {
    console.error(error);
  });

interface User {
  id: string;
  name: string;
  email: string;
}
