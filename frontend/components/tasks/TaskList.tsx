import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskList = ({ tasks, onToggle, onEdit, onDelete }: TaskListProps) => {
  if (!tasks || !Array.isArray(tasks)) {
    console.error('TaskList received invalid tasks:', tasks);
    return <div>Error loading tasks</div>;
  }

  if (tasks.length === 0) {
    return (
      <div>
        <div>No tasks yet!</div>
        <div>Create your first task above to get started.</div>
      </div>
    );
  }

  return (
    <div>
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
