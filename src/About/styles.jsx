import styled from "styled-components"

export const AboutContainer = styled.div({
    background: "#1F1B24",
    marginTop: "20px",
    position: "absolute",
    left: "27vw",
    width: "45vw",
    height: "37.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
    padding: "10px 15px",
    overflowY: "auto",
});

export const AboutSection = styled.div({
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
});

export const SectionTitle = styled.div({
    display: "flex",
    color: "white",
    fontWeight: 'bold',
    "&.indented": {
        paddingLeft: "1rem",
    },
})

export const SectionContent = styled.div({
    color: "white",
    textAlign: "left",
    whiteSpace: "pre-line",
    "&.indented": {
        paddingLeft: "1rem",
    },
});

export const SectionLink = styled.a({
    color: "white",
    transition: "color 0.2s ease",
    "&:hover": {
        color: "slateblue",
    },
});