# Exploratory HTTP Client

**Disclaimer: This project is intended for learning purposes only and does not serve as a substitute for fully-featured JavaScript HTTP clients. It is not actively maintained.**

## Overview

This repository contains an exploratory HTTP client implemented in TypeScript. The primary objective of this project is to gain insights into building a rudimentary HTTP client that can perform GET, POST, PUT, and DELETE requests. The client is designed to interact with a simple HTTP server and handle JSON responses.

## Features

- **GET Request**: The HTTP client allows you to perform GET requests to retrieve data from the server.

- **POST Request**: You can use the client to send POST requests with JSON payloads to create new resources on the server.

- **PUT Request**: The HTTP client supports PUT requests to update existing resources on the server.

- **DELETE Request**: You can use the client to send DELETE requests to remove resources from the server.

## Limitations

While the exploratory HTTP client provides basic functionalities for making HTTP requests, it comes with several limitations:

- **Simplified Functionality**: The client is intentionally kept minimal to focus on the fundamentals of building an HTTP client. It lacks many features commonly found in full-fledged HTTP clients, such as interceptors, request retries, and caching.

- **Error Handling**: The error handling mechanism is basic and might not cover all possible error scenarios. For production-ready applications, more robust error handling is necessary.

- **Security Considerations**: The client does not implement security measures like HTTPS. In real-world applications, using HTTPS is crucial to ensure data privacy and security.

- **No Configuration Options**: The client does not support configuration options like timeout settings, custom headers, or authentication mechanisms. These features are typically essential in production-ready HTTP clients.

## Getting Started

To use this exploratory HTTP client, follow these steps:

1. Clone this repository to your local machine.

2. Navigate to the project directory.

3. Install the required dependencies by running:

   ```bash
   npm install
   ```

Explore and experiment with the HttpClient class in the src/HttpClient.ts file. You can use the provided example usage in the same file as a starting point.

To run the sample usage code, use the following command:

```bash
npm start
```
Observe the output in the console to see the results of the sample GET and POST requests.

## Usage 

```typescript
import HttpClient from "./src/HttpClient";

// Create an instance of the HttpClient with the base URL of the API
const client = new HttpClient("http://api.example.com");

interface User {
  id: string;
  name: string;
  email: string;
}

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
```
## Contributions
Please note that this project is solely for educational purposes. If you find a way to improve or optimize it, feel free to fork this repository and experiment with the code for personal learning or exploratory purposes.

## License
This project is provided under the MIT License. Feel free to use and modify the code according to the terms of the license.