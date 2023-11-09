import HttpClient from "./HttpClient";
import { NimbusError } from "./NimbusError";

let httpClientInstance: HttpClient;

function nimbus(baseUrl?: string): HttpClient {
  if (!httpClientInstance) {
    httpClientInstance = new HttpClient(baseUrl);
  }
  return httpClientInstance;
}

export { nimbus as defualt, NimbusError };
