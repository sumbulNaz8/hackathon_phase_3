'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
  priority?: number;
}

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { name: 'All' },
    { name: 'Work' },
    { name: 'Personal' },
    { name: 'Urgent' },
  ];

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8002/tasks');
        if (response.ok) {
          const data = await response.json();
          const tasksWithDates = data.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }));
          setTasks(tasksWithDates);
        } else {
          setTasks([
            { id: '1', title: 'Complete project proposal', completed: false, createdAt: new Date(), category: 'Work' },
            { id: '2', title: 'Schedule team meeting', completed: true, createdAt: new Date(Date.now() - 86400000), category: 'Work' },
            { id: '3', title: 'Review documentation', completed: false, createdAt: new Date(Date.now() - 172800000), category: 'Urgent' },
          ]);
        }
      } catch (error) {
        setTasks([
          { id: '1', title: 'Complete project proposal', completed: false, createdAt: new Date(), category: 'Work' },
          { id: '2', title: 'Schedule team meeting', completed: true, createdAt: new Date(Date.now() - 86400000), category: 'Work' },
          { id: '3', title: 'Review documentation', completed: false, createdAt: new Date(Date.now() - 172800000), category: 'Urgent' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;

    const newTaskObj: Task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      completed: false,
      createdAt: new Date(),
      category: 'Personal',
    };

    try {
      const response = await fetch('http://127.0.0.1:8002/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask.trim() }),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([createdTask, ...tasks]);
      } else {
        setTasks([newTaskObj, ...tasks]);
      }
    } catch (error) {
      setTasks([newTaskObj, ...tasks]);
    }

    setNewTask('');
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t);
    setTasks(updatedTasks);

    try {
      const response = await fetch(`http://127.0.0.1:8002/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: updatedTask.completed }),
      });

      if (!response.ok) {
        setTasks(tasks);
      }
    } catch (error) {
      setTasks(tasks);
    }
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);

    try {
      const response = await fetch(`http://127.0.0.1:8002/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setTasks([...updatedTasks, task]);
      }
    } catch (error) {
      setTasks([...updatedTasks, task]);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div>
      <div>
        <div>
          <div>☕</div>
          <h1>Task Manager</h1>
        </div>

        <div>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/tasks">Tasks</a>
          <a href="/analytics">Analytics</a>
          <a href="/settings">Settings</a>
        </div>
      </div>

      <div>
        <div>
          <h2>Elegant Task Management</h2>
          <p>Organize your tasks</p>
        </div>

        <div>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="What needs to be done today?"
          />
          <button onClick={addTask}>Add Task</button>

          <div>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div>
            <p>Total Tasks: {tasks.length}</p>
          </div>
          <div>
            <p>Completion: {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</p>
          </div>
          <div>
            <p>Productivity: {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}/100</p>
          </div>
        </div>

        <div>
          <div>
            <div></div>
            <div>Task</div>
            <div>Category</div>
            <div>Date</div>
            <div>Actions</div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : filteredTasks.length === 0 ? (
            <div>No tasks found. Add a new task to get started!</div>
          ) : (
            <div>
              {filteredTasks.map((task) => (
                <div key={task.id}>
                  <div>
                    <button onClick={() => toggleTaskCompletion(task.id)}>
                      {task.completed ? '✓' : '○'}
                    </button>
                  </div>
                  <div>{task.title}</div>
                  <div>{task.category || 'Uncategorized'}</div>
                  <div>{formatDate(task.createdAt)}</div>
                  <div>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer>
        <p>© {new Date().getFullYear()} Task Manager.</p>
      </footer>
    </div>
  );
};

export default TaskDashboard;
