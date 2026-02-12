// components/tasks/TaskForm.tsx

import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (title: string, description: string, priority: string, category: string, dueDate: string) => Promise<void>;
  initialTitle?: string;
  initialDescription?: string;
  initialPriority?: string;
  initialCategory?: string;
  initialDueDate?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

export const TaskForm = ({
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  initialPriority = 'medium',
  initialCategory = '',
  initialDueDate = '',
  submitLabel = 'Create Task',
  onCancel
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState(initialPriority);
  const [category, setCategory] = useState(initialCategory);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(title, description, priority, category, dueDate);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('');
      setDueDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-slate-300 font-semibold mb-2 text-lg">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-600 bg-slate-800/60 text-slate-50 placeholder-slate-500 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-base"
        />
      </div>

      <div className="w-full">
        <label className="block text-slate-300 font-semibold mb-2 text-lg">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-600 bg-slate-800/60 text-slate-50 placeholder-slate-500 transition-all duration-200 outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-2 text-lg">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-600 bg-slate-800/60 text-slate-50 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2 text-lg">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category (optional)"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-600 bg-slate-800/60 text-slate-50 placeholder-slate-500 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-2 text-lg">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-600 bg-slate-800/60 text-slate-50 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
        />
      </div>

      {error && (
        <div className="text-red-500 text-base font-medium py-2">
          {error}
        </div>
      )}

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 shadow-glow-primary hover:scale-102 hover:brightness-110 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-3 px-6 text-lg font-semibold text-slate-300 border-2 border-slate-600 rounded-xl hover:bg-slate-700/50 transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
