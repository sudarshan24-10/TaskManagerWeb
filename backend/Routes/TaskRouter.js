import expressAsyncHandler from "express-async-handler";
import express from "express";
import Task from "../Models/taskModel.js";
import { isAuth } from "../utils.js";

const TaskRouter = express.Router();
TaskRouter.get(
  "/sendEmailReminders",
  expressAsyncHandler(async (req, res) => {
    try {
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const tasksToSendReminders = await Task.find({
        remainderDate: currentDate.toISOString().split("T")[0],
        remainderTime: currentTime,
        completed: false,
      });

      tasksToSendReminders.forEach(async (task) => {
        const data = {
          from: "your-email@example.com",
          to: task.remainderEmail,
          subject: "Task Reminder",
          text: `Reminder for your task: ${task.taskName}`,
        };

        mg.messages().send(data, (error, body) => {
          if (error) {
            console.error(error);
          } else {
            console.log(body);
          }
        });
      });

      res.status(200).send("Email reminders sent successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
);
TaskRouter.delete(
  "/delete/:_id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      console.log(req.params._id);
      const id = req.params._id;
      const response = await Task.findOneAndDelete({ _id: id });
      if (response) {
        res.status(200).send("Task deleted successfully");
      } else {
        res.status(404).send("Task not found");
      }

      console.log(response);
    } catch (err) {
      res.status(500).send(err);
    }
  })
);

TaskRouter.post(
  "/tasks",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const newTask = new Task({
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
        taskCategory: req.body.taskCategory,
        remainderDate: req.body.taskDate,
        remainderTime: req.body.taskTime,
        remainderEmail: req.body.taskEmail,
        user: req.user._id,
      });

      const data = await newTask.save();
      res.status(201).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  })
);

TaskRouter.get(
  "/categoryTasks",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const tasks = await Task.find({
        user: req.user._id,
        taskCategory: req.query.taskCategory,
        completed: false,
      });

      const formattedTasks = tasks.map((task) => {
        return {
          ...task._doc,
          createdAt: task.createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        };
      });

      res.status(200).send(formattedTasks);
    } catch (err) {
      res.status(500).send(err);
    }
  })
);

TaskRouter.get(
  "/taskData",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const data = await Task.distinct("taskCategory", {
        user: req.user._id,
        taskCategory: { $ne: null },
        completed: { $ne: true },
      });
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

TaskRouter.get(
  "/tasksDetails",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const data = await Task.find({ user: req.user._id, completed: false })
        .select("-updatedAt")
        .select(
          "taskName taskDescription taskCategory remainderDate remainderTime remainderEmail createdAt completed"
        );

      const formattedTasks = data.map((task) => {
        return {
          ...task._doc,
          createdAt: task.createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        };
      });
      res.status(200).send(formattedTasks);
    } catch (err) {
      res.status(500).send(err);
    }
  })
);
TaskRouter.put(
  "/tasks/update",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const updatedTask = {
        taskName: req.body.taskName,
        taskDescription: req.body.taskDescription,
        taskCategory: req.body.taskCategory,
        remainderDate: req.body.taskDate,
        remainderTime: req.body.taskTime,
        remainderEmail: req.body.taskEmail,
        user: req.user._id,
      };
      const response = await Task.findByIdAndUpdate(taskId, updatedTask, {
        new: true,
      });

      console.log(response);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err);
    }
  })
);
TaskRouter.get(
  "/completedTasks",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const date = await Task.find({ user: req.user._id })
        .select("remainderDate remainderTime")
        .exec();

      const A = date.map((x) => ({
        remainderDate: x.remainderDate,
        remainderTime: x.remainderTime,
      }));
      const dateArray = A.map((x) => {
        const [hr, min] = x.remainderTime.split(":").map(Number);
        const [day, month, year] = x.remainderDate.split("-").map(Number);
        return {
          year: year,
          month: month,
          day: day,
          hr: hr,
          min: min,
        };
      });

      const formattedDateArray = dateArray.map((x) => {
        return new Date(x.year, x.month - 1, x.day, x.hr, x.min);
      });

      const currentDate = new Date();
      const completedDateArray = formattedDateArray.filter((x) => {
        return x <= currentDate;
      });

      const newformattedDatesArray = completedDateArray.map((date) => {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        const hr = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");

        const formattedDate = `${dd}-${mm}-${yyyy}`;
        const formattedTime = `${hr}:${min}`;

        return { date: formattedDate, time: formattedTime };
      });

      await Task.updateMany(
        {
          user: req.user._id,
          remainderDate: {
            $in: newformattedDatesArray.map((item) => item.date),
          },
          remainderTime: {
            $in: newformattedDatesArray.map((item) => item.time),
          },
        },
        { $set: { completed: true } }
      );
      const data = await Task.find({ user: req.user._id, completed: true });
      const formattedTasks = data.map((task) => {
        return {
          ...task._doc,
          createdAt: task.createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        };
      });
      res.status(200).send(formattedTasks);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

export default TaskRouter;
