import React, { useState, useEffect } from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import About from "../About/About";
import Resume from "../Resume/Resume";

{/* <Route path='/welcome' element={<Home/>} /> */}
const NavBar = props => {
    return (
        <div>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/resume">Resume</Link>
                </li>
            </ul>

            <hr />

        
            <Routes>
                <Route path="/" element={<div> Hi </div>} />
                <Route path="/resume" element={<Resume/>}/>
            </Routes>
        </div>
    );
}

export default NavBar;
