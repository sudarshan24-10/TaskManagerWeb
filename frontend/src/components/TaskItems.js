export default function TaskItems(props) {
  return (
    <div className="Task-component">
      {props.taskArray.map((task) => (
        <div key={task._id} className="task-items">
          <div className="task-item-details">
            <div className="task-item">
              <p className="task-para">Task Name: </p>
              <p>{task.taskName}</p>
            </div>
            <div className="task-item">
              <p className="task-para">Task Category: </p>
              <p>{task.taskCategory}</p>
            </div>
            <div className="task-item">
              <p className="task-para">Created At: </p>
              <p>{task.createdAt}</p>
            </div>
            <div className="task-item">
              <p className="task-para">Remainder Date: </p>
              <p>{task.remainderDate}</p>
            </div>
            <div className="task-item">
              <p className="task-para">Remainder Time: </p>
              <p>{task.remainderTime}</p>
            </div>
            <div className="task-buttons">
              <button
                onClick={() => {
                  props.viewHandler(task);
                }}
                className="taskDetails-links"
              >
                View
              </button>
              {!props.isCompleted && (
                <button
                  onClick={() => {
                    props.deleteHandler(task);
                  }}
                  className="taskDetails-links"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
