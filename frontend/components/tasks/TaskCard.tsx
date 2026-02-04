// components/tasks/TaskCard.tsx

import { Task } from '@/lib/types';
import { Circle, CheckCircle, Edit3, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  return (
    <div 
      className={`p-5 bg-[#8D6E63] rounded-xl shadow-md transition-all duration-300 ${
        task.completed ? 'opacity-70' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <button
              onClick={onToggle}
              className={`mr-4 w-10 h-10 flex items-center justify-center rounded-full ${
                task.completed 
                  ? 'bg-[#66BB6A] text-white' 
                  : 'bg-[#5D4037] text-transparent'
              }`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed && <CheckCircle size={20} />}
            </button>
            <div>
              <h3 className={`font-bold text-lg ${
                task.completed ? 'line-through text-[#BCAAA4]' : 'text-white'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-2 text-sm ${
                  task.completed ? 'line-through text-[#BCAAA4]' : 'text-[#BCAAA4]'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full bg-[#FFC107] text-[#3E2723] hover:bg-[#FFD54F] transition-colors"
            aria-label="Edit task"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-[#EF5350] text-white hover:bg-[#FF7F7F] transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};