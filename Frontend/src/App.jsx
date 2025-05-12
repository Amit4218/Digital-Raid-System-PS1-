import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RaidPage from "./pages/RaidPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/raidPage" element={<RaidPage />} />
      </Routes>
      <ToastContainer theme="black" transition={Slide} autoClose={1000} />
    </>
  );
}

export default App;
