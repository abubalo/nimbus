import HttpClient from "./HttpClient"; // Import RequestOptions too

let httpClientInstance: HttpClient;

export default function nimbus(baseUrl: string): HttpClient {
  if (!httpClientInstance) {
    httpClientInstance = new HttpClient(baseUrl);
  }
  return httpClientInstance;
}
