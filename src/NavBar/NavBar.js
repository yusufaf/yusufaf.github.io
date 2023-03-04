import React, { useState, useEffect } from "react"
import {
    Link,
} from "react-router-dom";

import githubLogo from "../resources/github-logo.png"
import linkedInLogo from "../resources/linkedin.svg"
import "./NavBar.css";

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
                <a
                    href="https://www.linkedin.com/in/yusuf-afzal/"
                    target="_blank" rel="noreferrer"
                >
                    <img
                        className="linkedin-logo"
                        src={linkedInLogo}
                        alt="LinkedIn"
                        title="LinkedIn"
                    />

                </a>
            </ul>

            {/* <hr /> */}
        </div>


    );
}

export default NavBar;
