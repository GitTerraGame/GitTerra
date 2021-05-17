import fs from "fs";
import fetch from "node-fetch";
import AdmZip from "adm-zip";

import log from "./logger.js";

const creds = fs.readFileSync("credentials.json", "utf-8");
const token = JSON.parse(creds).token;
const dir = "./"; //directory to write unzipped files, should have permission

export const getArtifacts = async function (owner, repo) {
  try {
    let artifacts = await listArtifacts(owner, repo);
    for (let i = 0; i < artifacts.length; i++) {
      await downloadArtifact(artifacts[i].url);
    }
  } catch (error) {
    log(error);
    throw new Error(error.message);
  }
};
getArtifacts("GitTerraGame", "GitTerra");

async function downloadArtifact(url) {
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "token " + token,
      },
    });
    let bf = await response.buffer();
    handleErrors(response);
    var zip = new AdmZip(bf);
    var zipEntries = zip.getEntries();
    zipEntries.forEach((entry) => {
      log(entry.entryName);
    });
    zip.extractAllTo(/*target path*/ dir, /*overwrite*/ true);
    return null;
  } catch (error) {
    log(error);
    throw new Error(error.message);
  }
}

async function listArtifacts(owner, repo) {
  try {
    let response = await fetch(
      "https://api.github.com/repos/" +
        owner +
        "/" +
        repo +
        "/actions/artifacts",
      {
        method: "GET",
        headers: {
          Authorization: "token " + token,
        },
      }
    );
    // console.log("headers:", response.headers);
    let json = await response.json();
    handleErrors(response);
    let artifacts = [];
    for (let i = 0; i < json.artifacts.length; i++) {
      if (!json.artifacts[i].expired) {
        artifacts.push({
          name: json.artifacts[i].name,
          created: json.artifacts[i].created_at,
          url: json.artifacts[i].archive_download_url,
        });
      }
    }
    return artifacts;
  } catch (error) {
    log(error);
    throw new Error(error.message);
  }
}
function handleErrors(response) {
  if (!response.ok) {
    log(response.statusText);
    throw new Error(response.statusText);
  }
}
