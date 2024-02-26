import React from "react";
import { func } from "prop-types";

const Intro = ({ onClose }) => (
  <div id="intro">
    <h1>Welcome Player!</h1>
    <p>GitTerra is a game for developers played by building software!</p>

    <div id="startbox">
      <a
        id="start"
        href="https://gitlab.com/explore/catalog/gitterra/GitTerra"
        target="_blank"
        rel="noreferrer"
      >
        🏗️ Start Building Your City 🏗️
      </a>
    </div>

    <p>
      Our game is in the very early stages of development with so many awesome
      features coming!
    </p>
    <p>
      Imagine cities colored based on the code language, imaging getting points
      for coding and doing non-coding tasks like submitting issues and writing
      tests and documentation, imagine ability to see how your city evolved over
      time, and so many more we can imagine together with you!
    </p>
    <p>
      Right now, you can already get a city generated based on your repository
      using a{" "}
      <a
        href="https://gitlab.com/explore/catalog/gitterra/GitTerra"
        target="_blank"
        rel="noreferrer"
      >
        CI/CD pipeline code with GitLab
      </a>
      . We are working on adding GitHub support as well.
    </p>
  </div>
);

Intro.propTypes = {
  onClose: func.isRequired,
};

export default Intro;
