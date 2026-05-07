import { useEffect, useState } from "react";
import "./App.css";
import Column from "./components/Column";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ REQUIRED FOR DRAG TO WORK
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const addTask = () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text,
      priority,
      status: "To Do",
    };

    setTasks([...tasks, newTask]);

    setText("");
    setPriority("Medium");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const moveTask = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    moveTask(taskId, newStatus);
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1 className="title">
        <span className="line line-1">KANBAN</span>
        <span className="line line-2">TASKBOARD</span>
      </h1>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* INPUT */}
      <div className="task-form">
        <input
          type="text"
          placeholder="Enter task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button onClick={addTask}>Add Task</button>
      </div>

      {/* BOARD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          <Column
            id="To Do"
            title="To Do"
            tasks={filteredTasks.filter((t) => t.status === "To Do")}
            deleteTask={deleteTask}
            editTask={editTask}
          />

          <Column
            id="In Progress"
            title="In Progress"
            tasks={filteredTasks.filter((t) => t.status === "In Progress")}
            deleteTask={deleteTask}
            editTask={editTask}
          />

          <Column
            id="Done"
            title="Done"
            tasks={filteredTasks.filter((t) => t.status === "Done")}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        </div>
      </DndContext>
    </div>
  );
}

export default App;