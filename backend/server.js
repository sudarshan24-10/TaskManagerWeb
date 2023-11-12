import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./Routes/UserRouter.js";
import TaskRouter from "./Routes/TaskRouter.js";
import emailSending from "./BackGroundRunningTasks.js";
import path from "path";
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

emailSending();

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", UserRouter);

app.use("/api/v1", TaskRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server at: http://localhost:${port}`);
});
