import { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Button from "react-bootstrap/Button";
import DatePickernew from "./customDatePicker";

import { Store } from "../Store";
export default function Carousel(props) {
  const [newDate, setdateSelector] = useState("DD");
  const [newMonth, setmonthSelector] = useState("MM");
  const [newYear, setyearSelector] = useState("YYYY");

  const [showCategory, setShowCategory] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { state } = useContext(Store);
  const [selectedTime, setSelectedTime] = useState("");
  const { user } = state;

  const [taskName, setTaskName] = useState("");
  const [taskEmail, setTaskEmail] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [taskCategory, setTaskCategory] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [validate, setvalidate] = useState(false);
  const [updateList, setUpdateList] = useState(["", ...props.newlist]);
  const handleTimeChange = (newTime) => {
    const extractedTime = newTime.$d;
    const Time = new Date(extractedTime);
    const hours = Time.getHours().toString().padStart(2, "0");
    const minutes = Time.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    setSelectedTime(formattedTime.toString());
  };
  const handleCategory = () => {
    if (showDatePicker) {
      setShowCategory(false);
      return;
    }
    setShowCategory(true);
  };

  useEffect(() => {
    console.log(props.edit);
    console.log("TaskArray", props.taskArray);
    console.log(props.showEdit);
    console.log(props.singleTask);
  }, [props.edit, props.showEdit, props.singleTask, props.taskArray]);

  const closeCategory = () => {
    if (updateList.includes(taskCategory)) {
      toast.error("Already in Category");
      setShowCategory(false);
      return;
    }

    if (!taskCategory) {
      setShowCategory(false);
      return;
    }
    setUpdateList([...updateList, taskCategory]);
    setShowCategory(false);
  };

  const handleCategoryChange = (e) => {
    setTaskCategory(e.target.value);
  };

  const handleSetDate = (date, month, year) => {
    const formattedDate = `${date.toString().padStart(2, "0")}-${(month + 1)
      .toString()
      .padStart(2, "0")}-${year}`;
    setTaskDate(formattedDate);
    setShowDatePicker(!showDatePicker);
    console.log(taskDate);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setvalidate(false);

    if (!taskDate || !selectedTime) {
      setvalidate(true);
      return;
    }

    try {
      const data = await axios.post(
        "api/v1/tasks",
        {
          taskName: taskName,
          taskDescription: taskDescription,
          taskCategory: taskCategory,
          taskDate: taskDate,
          taskTime: selectedTime,
          taskEmail: taskEmail,
        },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      if (data) {
        window.location.reload();
        props.openCarousel();
        props.successfullData();
        props.fetchListforData();
      }
    } catch (error) {
      console.log(error);
      props.showError({ message: "Something went wrong" });
    }
  };
  return (
    <div className="add-task-carousel">
      <Form className="add-task-form" onSubmit={submitHandler}>
        <Form.Group className="add-task-details" controlId="task-name">
          <Form.Label>add task name</Form.Label>
          <Form.Control
            required
            onChange={(e) => setTaskName(e.target.value)}
            type="text"
            placeholder="Enter task name"
          />
        </Form.Group>
        <Form.Group className="add-task-details" controlId="task-description">
          <Form.Label>add task description</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={2}
            placeholder="Enter description"
            onChange={(e) => setTaskDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="add-task-details" controlId="email-remainder">
          <Form.Label>add email for remainder</Form.Label>
          <Form.Control
            required
            onChange={(e) => setTaskEmail(e.target.value)}
            type="email"
            placeholder="Enter Email"
          />
        </Form.Group>

        <Form.Group className="add-task-details" controlId="task-date">
          <div style={{ display: "flex", gap: "3rem" }}>
            <div>
              <p>Add a remainder Date</p>

              <div
                onClick={() => handleSetDate(newDate, newMonth, newYear)}
                className="date-values"
              >
                {newMonth === "MM"
                  ? `${newDate}-${newMonth}-${newYear}`
                  : `${newDate}-${newMonth + 1}-${newYear}`}
              </div>

              {showDatePicker && (
                <DatePickernew
                  setdateSelector={setdateSelector}
                  setmonthSelector={setmonthSelector}
                  setyearSelector={setyearSelector}
                  setShowDatePicker={setShowDatePicker}
                  setTaskDate={setTaskDate}
                />
              )}
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    className="time-picker"
                    label="Select remainder time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        </Form.Group>
        <Form.Group></Form.Group>
        <Form.Group className="add-task-details" controlId="Category-dropdown">
          <Form.Label>Select Task Category</Form.Label>
          <Form.Control
            placeholder="Select from dropdown"
            required
            as="select"
            onChange={handleCategoryChange}
            value={taskCategory}
          >
            {updateList.map((item, i) => {
              return <option key={i}>{item}</option>;
            })}
          </Form.Control>
          <Button className="mt-2" variant="primary" onClick={handleCategory}>
            Add Category
          </Button>
          {showCategory && (
            <div className="category-carousel mt-2">
              <input
                onChange={handleCategoryChange}
                placeholder="Enter Category Name"
                type="text"
                id="category-name"
                value={taskCategory}
              ></input>
              <Button
                onClick={closeCategory}
                className="add-category-button ms-2"
                variant="secondary"
              >
                add
              </Button>
            </div>
          )}
        </Form.Group>
        <div
          style={{ display: "flex", gap: "1rem" }}
          className="mt-3 ms-5 mb-5"
        >
          {" "}
          <Button type="submit" variant="primary">
            Add
          </Button>
          <Button
            onClick={() => {
              props.openCarousel();
            }}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
        {validate && (
          <div style={{ color: "red" }}>
            One of date or time details is missing please fill
          </div>
        )}
      </Form>
    </div>
  );
}
