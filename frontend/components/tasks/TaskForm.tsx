// components/tasks/TaskForm.tsx

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface TaskFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
  initialTitle?: string;
  initialDescription?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

export const TaskForm = ({
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  submitLabel = 'Create Task',
  onCancel
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
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
      await onSubmit(title, description);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        required
        error={error && !title ? error : ''}
      />

      <div className="w-full">
        <label className="block text-sm font-medium text-[#BCAAA4] mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
          className="w-full px-4 py-3 bg-white border-2 border-[#BCAAA4] rounded-lg text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:ring-0 focus:border-[#FFC107]"
        />
      </div>

      <div className="flex space-x-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="flex-1"
        >
          {submitLabel}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};