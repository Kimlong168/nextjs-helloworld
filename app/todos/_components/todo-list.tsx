'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Todo } from '@/types/todo';
import { createTodo, updateTodo, deleteTodo } from '@/lib/api';
import { TodoSkeleton } from './todo-skeleton';

interface ClientListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: ClientListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!newTodo.trim() || isAdding) return;
    
    setIsAdding(true);
    try {
      const todo = await createTodo(newTodo);
      setTodos([...todos, todo]);
      setNewTodo('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    if (updatingIds.has(id)) return;
    
    setUpdatingIds(prev => new Set(prev).add(id));
    try {
      await updateTodo(id, !completed);
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (deletingIds.has(id)) return;
    
    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (isLoading) {
    return <TodoSkeleton />;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">
            My Tasks
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-sm">
              {completedCount}/{totalCount} completed
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add new todo */}
        <div className="flex gap-2">
          <Input
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isAdding}
            className="flex-1 text-base"
          />
          <Button 
            onClick={handleAdd} 
            disabled={!newTodo.trim() || isAdding}
            className="px-6"
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Add</span>
          </Button>
        </div>

        {/* Todo list */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg font-medium">No tasks yet</p>
              <p className="text-sm">Add a task above to get started!</p>
            </div>
          ) : (
            todos.map(todo => {
              const isUpdating = updatingIds.has(todo.id);
              const isDeleting = deletingIds.has(todo.id);
              
              return (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                    todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                  } ${isDeleting ? 'opacity-50 scale-95' : ''}`}
                >
                  <div className="relative">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggle(todo.id, todo.completed)}
                      disabled={isUpdating || isDeleting}
                      className="h-5 w-5"
                    />
                    {isUpdating && (
                      <Loader2 className="h-4 w-4 animate-spin absolute -top-1 -right-1 text-blue-500" />
                    )}
                  </div>
                  
                  <span
                    className={`flex-1 text-base transition-all duration-200 ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.title}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(todo.id)}
                    disabled={isDeleting || isUpdating}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Progress indicator */}
        {totalCount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
