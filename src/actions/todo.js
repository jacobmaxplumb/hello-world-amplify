import { listTodos } from "../graphql/queries";
import { API, Storage } from "aws-amplify";
import {
	createTodo as createTodoMutation,
	deleteTodo as deleteTodoMutation,
} from "../graphql/mutations";

export const fetchTodos = async (onSuccess) => {
	const apiData = await API.graphql({ query: listTodos });
	const todosFromAPI = apiData.data.listTodos.items;
    await Promise.all(todosFromAPI.map(async (todo) => {
        if (todo.image) {
            const url = await Storage.get(todo.name);
            todo.image = url
        }
        return todo;
    }))
	onSuccess(todosFromAPI);
};

export const createTodo = async (data, onSuccess) => {
    const note = {
        name: data.name,
        description: data.description,
        image: data.image,
        isDone: false
    }
    if (!!data.image) await Storage.put(data.name, data.image);
	await API.graphql({
		query: createTodoMutation,
		variables: { input: note },
	});
    const apiData = await API.graphql({ query: listTodos });
	const notesFromAPI = apiData.data.listTodos.items;
    onSuccess(notesFromAPI);
};

export const deleteTodo = async (data, onSuccess) => {
    const id = data.id;
    const newTodos = data.filter((todo) => todo.id !== id);
    await API.graphql({
        query: deleteTodoMutation,
        variables: { input: { id } },
    });
    onSuccess(newTodos);
}
