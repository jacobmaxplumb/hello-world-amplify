import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
	withAuthenticator,
	Button,
	Image,
	View,
	Text,
	TextField,
} from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { fetchTodos, createTodo, deleteTodo } from "./actions/todo";

function App({ signOut }) {
	const [isLoading, setIsLoading] = useState(true);
	const [todos, setTodos] = useState([]);

	const onSuccess = (data) => {
		setTodos(data);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchTodos(onSuccess);
	}, []);

	const addTodo = (e) => {
		e.preventDefault();
		const form = new FormData(e.target);
		const todo = {
			name: form.get("name"),
			description: form.get("description"),
			image: form.get("image").name,
		};
		setIsLoading(true);
		createTodo(todo, onSuccess);
	};

	return (
		<div className="App">
			{!isLoading ? (
				<div>
					{todos.map((todo) => (
						<div key={todo.id}>
							<Text as="strong" fontWeight={700}>
								{todo.name}
							</Text>
							<Text as="span">{todo.description}</Text>
							{todo.image && (
								<Image
									src={todo.image}
									alt={`visual aid for ${todo.name}`}
									style={{ width: 400 }}
								/>
							)}
							<Button
								variation="link"
								onClick={() => deleteTodo(todo, onSuccess)}
							>
								Delete todo
							</Button>
						</div>
					))}
					<View as="form" margin="3rem 0" onSubmit={addTodo}>
						<TextField
							name="name"
							placeholder="Note Name"
							label="Note Name"
							labelHidden
							variation="quiet"
							required
						/>
						<TextField
							name="description"
							placeholder="Note Description"
							label="Note Description"
							labelHidden
							variation="quiet"
							required
						/>
						<View
							name="image"
							as="input"
							type="file"
							style={{ alignSelf: "end" }}
						/>
						<Button type="submit" variation="primary">
							Create Note
						</Button>
					</View>
				</div>
			) : (
				<div>Getting the notes</div>
			)}
			<Button onClick={signOut}>Sign Out</Button>
		</div>
	);
}

export default withAuthenticator(App);
