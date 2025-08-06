'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { createTodo, updateTodo, deleteTodo } from '@/lib/api';

export default function ClientList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    
    const todo = await createTodo(newTodo);
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await updateTodo(id, !completed);
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <>
      <div className="flex mb-4">
        <input
          className="border p-2 flex-grow"
          placeholder="New todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAdd} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id, todo.completed)}
            />
            <span className={`ml-2 flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)} className="text-red-600 ml-2">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}
