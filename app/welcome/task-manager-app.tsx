import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, CheckCircle, Moon, Sun } from 'lucide-react';

// Cambiar la estructura de las tareas a objetos
interface Task {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
}

// Componente TaskForm
interface TaskFormProps {
  onSubmit: (taskText: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  isEditing?: boolean;
}
const TaskForm = ({ onSubmit, onCancel, initialValue = '', isEditing = false }: TaskFormProps) => {
  const [taskText, setTaskText] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = taskText.trim();
    if (!trimmed) {
      setError('La tarea no puede estar vacía.');
      return;
    }
    // Validación de duplicados (solo si no es edición o si el texto cambió)
    if (typeof window !== 'undefined') {
      try {
        const storedTasks = JSON.parse(window.localStorage.getItem('tasks') || '[]');
        const isDuplicate = storedTasks.some((t: any) => t[1]?.toLowerCase() === trimmed.toLowerCase());
        if (isDuplicate && (!isEditing || trimmed !== initialValue)) {
          setError('Ya existe una tarea con ese nombre.');
          return;
        }
      } catch {}
    }
    setError(null);
    onSubmit(trimmed);
    if (!isEditing) {
      setTaskText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <input
          type="text"
          value={taskText}
          onChange={(e) => { setTaskText(e.target.value); setError(null); }}
          onKeyPress={handleKeyPress}
          placeholder={isEditing ? "Editar tarea..." : "Agregar nueva tarea..."}
          className="flex-1 px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-md focus:ring-2 focus:ring-blue-400"
        >
          {isEditing ? <Save size={20} /> : <Plus size={20} />}
          {isEditing ? 'Guardar' : 'Agregar'}
        </button>
        {isEditing && (
          <button
            onClick={onCancel}
            className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors shadow-md focus:ring-2 focus:ring-gray-400"
          >
            <X size={20} />
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

// Componente TaskItem
const TaskItem = ({ task, onEdit, onDelete, onUpdate, onToggleCompleted }: { task: Task; onEdit?: () => void; onDelete: (id: number) => void; onUpdate: (id: number, newText: string) => void; onToggleCompleted: (id: number) => void; }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id, text, createdAt, updatedAt, completed } = task;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (newText: string) => {
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
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700 p-5 transition-all duration-200 hover:shadow-lg group ${completed ? 'opacity-60' : ''}`}
      style={{ boxShadow: completed ? '0 2px 8px 0 rgba(0,0,0,0.04)' : undefined }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggleCompleted(id)}
              className="accent-green-600 w-5 h-5 transition-all duration-150 focus:ring-2 focus:ring-green-400"
              title={completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            />
            <span className={`font-medium text-lg transition-all duration-150 ${completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>{text}</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 select-none">
            Creada: {new Date(createdAt).toLocaleString()}<br/>
            Actualizada: {new Date(updatedAt).toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:ring-2 focus:ring-blue-400"
            title="Editar tarea"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:ring-2 focus:ring-red-400"
            title="Eliminar tarea"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente TaskList
interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (id: number, newText: string) => void;
  onToggleCompleted: (id: number) => void;
  loading?: boolean;
  onDeleteRequest: (task: Task) => void;
}
const TaskList = ({ tasks, onTaskUpdate, onToggleCompleted, loading = false, onDeleteRequest }: TaskListProps) => {
  if (loading) return <LoadingSpinner />;
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 select-none">
        <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">¡Sin tareas!</h3>
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
          key={task.id}
          task={task}
          onUpdate={onTaskUpdate}
          onDelete={() => onDeleteRequest(task)}
          onToggleCompleted={onToggleCompleted}
        />
      ))}
    </div>
  );
};

// Notificación tipo toast
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white text-base font-medium flex items-center gap-3 transition-all animate-fade-in-down
    ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
    style={{ minWidth: 220 }}
  >
    {type === 'success' ? <CheckCircle size={22} /> : <X size={22} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 text-white/80 hover:text-white focus:outline-none">
      <X size={18} />
    </button>
  </div>
);

// Componente de carga reutilizable
const LoadingSpinner = () => (
  <div className="min-h-[200px] flex flex-col items-center justify-center py-8">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-slate-600 dark:text-slate-300 text-lg">Cargando tareas...</p>
  </div>
);

// Modal de confirmación
const ConfirmModal = ({ open, onConfirm, onCancel, taskText }: { open: boolean; onConfirm: () => void; onCancel: () => void; taskText: string }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center">
        <Trash2 size={36} className="text-red-600 mb-3" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 text-center">¿Eliminar tarea?</h2>
        <p className="text-slate-600 dark:text-slate-300 text-center mb-6">¿Seguro que deseas eliminar la tarea:<br/><span className="font-medium">"{taskText}"</span>?</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >Cancelar</button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
          >Eliminar</button>
        </div>
      </div>
    </div>
  );
};

// Componente principal de la aplicación
const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const TASKS_STORAGE_KEY = 'tasks';

  // Efecto para manejar el tema oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Cargar tareas desde LocalStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setTasks(parsed);
      } catch {}
    }
    setLoading(false);
  }, []);
  // Guardar tareas en LocalStorage cada vez que cambian
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  // Mostrar toast por unos segundos
  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

  const handleCreateTask = async (taskText: string) => {
    try {
      const now = new Date().toISOString();
      const newTask: Task = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        text: taskText,
        createdAt: now,
        updatedAt: now,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setToast({ message: 'Tarea creada exitosamente', type: 'success' });
    } catch (err) {
      setError('Error al crear la tarea');
      setToast({ message: 'Error al crear la tarea', type: 'error' });
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (id: number, taskText: string) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, text: taskText, updatedAt: new Date().toISOString() } : t));
      setToast({ message: 'Tarea actualizada exitosamente', type: 'success' });
    } catch (err) {
      setError('Error al actualizar la tarea');
      setToast({ message: 'Error al actualizar la tarea', type: 'error' });
      console.error('Error updating task:', err);
    }
  };

  // Cambiar handleDeleteTask para usar el modal
  const handleDeleteRequest = (task: Task) => {
    setTaskToDelete(task);
    setModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      setToast({ message: 'Tarea eliminada exitosamente', type: 'success' });
    }
    setModalOpen(false);
    setTaskToDelete(null);
  };
  const handleCancelDelete = () => {
    setModalOpen(false);
    setTaskToDelete(null);
  };

  // Nuevo: toggle completed
  const handleToggleCompleted = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t));
  };

  // Filtrar tareas según búsqueda y filtro
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.text ?? '').toLowerCase().includes(search.toLowerCase());
    if (filter === 'completed') return matchesSearch && task.completed;
    if (filter === 'pending') return matchesSearch && !task.completed;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal open={modalOpen} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} taskText={taskToDelete?.text || ''} />
      <div className="container mx-auto px-4 py-8 max-w-2xl sm:max-w-3xl md:max-w-4xl">
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
              onClick={() => setError(null)} // Reintentar no es necesario con LocalStorage
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tarea..."
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
            />
            {/* Filtro de estado (por ahora solo muestra 'Todas') */}
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
              className="px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">Todas</option>
              <option value="completed">Completadas</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
          <TaskList
            tasks={filteredTasks}
            onTaskUpdate={handleUpdateTask}
            onToggleCompleted={handleToggleCompleted}
            loading={loading}
            onDeleteRequest={handleDeleteRequest}
          />
          {/* Botón para descargar backup y cargar backup */}
          <div className="flex flex-col sm:flex-row justify-end items-end gap-4 mt-6">
            <button
              onClick={() => {
                // Serializar todas las tareas con todos los campos
                const dataStr = JSON.stringify(tasks, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tareas-backup.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-md focus:ring-2 focus:ring-green-400 flex items-center gap-2"
            >
              <Save size={18} /> Descargar backup
            </button>
            <label className="flex flex-col items-end gap-2 cursor-pointer">
              <span className="text-sm text-slate-600 dark:text-slate-300">Cargar backup</span>
              <input
                type="file"
                accept="application/json"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:ring-2 focus:ring-blue-400"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const loadedTasks = JSON.parse(text);
                    if (Array.isArray(loadedTasks)) {
                      setTasks(loadedTasks as Task[]);
                    } else {
                      alert('El archivo no tiene el formato correcto.');
                    }
                  } catch (err) {
                    alert('Error al cargar el archivo de backup.');
                  }
                  // Limpiar el input para permitir cargar el mismo archivo de nuevo si se desea
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>Proyecto de Práctica Profesional - TypeScript + React + Express</p>
          <p>
            Developed by {""}
            <a
              href="https://www.github.com/tomas26j"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tomás Riera
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;