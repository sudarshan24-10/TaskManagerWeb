import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    taskCategory: { type: String, required: true },
    taskDescription: { type: String, required: true },
    remainderDate: { type: String, required: true },
    remainderTime: { type: String, required: true },
    remainderEmail: { type: String, required: true, defaultField: "email" },
    completed: { type: Boolean, default: "false" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      reference: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ taskName: 1, user: 1 }, { unique: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
