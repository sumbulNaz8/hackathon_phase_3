import { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  const priorityColors = {
    high: 'bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white shadow-xl shadow-rose-300/50',
    medium: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-xl shadow-amber-300/50',
    low: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-300/50'
  };

  return (
    <div className={`task-card fade-in-up ${task.completed ? 'completed' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Diamond Toggle Button */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
            task.completed
              ? 'bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-500 text-white shadow-emerald-300/50'
              : 'bg-white border-3 border-amber-400 text-amber-600 hover:border-amber-500 hover:bg-amber-50 hover:scale-105'
          }`}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <span className="text-2xl">
            {task.completed ? '✓' : '○'}
          </span>
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className={`font-heading font-bold text-xl mb-2 ${
                task.completed ? 'line-through text-amber-300' : 'text-deep-brown'
              }`}>
                {task.title}
              </h3>

              {task.description && (
                <p className={`text-sm mb-3 leading-relaxed ${
                  task.completed ? 'line-through text-amber-400' : 'text-deep-brown/70'
                }`}>
                  {task.description}
                </p>
              )}

              {/* Premium Metadata */}
              <div className="flex flex-wrap gap-2.5 mt-4">
                {task.priority && (
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                )}

                {task.category && (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-2 border-amber-300 shadow-sm">
                    #{task.category}
                  </span>
                )}

                {task.due_date && (
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border-2 shadow-sm ${
                    isOverdue
                      ? 'bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border-rose-300'
                      : 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    📅 {formatDate(task.due_date)}
                    {isOverdue && ' ⚠️'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Diamond Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onEdit}
            className="px-5 py-3 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 text-deep-brown font-bold text-sm shadow-xl shadow-amber-300/30 hover:shadow-2xl hover:shadow-amber-300/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            aria-label="Edit task"
          >
            ✏️ Edit
          </button>
          <button
            onClick={onDelete}
            className="px-5 py-3 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-500 to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-300/30 hover:shadow-2xl hover:shadow-rose-300/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            aria-label="Delete task"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};
