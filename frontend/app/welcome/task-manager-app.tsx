import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, CheckCircle, Moon, Sun } from 'lucide-react';

// Configuración de la API (simula variables de entorno)
const API_BASE_URL = 'http://localhost:3005/api';

// Hook personalizado para manejar las llamadas a la API
const useTaskAPI = () => {
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Error fetching tasks');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const createTask = async (taskText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskText }),
      });
      if (!response.ok) throw new Error('Error creating task');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const updateTask = async (id, taskText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskText }),
      });
      if (!response.ok) throw new Error('Error updating task');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting task');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  return { fetchTasks, createTask, updateTask, deleteTask };
};

// Componente TaskForm
const TaskForm = ({ onSubmit, onCancel, initialValue = '', isEditing = false }) => {
  const [taskText, setTaskText] = useState(initialValue);

  const handleSubmit = () => {
    if (taskText.trim()) {
      onSubmit(taskText.trim());
      if (!isEditing) {
        setTaskText('');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isEditing ? "Editar tarea..." : "Agregar nueva tarea..."}
          className="flex-1 px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          {isEditing ? <Save size={18} /> : <Plus size={18} />}
          {isEditing ? 'Guardar' : 'Agregar'}
        </button>
        {isEditing && (
          <button
            onClick={onCancel}
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// Componente TaskItem
const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [id, text] = task;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (newText) => {
    try {
      await onUpdate(id, newText);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
        <TaskForm
          onSubmit={handleSave}
          onCancel={handleCancel}
          initialValue={text}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 p-4 transition-all hover:shadow-md group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-slate-700 dark:text-slate-200 font-medium">{text}</span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Editar tarea"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar tarea"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente TaskList
const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">¡Sin tareas pendientes!</h3>
        <p className="text-slate-500 dark:text-slate-400">Agrega una nueva tarea para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Tareas ({tasks.length})
      </h2>
      {tasks.map((task) => (
        <TaskItem
          key={task[0]}
          task={task}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
        />
      ))}
    </div>
  );
};

// Componente principal de la aplicación
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const api = useTaskAPI();

  // Efecto para manejar el tema oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await api.fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Error al cargar las tareas. Asegúrate de que el servidor esté ejecutándose.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskText) => {
    try {
      await api.createTask(taskText);
      await loadTasks(); // Recargar la lista
    } catch (err) {
      setError('Error al crear la tarea');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (id, taskText) => {
    try {
      await api.updateTask(id, taskText);
      await loadTasks(); // Recargar la lista
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      await loadTasks(); // Recargar la lista
    } catch (err) {
      setError('Error al eliminar la tarea');
      console.error('Error deleting task:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all"
              title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-600" size={20} />}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Gestor de Tareas
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Organiza y gestiona tus tareas de manera eficiente
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={loadTasks}
              className="mt-2 text-sm bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 px-3 py-1 rounded transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Formulario para crear tareas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-6">
          <TaskForm onSubmit={handleCreateTask} />
        </div>

        {/* Lista de tareas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
          <TaskList
            tasks={tasks}
            onTaskUpdate={handleUpdateTask}
            onTaskDelete={handleDeleteTask}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>Proyecto de Práctica Profesional - TypeScript + React + Express</p>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;