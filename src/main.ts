import nimbus from "./nimbus";

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

