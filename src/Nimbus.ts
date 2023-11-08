import HttpClient from "./HttpClient";

let httpClientInstance: HttpClient;

export default function nimbus(baseUrl?: string): HttpClient {
  if (!httpClientInstance) {
    httpClientInstance = new HttpClient(baseUrl);
  }
  return httpClientInstance;
}
