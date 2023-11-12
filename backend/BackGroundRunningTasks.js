import cron from "node-cron";
import Task from "./Models/taskModel.js";
import mailgun from "mailgun-js";

const emailSending = async () => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });
  cron.schedule("* * * * *", async () => {
    try {
      const newdate = new Date();
      newdate.setDate(newdate.getDate());
      const date = newdate.toISOString().split("T")[0];
      const time = new Date();
      time.setMinutes(time.getMinutes());

      const currentTime = time.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      const currentDate = date.split("-").reverse().join("-");
      console.log(currentTime);
      console.log(currentDate);
      const tasksToSendReminders = await Task.find({
        remainderDate: currentDate,
        remainderTime: currentTime,
        completed: false,
      });
      tasksToSendReminders.forEach(async (task) => {
        const data = {
          from: "sudarshangampa24@gmail.com",
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
    } catch (err) {
      console.log(err);
    }
  });
};

export default emailSending;
