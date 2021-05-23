import React, { useState } from "react";

import Intro from "./Intro";
import RepoInputForm from "./RepoInputForm";

const HomePageMenu = function () {
  const [intro, setIntro] = useState(
    document.cookie.indexOf("introshown=true") < 0
  );

  function showIntro() {
    // enable to reset cookie when intro is explicitly opened (for debugging)
    // document.cookie = "introshown=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIntro(true);
  }

  function hideIntro() {
    document.cookie = "introshown=true; path=/; max-age=" + 365 * 24 * 60 * 60;
    setIntro(false);
  }

  return (
    <div id="wholeMenu">
      <img id="logobanner" src="images/background_and_menus/logobanner.svg" />

      {intro ? <Intro onClose={hideIntro} /> : <RepoInputForm />}

      <footer>
        <div id="feedback">
          <a href="https://github.com/GitTerraGame/GitTerra/issues/new?template=feedback.md&amp;labels=feedback">
            How can we make this game better?
          </a>
        </div>
        {intro || (
          <div id="about">
            <a href="#" id="aboutlink" onClick={showIntro}>
              About Git Terra
            </a>
          </div>
        )}
      </footer>
    </div>
  );
};

export default HomePageMenu;
