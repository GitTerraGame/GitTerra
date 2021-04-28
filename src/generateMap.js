import getStdin from "get-stdin";
import fs from "fs";
import yargs from "yargs";
import mkdirp from "mkdirp";
import { spawn } from "child_process";

import { generateMapHTML } from "./map.js";
import { getRepoData } from "./getRepoData.js";

const MIN_TILES = 10;

async function generateMap({
  repoUrl,
  host,
  owner,
  repo,
  shouldOpenInBrowser,
}) {
  try {
    let { repoData, commitsData } = await getRepoData(repoUrl, owner, repo);

    const number_of_blocks = Math.round(
      (100 *
        Math.log10(
          repoData.total.files / repoData.weight.files +
            repoData.total.lines / repoData.weight.lines +
            repoData.total.comment / repoData.weight.comment +
            repoData.total.code / repoData.weight.code +
            repoData.total.bytes / repoData.weight.bytes +
            1
        )) /
        3 +
        MIN_TILES
    );
    const dirname = "./repos/" + host + "/" + owner + "/" + repo;
    const filename = dirname + "/index.html";
    mkdirp.sync(dirname);
    if (number_of_blocks === MIN_TILES) {
      // should be build a special page with message "Your repo seems empty.
      //Start to buld your city by commiting code to your repo and come again!"
    } else {
      const mapHTML = generateMapHTML(number_of_blocks);
      fs.writeFileSync(filename, mapHTML); // alwais overwrite the filename
    }
    if (shouldOpenInBrowser) {
      const subprocess = spawn("open", [filename], {
        detached: true,
        stdio: "ignore",
      });
      subprocess.unref();
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

async function getInputArgs() {
  let repoUrl;
  if (process.stdin.isTTY) {
    const argv = yargs(process.argv.slice(2)).argv;
    repoUrl = argv.u;
  } else {
    repoUrl = await getStdin();
  }
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

  return {
    repoUrl,
    host: url.host,
    owner,
    repo,
    shouldOpenInBrowser: process.stdin.isTTY,
  };
}
async function main() {
  generateMap(await getInputArgs());
}
main();
