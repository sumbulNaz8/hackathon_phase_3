// app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Task } from '@/lib/types';
import { tasksAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user, logout } = useAuth();

  // Load tasks on component mount
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const tasksData = await tasksAPI.getAll(user.id);
      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (title: string, description: string) => {
    if (!user) return;

    try {
      const newTask = await tasksAPI.create(user.id, title, description);
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (title: string, description: string) => {
    if (!user || !editingTask) return;

    try {
      const updatedTask = await tasksAPI.update(user.id, editingTask.id, title, description);
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleToggleTask = async (taskId: number) => {
    if (!user) return;

    try {
      const updatedTask = await tasksAPI.toggleComplete(user.id, taskId);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;

    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(user.id, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3E2723]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC107] mx-auto mb-4"></div>
          <p className="text-[#BCAAA4]">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3E2723] text-white">
      <Header user={user} onLogout={logout} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#FFC107] mb-2">Task Dashboard</h1>
          <p className="text-[#BCAAA4]">Organize your tasks with elegance</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Task Creation */}
          <div className="lg:col-span-1">
            <div className="bg-[#5D4037] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#FFC107]/20">
                  <Plus className="w-6 h-6 text-[#FFC107]" />
                </div>
                <h2 className="text-2xl font-bold text-[#FFC107]">Create New Task</h2>
              </div>

              <TaskForm
                onSubmit={handleCreateTask}
                submitLabel="Create Task"
              />
            </div>
          </div>

          {/* Right Column - Task List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FFC107]/20">
                  <CheckSquare className="w-6 h-6 text-[#FFC107]" />
                </div>
                <h2 className="text-2xl font-bold text-[#FFC107]">
                  Your Tasks ({tasks.length})
                </h2>
              </div>
            </div>

            <TaskList
              tasks={tasks}
              onToggle={handleToggleTask}
              onEdit={startEditing}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </main>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={cancelEditing}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            onSubmit={handleUpdateTask}
            initialTitle={editingTask.title}
            initialDescription={editingTask.description || ''}
            submitLabel="Save Changes"
            onCancel={cancelEditing}
          />
        )}
      </Modal>
    </div>
  );
}