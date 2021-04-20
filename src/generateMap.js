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
    let checkObj = await getRepoData(repoUrl, owner, repo);
    if (!checkObj) {
      return false;
    }
    let { repoData, commitsData } = checkObj;
    //    console.log(repoData);
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
  let matches = repoUrl.match(/^https:\/\/(.+?)\/(.+?)\/(.+?)$/);
  return {
    repoUrl,
    host: matches[1],
    owner: matches[2],
    repo: matches[3],
    shouldOpenInBrowser: process.stdin.isTTY,
  };
}
async function main() {
  generateMap(await getInputArgs());
}
main();
