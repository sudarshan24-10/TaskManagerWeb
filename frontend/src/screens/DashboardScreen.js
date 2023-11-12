import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import SearchBar from "../components/SearchBar";
import Button from "react-bootstrap/Button";
import Carousel from "../components/Carousel";
import { toast } from "react-toastify";
import { Store } from "../Store";
import axios from "axios";
import TaskItems from "../components/TaskItems";
import ViewComponent from "../components/ViewComponent";
import Stack from "@mui/material/Stack";
import { Pagination } from "@mui/material";

export default function DashboardScreen() {
  const [showList, setShowList] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [taskArray, setTaskArray] = useState([]);
  const [newlist, setNewList] = useState([]);
  const [showView, setShowView] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user, allTasks, taskToday, taskTomorrow, weekTasks } = state;
  const [currentPage, setCurrentPage] = useState(1);

  const [taskView, setTaskView] = useState({});

  const openCarousel = () => {
    setShowCarousel(!showCarousel);
  };

  const viewHandler = (task) => {
    setTaskView(task);
    setShowView(!showView);
  };

  useEffect(() => {
    const fetchtask = async () => {
      try {
        const tasksData = await axios.get("/api/v1/tasksDetails", {
          headers: { authorization: `Bearer ${user.token}` },
        });
        ctxDispatch({ type: "SET_ALLTASKS", payload: tasksData.data });
        ctxDispatch({ type: "TASK_TODAY" });
        ctxDispatch({ type: "TASK_TOMORROW" });
        ctxDispatch({ type: "ALL_7DAY_TASKS" });
        console.log("datafetch sucessfull");
      } catch (err) {
        toast.error(err.message.data);
      }
    };

    fetchtask();
  }, [ctxDispatch, user]);

  const fetchListforData = async () => {
    try {
      const response = await axios.get("/api/v1/taskData", {
        headers: { authorization: `Bearer ${user.token}` },
      });

      const data = response.data;
      console.log(response.data);
      setNewList(data);
    } catch (err) {
      toast.error(err.message.data);
    }
  };

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const response = await axios.get("/api/v1/taskData", {
          headers: { authorization: `Bearer ${user.token}` },
        });

        const data = response.data;
        console.log(response.data);
        setNewList(data);
      } catch (err) {
        toast.error(err.message.data);
      }
    };
    fetchListData();
  }, [ctxDispatch, user]);

  const fetchTaskListData = async (listItem) => {
    try {
      const response = await axios.get("/api/v1/categoryTasks", {
        headers: { authorization: `Bearer ${user.token}` },
        params: {
          taskCategory: listItem,
        },
      });
      console.log(response.data);
      setTaskArray(response.data);
    } catch (err) {
      toast.error(err.message.data);
    }
  };

  const toggleList = () => {
    setIsCompleted(false);
    setShowList(!showList);
  };

  const completeHandler = async () => {
    try {
      const response = await axios.get("/api/v1/completedTasks", {
        headers: { authorization: `Bearer ${user.token}` },
      });
      setTaskArray(response.data);
      setIsCompleted(true);
    } catch (err) {
      toast.error(err.message.data);
    }
  };

  const itemsPerPage = 3;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentList = newlist.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(newlist.length / itemsPerPage);

  const paginationItemsArray = [];

  for (let number = 1; number <= totalPages; number++) {
    paginationItemsArray.push(number);
  }

  const successfullData = () => {
    toast.success("task added successfully");
  };

  const showError = (data) => {
    toast.error(data.message);
  };

  const deleteHandler = async (task) => {
    console.log(task);
    try {
      console.log("...deletehandler");
      const response = await axios.delete(`/api/v1/delete/${task._id}`, {
        headers: { authorization: `Bearer ${user.token}` },
      });
      if (response) {
        await window.location.reload();
        toast.success("task deleted successfully");
      } else {
        toast.error("Task not Deleted");
      }
    } catch (err) {
      toast.error(err.data);
    }
  };

  return (
    <div className="custom-dashboard">
      <Helmet>
        <title>dashboard</title>
      </Helmet>
      <div className="sidebar">
        <div
          onClick={() => {
            setTaskArray(allTasks);
            setIsCompleted(false);
          }}
          className="sidebar-item"
        >
          All
        </div>
        <div
          onClick={() => {
            setTaskArray(taskToday);
            setIsCompleted(false);
          }}
          className="sidebar-item"
        >
          Today
        </div>
        <div
          onClick={() => {
            setTaskArray(taskTomorrow);
            setIsCompleted(false);
          }}
          className="sidebar-item"
        >
          Tomorrow
        </div>
        <div
          onClick={() => {
            setTaskArray(weekTasks);
            setIsCompleted(false);
          }}
          className="sidebar-item"
        >
          All 7 days
        </div>
        <div className="sidebar-item">
          <div className="sidebar-item-list">
            <div className="List-div" onClick={toggleList}>
              <p>Task Category</p>

              <div className="Font-icon">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`dropdown-icon ${showList ? "rotate" : ""} `}
                />
              </div>
            </div>

            {showList && (
              <div className="list-items">
                {currentList.map((listItems, index) => {
                  return (
                    <div className="list-item" key={index}>
                      <p
                        onClick={() => {
                          fetchTaskListData(listItems);
                        }}
                      >
                        {listItems}
                      </p>
                    </div>
                  );
                })}
                <div className="pagination-container">
                  <Stack spacing={2}>
                    <Pagination
                      count={paginationItemsArray.length}
                      onChange={(event, page) => setCurrentPage(page)}
                    />
                  </Stack>
                </div>
              </div>
            )}
          </div>
        </div>

        <div onClick={completeHandler} className="sidebar-item">
          Completed
        </div>
      </div>
      <div className="Task-List">
        <div className="nav-task-list">
          <SearchBar></SearchBar>

          <Button onClick={openCarousel} className="add-task">
            + add task
          </Button>
        </div>

        {showCarousel && (
          <div className="carousel-container">
            <Carousel
              fetchListforData={fetchListforData}
              taskArray={taskArray}
              showCarousel={showCarousel}
              newlist={newlist}
              successfullData={successfullData}
              showError={showError}
              openCarousel={openCarousel}
            ></Carousel>
          </div>
        )}

        <div className="Body-taskItems">
          {taskArray.length === 0 && (
            <div className="empty-Taskitems">
              <h3>Please select an option from left menu to display tasks</h3>
            </div>
          )}
          {taskArray.length !== 0 && (
            <TaskItems
              viewHandler={viewHandler}
              isCompleted={isCompleted}
              setIsCompleted={setIsCompleted}
              deleteHandler={deleteHandler}
              taskArray={taskArray}
            ></TaskItems>
          )}
        </div>
      </div>
      {showView && (
        <ViewComponent
          setShowView={setShowView}
          taskView={taskView}
        ></ViewComponent>
      )}

      <Footer></Footer>
    </div>
  );
}
