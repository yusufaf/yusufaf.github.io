import React, { useState, useEffect } from "react"
import NavBar from "./NavBar/NavBar";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import About from "./About/About";
import Resume from "./Resume/Resume";


const App = props => {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </div>
  );
}

export default App;
