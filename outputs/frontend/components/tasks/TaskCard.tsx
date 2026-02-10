'use client';

import { Task } from '@/lib/types';
import { Square, CheckSquare, Edit3, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <div 
      className={`p-4 bg-[#8D6E63] rounded-lg shadow-md transition-all duration-300 ${
        task.completed ? 'opacity-70' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <button
              onClick={onToggle}
              className={`mr-3 w-6 h-6 flex items-center justify-center border-2 ${
                task.completed 
                  ? 'bg-[#66BB6A] border-[#66BB6A] text-white' 
                  : 'border-[#BCAAA4] text-transparent'
              }`}
            >
              {task.completed && <CheckSquare size={16} />}
            </button>
            <h3 className={`font-medium ${
              task.completed ? 'line-through text-[#BCAAA4]' : 'text-white'
            }`}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className={`mt-2 text-sm ${
              task.completed ? 'line-through text-[#BCAAA4]' : 'text-[#BCAAA4]'
            }`}>
              {task.description}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!task.completed && (
            <button
              onClick={onEdit}
              className="p-2 text-[#FFC107] hover:text-[#FFE082]"
              title="Edit task"
            >
              <Edit3 size={18} />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-2 text-[#EF5350] hover:text-[#FF7F7F]"
            title="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}