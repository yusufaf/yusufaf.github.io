import React, { useState, useEffect } from "react"
import {
    Link,
} from "react-router-dom";

import resumeImg from "./resume.jpg";
import "./Resume.css";

const Resume = props => {
    return (
        <div className="resume-container">
            <div className="resume-title">
                <b> Resume </b>
            </div>
            <img
                src={resumeImg}
                alt="Resume"
                className="resume-img"
            />
        </div>
    );
}


export default Resume;