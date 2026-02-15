// components/tasks/TaskCard.tsx

import { Task } from '@/lib/types';
import { Circle, Check, Edit3, Trash2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-glow-rose';
      case 'medium':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-orange';
      case 'low':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-glow-emerald';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={12} />;
      case 'medium':
        return <AlertCircle size={12} />;
      case 'low':
        return <CheckCircle2 size={12} />;
      default:
        return <Circle size={12} />;
    }
  };

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

  return (
    <div
      className={`glass-card p-6 rounded-2xl shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.01] backdrop-blur-sm ${
        task.completed ? 'opacity-80' : isOverdue ? 'border-2 border-red-500' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start">
            <button
              onClick={onToggle}
              className={`mt-1 mr-4 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                task.completed
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-glow-emerald'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
              }`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed ? <Check size={20} /> : <Circle size={20} />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h3 className={`font-bold text-lg ${
                  task.completed ? 'line-through text-slate-500' : 'text-slate-50'
                }`}>
                  {task.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getPriorityColor(task.priority || 'medium')}`}>
                  {getPriorityIcon(task.priority || 'medium')}
                  {(task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1)}
                </span>
                {isOverdue && (
                  <AlertTriangle className="text-rose-500" size={18} />
                )}
              </div>

              {task.description && (
                <p className={`mt-2 text-base ${
                  task.completed ? 'line-through text-slate-500' : 'text-slate-300'
                }`}>
                  {task.description}
                </p>
              )}

              {(task.category || task.due_date) && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {task.category && (
                    <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 text-sm rounded-full border border-indigo-500/30">
                      #{task.category}
                    </span>
                  )}
                  {task.due_date && (
                    <span className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1 ${
                      isOverdue ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                      </svg>
                      {formatDate(task.due_date)}
                      {isOverdue && <span className="text-rose-400 text-sm">(Overdue)</span>}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onEdit}
            className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-glow-primary hover:scale-110 hover:brightness-110 transition-all duration-150 active:scale-95"
            aria-label="Edit task"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-glow-rose hover:scale-110 hover:brightness-110 transition-all duration-150 active:scale-95"
            aria-label="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
