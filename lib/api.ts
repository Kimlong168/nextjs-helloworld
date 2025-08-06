import { Todo } from '@/types/todo';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${API_URL}/todos`, { cache: 'no-store' });
  return res.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function updateTodo(id: number, completed: boolean) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  return res.json();
}

export async function deleteTodo(id: number) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
