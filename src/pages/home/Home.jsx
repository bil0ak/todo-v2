import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../config/firebase-config";
import { writeTodoData } from "../../config/firebase-config";
import { getDatabase, onValue, ref } from "firebase/database";

const todos = [
  {
    id: 1,
    name: "todo 1",
  },
  {
    id: 2,
    name: "todo 2",
  },
  {
    id: 3,
    name: "todo 3",
  },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
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

  const db = getDatabase();
  //   useEffect(() => {
  //     setData(todos);
  //   }, []);

  useEffect(() => {
    user &&
      onValue(ref(db, "users/" + user.uid + "/todos"), (snapshot) => {
        const data = snapshot.val();
        //   console.log(data);
        //   convert object of objects to array of objects
        const dataArr = Object.keys(data).map((key) => {
          return { ...data[key], id: key };
        });
        console.log(dataArr);
        setData(dataArr);
      });
  }, [user]);

  //   const user_todos = ref(db, "users/" + user.uid + "/todos");

  //   onValue(user_todos, (snapshot) => {
  //     const data = snapshot.val();
  //     console.log(data);
  //     setData(data);
  //   });

  const handleDeleteBtnClick = (e, id) => {
    e.preventDefault();
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const [newTodo, setNewTodo] = useState();

  const handleNewTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddBtnClick = (e) => {
    e.preventDefault();
    writeTodoData(user.uid, newTodo);
  };
  return (
    <div>
      <h1>Home</h1>
      <p>data:</p>
      <div>
        <ul>
          {data &&
            data.map((item) => (
              <li key={item.id}>
                <p>{item.title}</p>
                <p>{new Date(item.date).toLocaleString()}</p>
                <button onClick={(e) => handleDeleteBtnClick(e, item.id)}>
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
      <br />
      <input type="text" onChange={(e) => handleNewTodoChange(e)} />
      <button onClick={(e) => handleAddBtnClick(e)}>Add</button>
    </div>
  );
}
