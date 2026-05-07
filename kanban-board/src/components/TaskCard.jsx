import { useState } from "react";

import { useDraggable } from "@dnd-kit/core";

function TaskCard({
  task,
  deleteTask,
  editTask,
}) {
  const [editing, setEditing] = useState(false);

  const [newText, setNewText] = useState(task.text);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const saveEdit = () => {
    editTask(task.id, newText);
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`task-card ${task.priority.toLowerCase()}`}
    >
      <button
        className="delete-btn"
        onClick={() => deleteTask(task.id)}
      >
        X
      </button>

      {editing ? (
        <>
          <input
            value={newText}
            onChange={(e) =>
              setNewText(e.target.value)
            }
          />

          <button onClick={saveEdit}>
            Save
          </button>
        </>
      ) : (
        <p onClick={() => setEditing(true)}>
          {task.text}
        </p>
      )}

      <small>
        Priority: {task.priority}
      </small>
    </div>
  );
}

export default TaskCard;