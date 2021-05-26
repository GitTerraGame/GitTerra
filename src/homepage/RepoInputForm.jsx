import React, { useState } from "react";
import { func } from "prop-types";

import repoURLValidator from "./repoURLValidator";

function RepoInputForm({ callback }) {
  const [valid, setValid] = useState(false);
  const [error, setError] = useState();
  const [url, setUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // URL of the repo e.g. https://github.com/GitTerraGame/GitTerra.git
    const repo = url.replace(/\.git$/, "");

    try {
      setValid(await repoURLValidator(repo));
    } catch (ex) {
      setValid(false);
      setError(ex.message);

      return;
    }

    callback(repo);
  }

  return (
    <form id="mainMenu" onSubmit={handleSubmit}>
      <img
        id="enterGitRepo"
        src="images/background_and_menus/home_page_enterGitRepo.svg"
        alt="Enter Git Repo"
      />
      <input
        onChange={(event) => setUrl(event.target.value)}
        value={url}
        type="url"
        id="repoUrl"
        required
        placeholder="https://github.com/your/repo"
      />
      <div id="error" style={{ visibility: valid ? "hidden" : "visible" }}>
        {error}
      </div>
      <input
        type="image"
        id="generateButton"
        alt="Submit"
        src="images/background_and_menus/home_page_generateButton.svg"
      />
    </form>
  );
}

RepoInputForm.propTypes = {
  callback: func.isRequired,
};

export default RepoInputForm;
