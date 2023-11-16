import HttpClient from "../src/HttpClient";
import { NimbusError } from "../src/NimbusError";

describe("HTTP client Test Suite", () => {
  let client: HttpClient;
  const url = "https://jsonplaceholder.typicode.com/todos";

  beforeEach(() => {
    client = new HttpClient();
  });

  afterEach(() => {
    client = new HttpClient();
  });

  interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }
  const expectResult = {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  };
  describe("GET MEthod", () => {
    test("Should perform a GET request with valid input", async () => {
      try {
        const response = await client.get<Todo>(url);

        //Assert response status code
        expect(response.status).toBe(200);

        //Asset other properties
        expect(response.data).toEqual(expect.objectContaining(expectResult));
        expect(response.data).toHaveProperty("userId");
        expect(response.data).toHaveProperty("title");
        expect(response.data).toHaveProperty("completed");
        expect(response.statusMessage).toBe("OK");
        expect(response.headers);
      } catch (error) {
        // Fail the test if an error occurs
        fail("Unexpected error occurred: " + error);
      }
    });

    test("Should handle invalid inputs for GET request", async () => {
      try {
        // Send a GET request to an invalid endpoint intentionally
        const response = await client.get<Todo>(
          "https://jsonplaceholder.typicode.com/todosajaja/1"
        );

        // If the request succeeds, fail the test
        fail("Request should have failed due to an invalid endpoint");
      } catch (error) {
        // Assert the error response
        expect(error).toBeInstanceOf(Error);
        // expect(error.response).toMatch(/404/);
      }
    });
  });

  describe("POST Method", () => {
    test("should perform a POST request with valid inputs", async () => {
      const newTodo: Todo = {
        userId: 1,
        id: 2,
        title: "Sample Todo",
        completed: false,
      };

      try {
        const response = await client.post(url, {
          body: newTodo,
          method: "POST",
        });

        // Assert specific properties of the created todo
        expect(response.data).toBe(expect.objectContaining(newTodo));
        expect(response.status).toBe(201);
        expect(response.statusMessage).toBe("Created");
        expect(response.data).toHaveProperty("userId");
        expect(response.data).toHaveProperty("title");
        // expect(response.data).toHaveProperty("");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test("should handle invalid inputs for POST request", async () => {
      //Todo: Implement test logic for invalid POST request scenarios
      // Test with invalid body formats or missing parameters
    });
  });

  describe("Interceptor Tests", () => {
    test("should modify request with request interceptor", async () => {
      // Create a request interceptor function
      const requestInterceptor = async (options) => {
        // Modify request options or headers
        options.headers["Authorization"] = "Bearer modifiedToken";
        return options;
      };

      // Set the request interceptor
      client.setRequestInterceptor = requestInterceptor;

      // Make a request that triggers the interceptor
      await client.get("/endpoint");

      // Validate if the request was modified as expected
      // For example, check if the 'Authorization' header was added
      // Assert the modified request or its components
    });

    test("should modify response with response interceptor", async () => {
      // Create a response interceptor function
      const responseInterceptor = async (response) => {
        // Modify the response data or headers
        response.data.modified = true;
        return response;
      };

      // Set the response interceptor
      client.setResponseInterceptor = responseInterceptor;

      // Make a request that triggers the interceptor
      const result = await client.get("/endpoint");

      // Validate if the response was modified as expected
      // For example, check if the response data was modified
      // Assert the modified response or its components
    });
  });
});
