import { createContext, useReducer } from "react";

export const Store = createContext();

const initalState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,

  allTasks: localStorage.getItem("allTasks")
    ? localStorage.getItem("allTasks")
    : [],

  taskToday: localStorage.getItem("taskToday")
    ? localStorage.getItem("taskToday")
    : [],

  taskTomorrow: localStorage.getItem("taskTomorrow")
    ? localStorage.getItem("taskTomorrow")
    : [],
  weekTasks: localStorage.getItem("weekTasks")
    ? localStorage.getItem("weekTasks")
    : [],
};

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");

  return new Date(year, month - 1, day);
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SIGNOUT":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
      };
    case "SET_ALLTASKS":
      localStorage.setItem("allTasks", action.payload);
      return {
        ...state,
        allTasks: action.payload,
      };
    case "TASK_TODAY":
      let currentDateToday = new Date();
      const formattedDate = `${currentDateToday
        .getDate()
        .toString()
        .padStart(2, "0")}-${(currentDateToday.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${currentDateToday.getFullYear()}`;

      const newtaskToday = state.allTasks.filter(
        (task) => task.remainderDate === formattedDate
      );

      localStorage.setItem("taskToday", newtaskToday);

      return {
        ...state,
        taskToday: newtaskToday,
      };
    case "TASK_TOMORROW":
      let currentDate = new Date();
      let tomorrowFormattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${currentDate.getFullYear()}`;
      if (currentDate.getDate() === 31 && currentDate.getMonth() === 11) {
        tomorrowFormattedDate = "01-01-2024";
      } else if (currentDate.getDate() === 31 || currentDate.getDate() === 30) {
        tomorrowFormattedDate = `01-${(currentDate.getMonth() + 2)
          .toString()
          .padStart(2, "0")}-${currentDate.getFullYear()}`;
      } else {
        tomorrowFormattedDate = `${(currentDate.getDate() + 1)
          .toString()
          .padStart(2, "0")}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${currentDate.getFullYear()}`;
      }

      const newtaskTomorrow = state.allTasks.filter(
        (task) => task.remainderDate === tomorrowFormattedDate
      );
      localStorage.setItem("taskTomorrow", newtaskTomorrow);
      return {
        ...state,
        taskTomorrow: newtaskTomorrow,
      };

    case "ALL_7DAY_TASKS": {
      const current7Day = new Date();

      const next7DaysTasks = state.allTasks.filter((task) => {
        const taskDate = parseDate(task.remainderDate);
        const timeDiff = Math.abs(taskDate - current7Day);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 6;
      });
      localStorage.setItem("weekTasks", next7DaysTasks);
      return {
        ...state,
        weekTasks: next7DaysTasks,
      };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initalState);

  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
