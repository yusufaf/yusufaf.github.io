import React, { useState, useEffect } from "react"

import { AboutContainer, SectionTitle, AboutSection, SectionContent, SectionLink } from "./styles";

const About = () => {
    return (
        <AboutContainer>
            <AboutSection>
                <SectionTitle>About me</SectionTitle>
                <SectionContent>
                    Hi there! My name is Yusuf Afzal. 🐨
                    {"\n"}
                    I'm a graduating senior at the University of Oregon, majoring in Computer Science.
                    {"\n"}
                    I'm currently working as a Web Development Intern at Pacific Northwest National Laboratory.
                </SectionContent>
            </AboutSection>
            <AboutSection>
                <SectionTitle>Interests</SectionTitle>
                <SectionContent>
                    <ul>
                        <li>Building scalable and maintainable software</li>
                        <li>Cloud and serverless technologies</li>
                        <li>Developing software that makes the lives of businesses and consumers easier</li>
                    </ul>
                </SectionContent>
            </AboutSection>
            <AboutSection>
                <SectionTitle>Technical Skills</SectionTitle>
                <SectionContent>
                    <ul>
                        <li><strong>Programming Languages: </strong> Python, JavaScript, TypeScript, HTML, CSS</li>
                        <li><strong>Frameworks:</strong>  React, Svelte, Vue, Node.js, Django</li>
                        <li><strong>Database:</strong> MySQL, MongoDB</li>
                        <li><strong>Tools:</strong> AWS, Git, Docker, Jira, Confluence</li>
                    </ul>
                </SectionContent>
            </AboutSection>
            <AboutSection>
                <SectionTitle>Highlighted Projects</SectionTitle>
                <SectionContent className="indented">
                    <SectionTitle><SectionLink href="">Quizaroni</SectionLink></SectionTitle>

                    Create and share study flash cards with your friends.
                </SectionContent>
                <SectionContent className="indented">
                    <SectionTitle><SectionLink href="">NBA Team Builder</SectionLink></SectionTitle>
                    Build your own NBA team and aim for the best score. Share with friends and see who can build the best team.
                </SectionContent>
            </AboutSection>
        </AboutContainer>
    );
}

export default About;