/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  writeTodoData,
  removeTodo,
  updateTodo,
  updateTodoStatus,
  getAccount,
  logout,
  getTodoData,
  todoSubscribe,
} from "../../config/appwrite-config";
import "./home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  // const auth = getAuth();
  useEffect(() => {
    async function getUser() {
      const promise = getAccount();
      promise.then(
        function (response) {
          setUser(response);
        },
        function (error) {
          window.location.href = "/login";
        }
      );
    }
    getUser();
  }, []);

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getTodoData();
      if (data.documents) {
        setData(data.documents);
      }
    };
    user && getData();
  }, [user]);

  const getData = async () => {
    const data = await getTodoData();
    if (data.documents) {
      setData(data.documents);
    }
  };

  function subscribe() {
    todoSubscribe((payload) => {
      switch (payload.events[1]) {
        case "databases.*.collections.*.documents.*.create":
          getData();
          break;
        case "databases.*.collections.*.documents.*.delete":
          getData();
          break;
        case "databases.*.collections.*.documents.*.update":
          getData();
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    subscribe();
  }, []);

  const handleDeleteBtnClick = (e, id) => {
    e.preventDefault();
    let confirmation = window.confirm("Are you sure you want to delete this?");
    if (confirmation) {
      removeTodo(id);
    }
  };

  const handleUpdateBtnClick = (e, id, title) => {
    e.preventDefault();
    let newTitle = window.prompt("Enter new title", title);
    if (newTitle) {
      updateTodo(id, {
        title: newTitle,
      });
    }
  };
  const handleTodoCheckboxClick = (e, id, completed) => {
    e.preventDefault();
    updateTodoStatus(id, !completed);
  };

  const [newTodo, setNewTodo] = useState({
    title: "",
    reminderDate: null,
  });

  const handleNewTodoChange = (e) => {
    setNewTodo(
      Object.assign({}, newTodo, {
        title: e.target.value,
      })
    );
  };

  const handleAddBtnClick = (e) => {
    e.preventDefault();
    // check if object is empty
    if (newTodo.title === "" || newTodo.title === undefined) {
      return;
    }

    console.log(user);
    writeTodoData(user.$id, newTodo);
    // empty input
    setNewTodo({
      title: "",
      reminderDate: null,
    });
  };

  const handleSignOut = () => {
    const promise = logout();
    promise.then(
      function (response) {
        window.location.href = "/login";
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  };

  return (
    <div className="home">
      <h1>TODOS:</h1>
      <div className="row">
        <div className="left">
          <h2 className="user_name">
            {user && user.name} <br /> {user && user.email}
          </h2>
          <div className="add_todo_container">
            <form>
              <input
                type="text"
                onChange={(e) => handleNewTodoChange(e)}
                value={newTodo.title}
                className="add_todo_input"
                placeholder="Add Todo"
              />
              <button
                onClick={(e) => handleAddBtnClick(e)}
                className="add_todo_btn"
                type="submit"
              >
                Add Todo
              </button>
            </form>
          </div>
          <br />
          <button onClick={handleSignOut} className="sign_out_btn">
            Sign Out
          </button>
        </div>

        <div className="right">
          <ul className="todos_list">
            {data &&
              data.map((item) => (
                <li key={item.$id} className="todo_item">
                  <div
                    className="todo_item_checkbox"
                    onClick={(e) =>
                      handleTodoCheckboxClick(e, item.$id, item.completed)
                    }
                  >
                    {item.completed ? (
                      // circle check icon
                      <i className="fa fa-check-circle completed"></i>
                    ) : (
                      // circle icon
                      <i className="fa fa-circle"></i>
                    )}
                  </div>
                  <p
                    className={
                      item.completed
                        ? "todo_item_title completed"
                        : "todo_item_title"
                    }
                  >
                    {item.title}
                  </p>
                  <p className="todo_item_date">
                    {new Date(item.date).toLocaleString()}
                  </p>
                  <div className="todo_item_functions">
                    <button
                      onClick={(e) =>
                        handleUpdateBtnClick(e, item.$id, item.title)
                      }
                      className="todo_item_update"
                    >
                      <i className="fa fa-edit"></i>
                    </button>

                    <button
                      onClick={(e) => handleDeleteBtnClick(e, item.$id)}
                      className="todo_item_delete"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
