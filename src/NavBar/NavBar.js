import React, { useState, useEffect } from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";

import githubLogo from "../resources/github-logo.png"
import About from "../About/About";
import Resume from "../Resume/Resume";
import "./NavBar.css";

{/* <Route path='/welcome' element={<Home/>} /> */ }
const NavBar = props => {
    return (
        <div className="nav-container">
            <ul>
                <li className="link-item">
                    <Link className="link" to="/">Home</Link>
                </li>
                <li className="link-item">
                    <Link className="link" to="/resume">Resume</Link>
                </li>
                <a
                    href="https://github.com/yusufaf"
                    target="_blank" rel="noreferrer"
                >
                    <img
                        className="github-logo"
                        src={githubLogo}
                        alt="Personal GitHub"
                        title="Personal GitHub"
                    />
                </a>
            </ul>

            {/* <hr /> */}

            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/resume" element={<Resume />} />
            </Routes>
        </div>
    );
}

export default NavBar;
