import React, { useState, useEffect } from "react"
import {
    Link,
} from "react-router-dom";

import "./About.css";
const About = props => {
    return (
        <div className="about-container">
          <div className="about-title">
              <b> About me </b>
          </div>
          <div className="about-text">
              Hi there!
              My name is Yusuf Afzal
          </div>
        </div>
    );
}

export default About;