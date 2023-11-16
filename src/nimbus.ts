import HttpClient from "./HttpClient";
import { NimbusError } from "./NimbusError";
import { Config, HttpResponse, RequestOptions } from "../types";

const nimbusInstance = HttpClient.getInstance();

// Attach methods directly to the nimbusInstance for easy access
const nimbus = {
  get: <T>(path: string, options?: RequestOptions) =>
    nimbusInstance.get<HttpResponse<T>>(path, options),
  post: <T>(path: string, options?: RequestOptions) =>
    nimbusInstance.post<HttpResponse<T>>(path, options),
  put: <T>(path: string, options?: RequestOptions) =>
    nimbusInstance.put<HttpResponse<T>>(path, options),
  patch: <T>(path: string, options?: RequestOptions) =>
    nimbusInstance.patch<HttpResponse<T>>(path, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    nimbusInstance.delete<HttpResponse<T>>(path, options),
  create: (config: Config) => HttpClient.create(config),
};

//Make it compactible with browser
if (typeof window !== "undefined") {
  window.nimbus = nimbusInstance;
}
export { nimbus as default, NimbusError };
