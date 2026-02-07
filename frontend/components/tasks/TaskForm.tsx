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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-cream font-semibold mb-3 text-xl">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="w-full px-6 py-5 rounded-2xl border-0 bg-white/10 backdrop-blur-sm text-cream placeholder-cream/60 transition-all duration-300 outline-none text-lg elegant-input"
        />
      </div>

      <div className="w-full">
        <label className="block text-cream font-semibold mb-3 text-xl">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={4}
          className="w-full px-6 py-5 rounded-2xl border-0 bg-white/10 backdrop-blur-sm text-cream placeholder-cream/60 transition-all duration-300 outline-none resize-none elegant-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-cream font-semibold mb-3 text-xl">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-6 py-5 rounded-2xl border-0 bg-white/10 backdrop-blur-sm text-cream placeholder-cream/60 transition-all duration-300 outline-none elegant-input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-cream font-semibold mb-3 text-xl">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category (optional)"
            className="w-full px-6 py-5 rounded-2xl border-0 bg-white/10 backdrop-blur-sm text-cream placeholder-cream/60 transition-all duration-300 outline-none elegant-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-cream font-semibold mb-3 text-xl">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-6 py-5 rounded-2xl border-0 bg-white/10 backdrop-blur-sm text-cream placeholder-cream/60 transition-all duration-300 outline-none elegant-input"
        />
      </div>

      {error && (
        <div className="text-error text-base font-medium py-2">
          {error}
        </div>
      )}

      <div className="flex space-x-4 pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-5 text-xl font-bold text-brown-dark rounded-2xl btn-premium disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <span className="relative z-10">{isLoading ? 'Saving...' : submitLabel}</span>
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-5 px-8 text-xl font-bold text-cream bg-gradient-to-r from-brown-medium to-brown-light rounded-2xl hover:from-brown-light hover:to-brown-lighter transition-all duration-300 shadow-elegant hover:shadow-elegant-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};