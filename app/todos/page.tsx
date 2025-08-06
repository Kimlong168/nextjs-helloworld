import { getTodos } from '@/lib/api';
import ClientList from './_components/client-list';

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Todo List</h1>
      <ClientList initialTodos={todos} />
    </div>
  );
}
