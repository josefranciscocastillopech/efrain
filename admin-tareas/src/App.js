import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [task, setTask] = useState({ title: "", description: "", status: "pending" });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdateTask = () => {
    if (!task.title.trim() || !task.description.trim()) return;
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = task;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, task]);
    }
    setTask({ title: "", description: "", status: "pending" });
    setModalOpen(false);
  };

  const handleEdit = (index) => {
    setTask(tasks[index]);
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const filteredTasks = tasks.filter((t) => filter === "all" || t.status === filter);

  return (
    <div className="p-6 max-w-md mx-auto bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl rounded-lg text-white">
      <h1 className="text-3xl font-bold mb-4 text-white">Administrador de Tareas</h1>
      <select className="mb-4 p-2 border rounded bg-white text-black" onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Todas</option>
        <option value="pending">Pendientes</option>
        <option value="completed">Finalizadas</option>
      </select>
      <button className="bg-green-500 text-white p-2 rounded hover:bg-green-700 transition" onClick={() => setModalOpen(true)}>
        Agregar Tarea
      </button>
      <ul className="mt-4">
        {filteredTasks.map((t, i) => (
          <li key={i} className="p-3 border-b flex justify-between items-center bg-white text-black rounded shadow-md mt-2">
            <span className={`font-medium ${t.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>{t.title} - {t.status}</span>
            <div>
              <button className="text-yellow-500 mr-2 hover:text-yellow-700" onClick={() => handleEdit(i)}>Editar</button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(i)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      {modalOpen && createPortal(
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-black">
            <h2 className="text-lg font-bold mb-2 text-blue-600">{editingIndex !== null ? "Editar Tarea" : "Nueva Tarea"}</h2>
            <input className="border p-2 w-full mb-2 rounded" type="text" placeholder="Título" value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })} />
            <textarea className="border p-2 w-full mb-2 rounded" placeholder="Descripción" value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}></textarea>
            <select className="border p-2 w-full mb-2 rounded" value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}>
              <option value="pending">Pendiente</option>
              <option value="completed">Finalizada</option>
            </select>
            <button className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-700 transition" onClick={handleAddOrUpdateTask}>Guardar</button>
            <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700 transition" onClick={() => setModalOpen(false)}>Cancelar</button>
          </div>
        </motion.div>, document.body
      )}
    </div>
  );
};

export default TaskManager;