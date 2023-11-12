import React, { useRef, useState } from "react";
import { useOutsideClick } from "../CustomHooks/useOutsideClick";
import { toast } from "react-toastify";
export default function DatePickernew(props) {
  const daysInMonth = (Year, Month) => {
    return new Date(Year, Month + 1, 0).getDate();
  };

  const [currentMonth, setcurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setcurrentYear] = useState(new Date().getFullYear());
  const datePickerRef = useRef(null);

  useOutsideClick(datePickerRef, () => {
    props.setShowDatePicker(false);
  });

  const handleDateSet = (newDate, newMonth, newYear) => {
    const formattedDate = `${newDate.toString().padStart(2, "0")}-${(
      newMonth + 1
    )
      .toString()
      .padStart(2, "0")}-${newYear}`;

    props.setTaskDate(formattedDate);
  };

  const monthArray = [
    "january",
    "febuary",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const dateArray = Array.from(
    {
      length: daysInMonth(currentYear, currentMonth),
    },
    (_, i) => i + 1
  );
  const handleNextYear = () => {
    if (currentMonth < 11) {
      setcurrentMonth(currentMonth + 1);
    } else {
      setcurrentMonth(0);
      setcurrentYear(currentYear + 1);
    }
  };
  const handlePrevYear = () => {
    if (currentYear <= new Date().getFullYear()) {
      if (currentMonth < new Date().getMonth() + 1) {
        return;
      }
    }

    if (currentMonth > 0) {
      setcurrentMonth(currentMonth - 1);
    } else {
      setcurrentMonth(11);
      setcurrentYear(currentYear - 1);
    }
  };
  const getSortedDate = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const sortedDays = [
      ...days.slice(firstDayIndex),
      ...days.slice(0, firstDayIndex),
    ];

    return sortedDays;
  };

  return (
    <div className="datePicker" ref={datePickerRef}>
      <div className="datePicker-header">
        <ion-icon onClick={handlePrevYear} name="arrow-back-outline"></ion-icon>
        <p>{`${monthArray[currentMonth]}   ${currentYear}`}</p>
        <ion-icon
          onClick={handleNextYear}
          name="arrow-forward-outline"
        ></ion-icon>
      </div>
      <div className="datePicker-body-1">
        {getSortedDate().map((day) => (
          <p className="days-row" key={day}>
            {day}
          </p>
        ))}
      </div>
      <div className="datePicker-body-2">
        {dateArray.map((date, i) => (
          <p
            onClick={() => {
              const validDate = new Date().getDate();
              toString(validDate);
              toString(date);
              if (date < validDate && currentMonth === new Date().getMonth()) {
                toast.error("Please select a current date or future date");
              } else {
                handleDateSet(date, currentMonth, currentYear);
                props.setdateSelector(date);
                props.setmonthSelector(currentMonth);
                props.setyearSelector(currentYear);

                props.setShowDatePicker(false);
              }
            }}
            key={i}
            className={
              date < new Date().getDate() &&
              currentMonth === new Date().getMonth()
                ? "not-valid-day"
                : "valid-day"
            }
          >
            {date}
          </p>
        ))}
      </div>
    </div>
  );
}
