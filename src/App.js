import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import MagicUrl from "./pages/magicUrl/MagicUrl";

function App() {
  // change title
  document.title = "Todo App | By Bilal Akkil";
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/magicURL" element={<MagicUrl />} />
    </Routes>
  );
}

export default App;
