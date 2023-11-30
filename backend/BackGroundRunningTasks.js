import cron from "node-cron";
import Task from "./Models/taskModel.js";
import mailgun from "mailgun-js";

const emailSending = async () => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });
  cron.schedule("*/20 * * * * *", async () => {
    try {
      const indianTimezone = "Asia/Kolkata";
      const newdate = new Date().toLocaleDateString("en-US", { timeZone: indianTimezone });
      const [month, day, year] = newdate.split("/").map((part) => part.padStart(2, '0'));
      const formattedDate = `${day}-${month}-${year}`;
      const currentDate = formattedDate;
      const time = new Date();
      time.setMinutes(time.getMinutes());

      const currentTime = time.toLocaleTimeString("en-US", {
        timeZone: indianTimezone,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      console.log(currentTime);
      console.log(currentDate);
      const tasksToSendReminders = await Task.find({
        remainderDate: currentDate,
        remainderTime: currentTime,
        completed: false,
      });
      console.log(tasksToSendReminders);
      const batchSize = 10;

      for (let i = 0; i < tasksToSendReminders.length; i += batchSize) {
        const batch = tasksToSendReminders.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (task) => {
            const data = {
              from: "sudarshangampa24@gmail.com",
              to: task.remainderEmail,
              subject: "Task Reminder",
              text: `Reminder for your task: ${task.taskName}`,
            };

            // Send the reminder
            await new Promise((resolve) => {
              mg.messages().send(data, (error, body) => {
                if (error) {
                  console.error(error);
                } else {
                  console.log(body);
                }
                resolve();
              });
            });

            // Mark the task as completed
            await Task.updateOne({ _id: task._id }, { completed: true });
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export default emailSending;
