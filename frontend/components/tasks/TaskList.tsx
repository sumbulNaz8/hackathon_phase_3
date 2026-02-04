// components/tasks/TaskList.tsx

import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { CheckSquare } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskList = ({ tasks, onToggle, onEdit, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-[#8D6E63] rounded-xl p-12 text-center shadow-md">
        <CheckSquare className="w-16 h-16 text-[#BCAAA4] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No tasks yet!</h3>
        <p className="text-[#BCAAA4]">Create your first task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
};