import HttpClient from "./HttpClient";
import { NimbusError } from "./NimbusError";
import { Config, HttpResponse, RequestOptions } from "../types";

const nimbusInstance = HttpClient.getInstance();

// Attach methods directly to the nimbusInstance for easy access
const nimbus = {
  get: <T>(
    path: string,
    options?: RequestOptions<T>
  ): Promise<HttpResponse<T>> => nimbusInstance.get<T>(path, options),
  post: <T>(
    path: string,
    body: T,
    options?: RequestOptions<T>
  ): Promise<HttpResponse<T>> => nimbusInstance.post<T>(path, body, options),
  put: <T>(
    path: string,
    body: T,
    options?: RequestOptions<T>
  ): Promise<HttpResponse<T>> => nimbusInstance.put<T>(path, body, options),
  patch: <T>(
    path: string,
    body: T,
    options?: RequestOptions<T>
  ): Promise<HttpResponse<T>> => nimbusInstance.patch<T>(path, body, options),
  delete: <T>(
    path: string,
    options?: RequestOptions<T>
  ): Promise<HttpResponse<T>> => nimbusInstance.delete<T>(path, options),
  create: <T>(config: Config<T>) => HttpClient.create<T>(config),
};

export { nimbus as default, NimbusError };
