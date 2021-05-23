import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

ReactDOM.render(
  <div id="wholeMenu">
    <img id="logobanner" src="images/background_and_menus/logobanner.svg" />

    <div id="intro">
      <h1>Welcome Player!</h1>
      <p>GitTerra is a game for developers played by building software!</p>

      <div id="startbox">
        <button id="start">🏗️ Start Building Your City 🏗️</button>
      </div>

      <p>
        Our game is in the very early stages of development with so many awesome
        features coming!
      </p>
      <p>
        Imagine cities colored based on the code language, imaging getting
        points for coding and doing non-coding tasks like submitting issues and
        writing tests and documentation, imagine ability to see how your city
        evolved over time, and so many more we can imagine together with you!
      </p>
      <p>
        Right now, you can already get a city generated based on your
        repository, just enter the URL of the public code repository on GitHub
        and the city will rise!
      </p>
    </div>

    <form id="mainMenu">
      <img
        id="enterGitRepo"
        src="images/background_and_menus/home_page_enterGitRepo.svg"
        alt="Enter Git Repo"
      />
      <input
        type="url"
        id="repoUrl"
        name="repoUrl"
        required
        placeholder="https://github.com/your/repo"
      />
      <div id="error">Repo URL seems to be valid!</div>
      <input
        type="image"
        id="generateButton"
        alt="Submit"
        src="images/background_and_menus/home_page_generateButton.svg"
      />
    </form>

    <footer>
      <div id="feedback">
        <a href="https://github.com/GitTerraGame/GitTerra/issues/new?template=feedback.md&labels=feedback">
          How can we make this game better?
        </a>
      </div>
      <div id="about">
        <a href="#" id="aboutlink">
          About Git Terra
        </a>
      </div>
    </footer>
  </div>,
  document.getElementById("gitterra-app")
);
