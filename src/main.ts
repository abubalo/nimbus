import nimbus, {NimbusError} from "./nimbus";

// Initial the http client
//The intialization takes baseURL optional paramerters
const client = nimbus();
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean
}

async function getTodos() {
  try {
    const response = await client.get<Todo>("https://jsonplaceholder.typicode.com/todos/1");
    console.log("Response:", response.data);
    console.log("Response:", !!response.data);
    console.log("Response:", response.status);
  } catch (error) {
    console.error("Error:", error);
  }
}

getTodos();

// Example usage:
try {
  // Simulate an error, e.g., an HTTP request fails
  throw new NimbusError("Custom error message", 404, {
    someData: "additional information",
  });
} catch (error) {
  if (error instanceof NimbusError) {
    console.error(error.name); // "NimbusError"
    console.error(error.message); // "Custom error message"
    console.error(error.status); // 404
    console.error(error.response); // { someData: 'additional information' }
  }
}

