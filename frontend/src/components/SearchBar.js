import { useEffect, useState } from "react";

export default function SearchBar() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDateTime]);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = currentDateTime.toLocaleDateString(undefined, options);
  const time = currentDateTime.toLocaleTimeString();
  return (
    <div className="search-bar">
      <div className="date-time">
        <div className=" ms-3 mt-2">{date}</div>
        <div className=" ms-3 mt-1">{time}</div>
      </div>
      <div className="search-box">
        <input
          className="search-input"
          type="text"
          id="search-input"
          placeholder="   search tasks"
        ></input>
      </div>
    </div>
  );
}
