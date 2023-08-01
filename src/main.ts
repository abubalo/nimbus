// Example usage
import HttpClient from "./HttpClient"


const client = new HttpClient("http://api.example.com");
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

interface User {
  id: string;
  name: string;
  email: string;
}