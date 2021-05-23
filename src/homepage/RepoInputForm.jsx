import React, { useState } from "react";

import repoURLValidator from "./repoURLValidator";

function RepoInputForm() {
  const [valid, setValid] = useState(false);
  const [error, setError] = useState();
  const [url, setUrl] = useState("");

  async function handleSubmit(e) {
    alert("handling");
    e.preventDefault();

    const repo = url.replace(/\.git$/, ""); // case https://github.com/GitTerraGame/GitTerra.git

    try {
      await repoURLValidator(repo);
    } catch (ex) {
      setValid(false);
      setError(ex.message);

      return;
    }

    // handle map generation
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

export default RepoInputForm;
