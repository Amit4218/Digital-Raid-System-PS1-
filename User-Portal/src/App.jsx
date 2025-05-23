import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";

import PublicGrievanceSignUp from "./components/PublicGrievanceSignUp";
import ComplainForm from "./components/ComplainForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/public-sign-up" element={<PublicGrievanceSignUp/>}/>
        <Route path="/complains" element={<ComplainForm/>}/>
      </Routes>
    </Router>
  );
}

export default App;
