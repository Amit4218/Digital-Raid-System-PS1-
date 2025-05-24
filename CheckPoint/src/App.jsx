import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import ErrorBoundary from './Components/ ErrorBoundary'
import Complains from "./Pages/Complains";
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Add more routes as needed */}
            <Route path="/complains" element={<Complains/>} />

          </Routes>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

export default App;
