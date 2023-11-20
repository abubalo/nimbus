import nimbus, {NimbusError} from "../src/nimbus";
import Httpclient from "../src/HttpClient"

// Initial the http client
//The intialization takes baseURL optional paramerters
// const client = nimbus();
// const nimbus = new Httpclient();
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function getTodos(id: number = 1) {
  try {
    const response = await nimbus.get<Todo>(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

getTodos(5);

async function createTodos() {
  const newTodo: Todo = {
    userId: 1,
    id: 2,
    title: "Sample Todo",
    completed: false,
  };
  try {
    const response = await nimbus.post<Todo>(
      "https://jsonplaceholder.typicode.com/posts", newTodo
    );
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

// createTodos();

