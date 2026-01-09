import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);

  // add task fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [status, setStatus] = useState("NOT_STARTED");

  // filters
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [activePriority, setActivePriority] = useState("ALL");

  // edit mode
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // dropdown
  const [menuOpen, setMenuOpen] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) window.location.href = "/";
    fetchTodos();
  }, []);

  
  // 🔥 AUTO-MISS HELPER (SAFE)
const autoMissTodos = async (todosList) => {
  const today = new Date().toISOString().split("T")[0];

  for (const todo of todosList) {
    if (
      todo.deadline &&
      todo.deadline < today &&
      todo.status !== "DONE" &&
      todo.status !== "MISSED"
    ) {
      await api.put(
        `/todos/${todo.id}`,
        { ...todo, status: "MISSED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  }
};


 const fetchTodos = async () => {
  const res = await api.get("/todos", {
    headers: { Authorization: `Bearer ${token}` },
  });

  // 🔥 auto-miss expired todos
  await autoMissTodos(res.data);

  // re-fetch updated list
  const updated = await api.get("/todos", {
    headers: { Authorization: `Bearer ${token}` },
  });

  setTodos(updated.data);
};


  // ADD TODO
  const addTodo = async () => {
    if (!title || !description || !deadline) {
      alert("Fill all fields");
      return;
    }

    await api.post(
      "/todos",
      { title, description, deadline, priority, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    setDescription("");
    setDeadline("");
    setPriority("NORMAL");
    setStatus("NOT_STARTED");
    fetchTodos();
  };

  // DELETE
  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTodos();
  };

  // UPDATE
  const updateTodo = async (todo, updates) => {
    await api.put(
      `/todos/${todo.id}`,
      { ...todo, ...updates },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMenuOpen(null);
    fetchTodos();
  };

  // EDIT
  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditData({
      title: todo.title,
      description: todo.description,
      deadline: todo.deadline,
      status: todo.status,
      priority: todo.priority,
    });
  };

  const saveEdit = async (todo) => {
    await api.put(
      `/todos/${todo.id}`,
      { ...todo, ...editData },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditId(null);
    setEditData({});
    fetchTodos();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // FILTER LOGIC
  const filteredTodos = todos.filter((todo) => {
    if (activeStatus !== "ALL" && todo.status !== activeStatus) return false;
    if (activePriority !== "ALL" && todo.priority !== activePriority)
      return false;
    return true;
  });

  // STATS
  const stats = {
    done: todos.filter((t) => t.status === "DONE").length,
    missed: todos.filter((t) => t.status === "MISSED").length,
    pending: todos.filter(
      (t) =>
        t.status === "NOT_STARTED" || t.status === "IN_PROGRESS"
    ).length,
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>TodoApp</h2>

        <h4>Status</h4>
        {["ALL", "NOT_STARTED", "IN_PROGRESS", "DONE", "MISSED"].map((s) => (
          <p
            key={s}
            className={activeStatus === s ? "active" : ""}
            onClick={() => setActiveStatus(s)}
          >
            {s}
          </p>
        ))}

        <h4>Priority</h4>
        {["ALL", "URGENT", "NORMAL", "LATER"].map((p) => (
          <p
            key={p}
            className={activePriority === p ? "active" : ""}
            onClick={() => setActivePriority(p)}
          >
            {p}
          </p>
        ))}
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <h2>Your Tasks</h2>
          <button onClick={logout}>Logout</button>
        </div>

        {/*  STATS */}
        <div className="stats">
          <div className="stat-card done">
            <h3>{stats.done}</h3>
            <p>Done</p>
          </div>

          <div className="stat-card pending">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>

          <div className="stat-card missed">
            <h3>{stats.missed}</h3>
            <p>Missed</p>
          </div>
        </div>

        {/* ADD TASK */}
        <div className="todo-form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            {/* <option value="DONE">Done</option>
            <option value="MISSED">Missed</option> */}
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="URGENT">Urgent</option>
            <option value="NORMAL">Normal</option>
            <option value="LATER">Later</option>
          </select>

          <button onClick={addTodo}>Add Task</button>
        </div>

        {/* TODOS */}
        {filteredTodos.length === 0 ? (
          <div className="empty">No tasks found</div>
        ) : (
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div className="todo-card" key={todo.id}>
                <div className="todo-header">
                  {editId === todo.id ? (
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                    />
                  ) : (
                    <h4>{todo.title}</h4>
                  )}
                  <span onClick={() => setMenuOpen(todo.id)}>⋮</span>
                </div>

                {editId === todo.id ? (
                  <>
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                    />

                    <input
                      type="date"
                      value={editData.deadline}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          deadline: e.target.value,
                        })
                      }
                    />

                    <select
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                      <option value="MISSED">Missed</option>
                    </select>

                    <select
                      value={editData.priority}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="URGENT">Urgent</option>
                      <option value="NORMAL">Normal</option>
                      <option value="LATER">Later</option>
                    </select>
                  </>
                ) : (
                  <>
                    <p>{todo.description}</p>
                    <small>Deadline: {todo.deadline}</small>

                    <div className="meta">
                      <span
                        className={`priority ${todo.priority.toLowerCase()}`}
                      >
                        {todo.priority}
                      </span>
                      <span className="status">{todo.status}</span>
                    </div>
                  </>
                )}

                <div className="actions">
                  {editId === todo.id ? (
                    <button onClick={() => saveEdit(todo)}>Save</button>
                  ) : (
                    <>
                      {todo.status !== "DONE" && (
                        <button
                          onClick={() =>
                            updateTodo(todo, { status: "DONE" })
                          }
                        >
                          Mark Done
                        </button>
                      )}
                      <button onClick={() => startEdit(todo)}>Update</button>
                      <button
                        className="delete"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

                {menuOpen === todo.id && editId !== todo.id && (
                  <div className="dropdown">
                    <p>Status</p>
                    {["NOT_STARTED", "IN_PROGRESS", "DONE", "MISSED"].map(
                      (s) => (
                        <span
                          key={s}
                          onClick={() => updateTodo(todo, { status: s })}
                        >
                          {s}
                        </span>
                      )
                    )}

                    <p>Priority</p>
                    {["URGENT", "NORMAL", "LATER"].map((p) => (
                      <span
                        key={p}
                        onClick={() => updateTodo(todo, { priority: p })}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
