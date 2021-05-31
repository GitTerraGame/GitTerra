import React, { useState } from "react";

import Intro from "./Intro";
import RepoInputForm from "./RepoInputForm";
import generateMap from "./generateMap";

const HomePageMenu = function () {
  const [intro, setIntro] = useState(
    document.cookie.indexOf("introshown=true") < 0
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState();

  function showIntro() {
    // enable to reset cookie when intro is explicitly opened (for debugging)
    // document.cookie = "introshown=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIntro(true);
  }

  function hideIntro() {
    document.cookie = "introshown=true; path=/; max-age=" + 365 * 24 * 60 * 60;
    setIntro(false);
  }

  function startGeneration(repo) {
    generateMap({
      repo,
      onGenerationStart: () => {
        setIsGenerating(true);
      },
      onGenerationSuccess: (url) => {
        window.location.href = url;
      },
      onGenerationError: (message) => {
        setGenerationError(message);
        setIsGenerating(false);
      },
    });
  }

  return isGenerating ? (
    <img src="/images/background_and_menus/site_loading_animated.svg" />
  ) : (
    <div id="wholeMenu">
      <img id="logobanner" src="images/background_and_menus/logobanner.svg" />

      {intro ? (
        <Intro onClose={hideIntro} />
      ) : (
        <RepoInputForm
          callback={startGeneration}
          initialError={generationError}
        />
      )}

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
