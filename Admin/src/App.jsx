import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Heatmap from "./component/Heatmap";

function App() {
  return (
    <>
      {/* <Routes>
        <Route path="/" element={<Login />} />
      </Routes> */}
      <Heatmap />
    </>
  );
}

export default App;
