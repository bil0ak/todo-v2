import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import MagicUrl from "./pages/magicUrl/MagicUrl";
import { getAccount } from "./config/appwrite-config";
import { useState } from "react";

function App() {
  // change title
  document.title = "Todo App | By Bilal Akkil";

  const [user, setUser] = useState(null);
  const promise = getAccount();
  promise.then(
    function (response) {
      setUser(response);
    },
    function (error) {
      console.log(error);
    }
  );

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/magicURL" element={<MagicUrl />} />
    </Routes>
  );
}

export default App;
