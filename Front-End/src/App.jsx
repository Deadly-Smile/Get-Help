/* eslint-disable no-unused-vars */
import React from "react";
import HomePage from "./Pages/HomePage";
import About from "./Pages/About";
import NotFound from "./Pages/NotFound";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
