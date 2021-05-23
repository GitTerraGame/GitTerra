const SIZE_LIMIT = 100000; //~ 100MB

export default async function (repoUrl) {
  let owner, repo;

  const url = new URL(repoUrl);

  if (url.protocol !== "https:") {
    throw new Error("Repo URL should use https protocol");
  }

  if (url.host !== "github.com") {
    throw new Error(
      "Sorry, Git Terra only works with github.com repos for now"
    );
  }

  let matches = url.pathname.match(/^\/(.+?)\/(.+?)(\.git)?$/);
  if (matches) {
    owner = matches[1];
    repo = matches[2];
  } else {
    throw new Error("Please enter a repository homepage or *.git repo URL");
  }

  if (!(await isSupportedRepo(owner, repo))) {
    throw new Error(
      "Sorry we cannot build your city. The repo is private, does not exist or too big for us to build."
    );
  }

  return true;
}

/**
 * Checks if repos is supported, e.g. public and under the size limit
 *
 * @param string owner slug of the owning account / organization
 * @param string repo slug of the repo
 *
 * @return boolean returns true if repo is supported
 */
async function isSupportedRepo(owner, repo) {
  try {
    let response = await fetch(
      "https://api.github.com/repos/" + owner + "/" + repo
    );
    if (response.status > 200) {
      return false; // repo does not exist or private
    } else {
      let json = await response.json();
      handleHTTPError(response);
      if (json.size > SIZE_LIMIT) {
        return false; // repo is too big
      }
    }
    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

//function to handle errors in ajax fetch
function handleHTTPError(response) {
  if (!response.ok) {
    console.log(response.statusText);
    throw new Error(response.statusText);
  }
  return response;
}
