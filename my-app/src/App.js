import { useState, useEffect } from 'react';
import styles from './App.module.css';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { db } from './firebase';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortByAlphabet, setSortByAlphabet] = useState(false);
	const [sortedTodos, setSortedTodos] = useState([]);
	const [editableTodoId, setEditableTodoId] = useState(null);
	const [editedTodoText, setEditedTodoText] = useState('');
	const [originalTodos, setOriginalTodos] = useState([]);

	useEffect(() => {
		const todoRef = ref(db, 'todos');
		onValue(todoRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const todosArray = Object.keys(data).map((key) => ({ id: key, text: data[key].text }));
				setTodos(todosArray);
				setOriginalTodos(todosArray);
			} else {
				setTodos([]);
				setOriginalTodos([]);
			}
		});
	}, []);

	useEffect(() => {
		if (sortByAlphabet) {
			const sorted = [...todos].sort((a, b) => a.text.localeCompare(b.text));
			setSortedTodos(sorted);
		} else {
			setSortedTodos([...todos]);
		}
	}, [sortByAlphabet, todos]);

	const addTodo = () => {
		const todoRef = ref(db, 'todos');
		push(todoRef, { text: newTodo })
			.then((newTodoRef) => {
				const newTodoId = newTodoRef.key;
				setTodos([...todos, { id: newTodoId, text: newTodo }]);
				setNewTodo('');
			})
			.catch((error) => console.error(error));
	};

	const handleSearch = () => {
		const filteredTodos = originalTodos.filter((todo) => todo.text.toLowerCase().includes(searchTerm.toLowerCase()));
		setTodos(filteredTodos);
	};

	const startEdit = (id, text) => {
		setEditableTodoId(id);
		setEditedTodoText(text);
	};

	const saveEdit = () => {
		const todoRef = ref(db, `todos/${editableTodoId}`);
		update(todoRef, { text: editedTodoText })
			.then(() => {
				const updatedTodos = todos.map((todo) => (todo.id === editableTodoId ? { ...todo, text: editedTodoText } : todo));
				setTodos(updatedTodos);
				setEditableTodoId(null);
				setEditedTodoText('');
			})
			.catch((error) => console.error(error));
	};

	const deleteTodo = (id) => {
		const todoRef = ref(db, `todos/${id}`);
		remove(todoRef)
			.then(() => {
				const updatedTodos = todos.filter((todo) => todo.id !== id);
				setTodos(updatedTodos);
			})
			.catch((error) => console.error(error));
	};

	return (
		<div className={styles.app}>
			<h1 className={styles.title}>Список задач</h1>
			<TodoInput
				newTodo={newTodo}
				setNewTodo={setNewTodo}
				addTodo={addTodo}
				setSearchTerm={setSearchTerm}
				handleSearch={handleSearch}
				setSortByAlphabet={() => setSortByAlphabet(!sortByAlphabet)}
			/>
			<TodoList
				sortedTodos={sortedTodos}
				editableTodoId={editableTodoId}
				editedTodoText={editedTodoText}
				deleteTodo={deleteTodo}
				startEdit={startEdit}
				saveEdit={saveEdit}
				setEditedTodoText={setEditedTodoText}
			/>
		</div>
	);
};
