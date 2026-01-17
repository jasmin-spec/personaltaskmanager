import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    api.get("/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.log(err));
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await api.post("/tasks", { title });
    setTasks([...tasks, res.data]);
    setTitle("");
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  const saveEdit = async () => {
    const res = await api.put(`/tasks/${editingId}`, { title: editingTitle });
    setTasks(tasks.map(task => (task._id === editingId ? res.data : task)));
    setEditingId(null);
    setEditingTitle("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const toggleComplete = async (task) => {
    const res = await api.put(`/tasks/${task._id}`, {
      completed: !task.completed,
    });
    setTasks(tasks.map(t => (t._id === task._id ? res.data : t)));
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Task Manager
        </h1>
        <button
          onClick={logout}
          className="text-sm text-red-500 font-semibold hover:underline"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          My Tasks
        </h2>

        {/* Add Task */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-6 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">
            No tasks added yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map(task => (
              <li
                key={task._id}
                className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg hover:shadow-sm transition"
              >
                {editingId === task._id ? (
                  <>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="flex gap-3 ml-3">
                      <button
                        onClick={saveEdit}
                        className="text-green-600 font-semibold hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500 font-semibold hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span
                        className={`text-gray-800 ${
                          task.completed
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditing(task)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-red-500 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
