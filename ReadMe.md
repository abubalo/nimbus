## Nimbus


This repository contains an exploratory HTTP client, `nimbus`, implemented in TypeScript. The primary objective of this project is to gain insights into building a rudimentary HTTP client capable of performing GET, POST, PUT, and DELETE requests. The client is designed to interact with a simple HTTP server and handle various response types such as JSON, Plain text, and XML.

## Features

- Supports all HTTP methods: GET, POST, PUT, PATCH, DELETE
- Configurable: Can be set up with a base URL, headers, and interceptors
- Response Handling: Capable of managing different response types (JSON, text, XML)
- HTTPS Support: Provides secure connections through HTTPS
- Timeout Mechanism: Implements request timeout feature for handling timeouts
- Interceptors: Supports request and response interceptors to modify requests or responses

## Limitations

While the exploratory HTTP client provides basic functionalities for making HTTP requests, it comes with several limitations:

- **Simplified Functionality**: The client is intentionally kept minimal to focus on the fundamentals of building an HTTP client. It lacks many features commonly found in full-fledged HTTP clients, such as request retries, and caching.

- **Error Handling**: The error handling mechanism is basic and might not cover all possible error scenarios. For production-ready applications, more robust error handling is necessary.

- **Security Considerations**: The HTTP client does not implement security measures like HTTPS. In real-world applications, using HTTPS is crucial to ensure data privacy and security.

- **No Configuration Options**: The client does not support configuration options like timeout settings, custom headers, or authentication mechanisms. These features are typically essential in production-ready HTTP clients.

## Getting Started

To use this exploratory HTTP client, follow these steps:

1. Clone this repository to your local machine.

2. Navigate to the project directory.

3. Install the required dependencies by running:

   ```bash
   npm install
   ```

To run the sample usage code, use the following command:

```sh
ts-node filename.ts
```

Observe the output in the console to see the results of the sample GET and POST requests.

## Usage

To use the `HttpClient` class, follow these examples for making GET, POST, PUT, and DELETE requests along with error handling.

### Initialize the HTTP Client

```typescript
import nimus from "./src/nimbus";
```

Make a `GET` Request.

```ts
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function getTodos() {
  try {
    const response = await nimbus.get<Todo>("/todos/1");
    console.log("GET Request Response Data:", response.data);
    console.log("GET Request Status Code:", response.status);
  } catch (error) {
    console.error("GET Request Error:", error);
  }
}

getTodos();
```

Make a `POST` Request

```ts
const newTodo: Todo = {
  userId: 1,
  id: 1,
  title: "Sample Todo",
  completed: false,
};

async function createTodo() {
  try {
    const response = await nimbus.post<Todo>("/todos", { body: newTodo });
    console.log("POST Request Response Data:", response.data);
    console.log("POST Request Status Code:", response.status);
  } catch (error) {
    console.error("POST Request Error:", error);
  }
}

createTodo();
```

Make a `PUT` Request

```ts
const updatedTodo: Todo = {
  userId: 1,
  id: 1,
  title: "Updated Todo",
  completed: true,
};

async function updateTodo() {
  try {
    const response = await nimbus.put<Todo>("/todos/1", { body: updatedTodo });
    console.log("PUT Request Response Data:", response.data);
    console.log("PUT Request Status Code:", response.status);
  } catch (error) {
    console.error("PUT Request Error:", error);
  }
}

updateTodo();
```

Make a `PATCH` Request

```ts
// Define the updated data for the PATCH request
const updatedData: Partial<Todo> = {
  title: "Updated Title",
};

async function patchData() {
  try {
    const response = await nimbus.patch<Todo>("/todos/1", {
      body: updatedData,
    });
    console.log("PATCH Request Response Data:", response.data);
    console.log("PATCH Request Status Code:", response.status);
  } catch (error) {
    console.error("PATCH Request Error:", error);
  }
}

patchData();
```

Make a `DELETE` Request

```ts
async function deleteTodo() {
  try {
    const response = await nimbus.delete<Todo>("/todos/1");
    console.log("DELETE Request Response Data:", response.data);
    console.log("DELETE Request Status Code:", response.status);
  } catch (error) {
    console.error("DELETE Request Error:", error);
  }
}

deleteTodo();
```

## Future Improvements

- [x] **HTTPS Support**: Provide HTTPS support to the HTTP client to make secure connections.

- [x] **PATCH method Support**: Provide support to the HTTP client to make a PATCH request.

- [x] **Timeout**: Implement a timeout feature to handle request timeouts.

- [x] **Response Type: Allow specifying the expected response type for better type checking.

- [x] **onProgress**: Implement progress tracking for long-running requests.

- [x] **Interceptor: Add support for request/response interceptors to modify requests or responses.

- [x] **Error Handling**: Enhance error handling with more detailed error messages.

- [ ] **Multipart/form-data support**: Allow the transmission of files alongside other form fields.

> Disclaimer: This project is intended for learning purposes only and does not serve as a substitute for fully-featured JavaScript HTTP clients. It is not actively maintained. If you find a way to improve or optimize it, feel free to fork this repository and experiment with the code for personal learning or exploratory purposes.

## License

This project is provided under the [MIT License](/LICENSE.md). Feel free to use and modify the code according to the terms of the license.
