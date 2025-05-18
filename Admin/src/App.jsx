import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLanding from "./pages/AdminLanding";
import PlannedRaid from "./component/PlannedRaid";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<AdminLanding />} />
       
      </Routes>
    </>
  );
}

export default App;
