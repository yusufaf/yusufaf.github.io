import React, { useState, useEffect } from "react"
import {
    Link,
} from "react-router-dom";

import "./About.css";
const About = props => {
    return (
        <>
        <div className="about-container">
          <div className="about-title">
              About me
          </div>
          <div className="about-text">
              Hi there!
          </div>
        </div>

        </>
    );
}

export default About;