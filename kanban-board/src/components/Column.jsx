import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function Column({
  id,
  title,
  tasks,
  deleteTask,
  editTask,
}) {
  const { setNodeRef } = useDroppable({
    id: id, // IMPORTANT: this must match status
  });

  return (
    <div ref={setNodeRef} className="column" id={id}>
      <h2
        className={
          id === "To Do"
            ? "todo-title"
            : id === "In Progress"
            ? "progress-title"
            : "done-title"
        }
      >
        {title}
      </h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      ))}
    </div>
  );
}