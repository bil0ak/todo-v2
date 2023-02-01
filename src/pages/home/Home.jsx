/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, removeTodo, updateTodo } from "../../config/firebase-config";
import { writeTodoData } from "../../config/firebase-config";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import "./home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // eslint-disable-next-line no-unused-vars
        const uid = user.uid;
        // ...
        setUser(user);
      } else {
        // User is signed out
        // ...
        // redirect to login page
        window.location.href = "/login";
      }
    });
  }, []);

  const [data, setData] = useState([]);

  const db = getFirestore(app);

  useEffect(() => {
    const getData = async () => {
      const q = query(collection(db, "users/" + user.uid + "/todos"));
      // eslint-disable-next-line no-unused-vars
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setData(data);
      });
    };
    user && getData();
  }, [user]);

  const handleDeleteBtnClick = (e, id) => {
    e.preventDefault();
    let confirmation = window.confirm("Are you sure you want to delete this?");
    if (confirmation) {
      removeTodo(user.uid, id);
    }
  };

  const handleUpdateBtnClick = (e, id, title) => {
    e.preventDefault();
    let newTitle = window.prompt("Enter new title", title);
    if (newTitle) {
      updateTodo(user.uid, id, newTitle);
    }
  };

  const [newTodo, setNewTodo] = useState("");

  const handleNewTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddBtnClick = (e) => {
    e.preventDefault();
    if (newTodo === "") {
      return;
    }
    writeTodoData(user.uid, newTodo);
    // empty input
    setNewTodo("");
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="home">
      <h1>TODOS:</h1>
      <div className="row">
        <div className="left">
          <div className="add_todo_container">
            <form>
              <input
                type="text"
                onChange={(e) => handleNewTodoChange(e)}
                value={newTodo}
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
                <li key={item.id} className="todo_item">
                  <p className="todo_item_title">{item.title}</p>
                  <p className="todo_item_date">
                    {new Date(item.date).toLocaleString()}
                  </p>
                  <div className="todo_item_functions">
                    <button
                      onClick={(e) =>
                        handleUpdateBtnClick(e, item.id, item.title)
                      }
                      className="todo_item_update"
                    >
                      <i className="fa fa-edit"></i>
                    </button>

                    <button
                      onClick={(e) => handleDeleteBtnClick(e, item.id)}
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
