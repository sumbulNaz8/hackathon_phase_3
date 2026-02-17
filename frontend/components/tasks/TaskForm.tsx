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
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="space-y-3">
        <label className="block mb-2.5 text-sm font-bold text-deep-brown font-heading tracking-wide uppercase">
          Task Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          className="input-field text-base"
        />
      </div>

      <div className="space-y-3">
        <label className="block mb-2.5 text-sm font-bold text-deep-brown font-heading tracking-wide uppercase">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={3}
          className="input-field resize-none text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <label className="block mb-2.5 text-sm font-bold text-deep-brown font-heading tracking-wide uppercase">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="input-field text-base cursor-pointer"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block mb-2.5 text-sm font-bold text-deep-brown font-heading tracking-wide uppercase">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Work, Personal"
            className="input-field text-base"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block mb-2.5 text-sm font-bold text-deep-brown font-heading tracking-wide uppercase">
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-field text-base"
        />
      </div>

      {error && (
        <div className="p-5 bg-gradient-to-r from-rose-100 to-rose-50 border-2 border-rose-300 rounded-2xl text-rose-800 font-bold fade-in-up shadow-lg shadow-rose-200/50">
          ⚠️ {error}
        </div>
      )}

      <div className="flex gap-4 pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn-primary text-base shadow-2xl shadow-amber-300/30"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-primary text-base shadow-2xl shadow-amber-300/30 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-700 hover:to-rose-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
