import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RaidPage from "./pages/RaidPage";
import Unplanned from "./pages/Unplanned";
import Planned from "./pages/Planned";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/raidPage" element={<RaidPage />} />
        <Route path="/unplanned-raid" element={<Unplanned />} />
        <Route path="/raid-start-form/:id" element={<Planned />} />
      </Routes>
      <ToastContainer theme="black" transition={Slide} autoClose={1000} />
    </>
  );
}

export default App;
