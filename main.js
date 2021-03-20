import fetch from "node-fetch";
import yargs from "yargs";
import fs from "fs";
import { spawn } from "child_process";

import { generateMapHTML } from "./map.js";

let GHData = {}; // global object to keep all data collected on given Git
const regexHTTPS = /^https:\/\/github\.com\/(.+?)\/(.+?)\.git$/;
const regexSSH = /^git@github\.com:(.+?)\/(.+?)\.git$/;
const regexURL = /^https:\/\/github\.com\/(.+?)\/(.+?)$/;
async function main() {
  checkInput();
  await getGitHubData();
  //  console.log(GHData);
  const mapHTML = generateMapHTML(GHData.lines);
  try {
    fs.writeFileSync("./map.html", mapHTML);
    const subprocess = spawn("open", ["map.html"], {
      detached: true,
      stdio: "ignore",
    });
    subprocess.unref();
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
main();
//          FUNCTIONS

/**
 * to get data from github API
 * @return bolean or exit with error code
 */
async function getGitHubData() {
  let lines = await countLinesGithub(GHData.owner, GHData.repo);
  let files = await countFilesGithub(GHData.owner, GHData.repo);
  let reposize = await getRepoSize(GHData.owner, GHData.repo);
  GHData.lines = lines;
  GHData.files = files;
  GHData.size = reposize;
}
/**
 * to count lines using API call
 *  @param string owner, repo owner
 *  @param string repo, repo name
 * @return int number of lines
 */
async function countLinesGithub(owner, repo) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/contributors`
    );
    const contributors = await response.json();
    //        console.log(contributors);
    if (response.status > 200 || !contributors || !contributors.length) {
      console.log("stats/contributors not found or empty array.");
      //      process.stdout.write("We cannot continue without lines. Exiting...\n");
      //      process.exit(1);
      return;
    } else {
      const lineCounts = contributors.map((contributor) =>
        contributor.weeks.reduce(
          (lineCount, week) => lineCount + week.a - week.d,
          0
        )
      );
      let lines = lineCounts.reduce(
        (lineTotal, lineCount) => lineTotal + lineCount
      );
      return lines;
    }
  } catch (err) {
    console.log(err);
    //    process.exit(1);
  }
}
/**
 * to count files and directories using API call
 *  @param string owner, repo owner
 *  @param string repo, repo name
 * @return int number of files and directories
 */
async function countFilesGithub(owner, repo) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/master`
    );
    const resp = await response.json();
    if (response.status > 200) {
      console.log("trees/master file not found.");
      return;
    } else {
      let files = resp.tree.length;
      return files;
    }
  } catch (err) {
    console.log(err);
  }
}
/**
 * to get repo size in KB using API call
 *  @param string owner, repo owner
 *  @param string repo, repo name
 * @return int size in KB
 */
async function getRepoSize(owner, repo) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    const json = await response.json();
    if (response.status > 200) {
      console.log("repos/ file not found.");
      return;
    } else {
      let size = json.size;
      return size;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * This function check validity of input
 * @return bolean or exit with error code
 */
function checkInput() {
  const argv = yargs(process.argv.slice(2)).argv;
  if (!argv.url) {
    printUsageToStdout();
    process.exit(9);
  }
  const gitname = argv.url;
  if (
    regexHTTPS.test(gitname) ||
    regexSSH.test(gitname) ||
    regexURL.test(gitname)
  ) {
    let gittype = getGitType(gitname);
    let gitnames = gitExrtact(gitname, gittype);
    GHData = { owner: gitnames[0], repo: gitnames[1] };
  } else {
    printUsageToStdout();
    process.exit(9);
  }
}
/**
 * This extract type of input argument
 *  @param string gitname of the input git. Only 3 types are allowed
 *  @return string git type (HTTPS, SSH or URL) or exit with error code
 */
function getGitType(gitname) {
  if (regexHTTPS.test(gitname)) {
    return "HTTPS";
  } else if (regexSSH.test(gitname)) {
    return "SSH";
  } else if (regexURL.test(gitname)) {
    return "URL";
  } else {
    printUsageToStdout();
    process.exit(9);
  }
}
/**
 * This extract type of input argument
 *  @param string gitname of the input git
 *  @param string git type (HTTPS, SSH or URL)
 *  @return array of owener and repo names
 */
function gitExrtact(gitname, gittype) {
  let match = [];
  if (gittype === "HTTPS") {
    match = gitname.match(regexHTTPS);
  } else if (gittype === "SSH") {
    match = gitname.match(regexSSH);
  } else if (gittype === "URL") {
    match = gitname.match(regexURL);
  }
  const repo = match[2];
  const owner = match[1];
  return [owner, repo];
}
/**
 * This function print Usage to stdout
 */
function printUsageToStdout() {
  process.stdout.write("Wrong number of arguments. Exiting...\n");
  process.stdout.write("USAGE: npm start -- --url <url-of-github-repo>\n");
  process.stdout.write(
    "Example: npm start -- --url https://github.com/GitTerraGame/GitTerra\n"
  );
  process.stdout.write(
    "Example: npm start -- --url git@github.com:GitTerraGame/GitTerra.git\n"
  );
  process.stdout.write(
    "Example: npm start -- --url https://github.com/GitTerraGame/GitTerra.git\n"
  );
}
/**
 * This function defines the algorythm for plotting city blocks maintaining the diamond shape.
 * The input is a sequential number of the block and the output are
 * the pair of cartesian coordinates to be later converted into isometric coordinates.
 *
 * @param {int} n positive integer representing the sequence number of the city block
 */
function getMapTileCoordinates(n) {
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("We can only draw blocks with positive integer numbers");
  }

  // primary coordinate
  const primary = Math.ceil(Math.sqrt(n));

  // secondary coordinate
  const secondary = Math.ceil((n - Math.pow(Math.floor(Math.sqrt(n)), 2)) / 2);

  if (secondary === 0) {
    // center line tile
    return { x: primary, y: primary };
  } else {
    // boolean representing the side of the diamond, e.g. left (false) or right (true)
    const direction =
      Math.ceil((n - Math.pow(Math.floor(Math.sqrt(n)), 2)) / 2) -
        Math.floor((n - Math.pow(Math.floor(Math.sqrt(n)), 2)) / 2) ===
      0;

    if (direction) {
      // append to the right
      return { x: secondary, y: primary };
    } else {
      // append to the left
      return { x: primary, y: secondary };
    }
  }
}
