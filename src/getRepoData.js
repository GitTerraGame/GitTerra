import fs from "fs";
import child from "child_process";
import simpleGit from "simple-git";
import fetch from "node-fetch";
import tmp from "tmp";

const GIT_TIMEOUT = 360000; //6min
const SIZE_LIMIT = 100000; //~ 100MB
const colormap_file = "./color_lang.json";
const writeLog = false;

export const getRepoData = async function (repoUrl, owner, repo) {
  let commitsData = {}; //one of 2 main obgects
  let repoData = {}; //one of 2 main obgects
  if (await isGoodRepo(owner, repo)) {
    return null;
  }
  const tempDir = createTempDirSync();
  writeLog && console.log("tempDir", tempDir);

  // clone repo and show progress
  const { GitPluginError } = simpleGit;
  const progress = ({ method, stage, progress }) => {
    writeLog &&
      console.log(`git.${method} ${stage} stage ${progress}% complete`);
  };
  const git = simpleGit({
    baseDir: tempDir,
    timeout: {
      block: GIT_TIMEOUT,
    },
    progress,
  });
  try {
    await git.clone(repoUrl, tempDir);
  } catch (error) {
    console.log(error);
    if (error instanceof GitPluginError && error.plugin === "timeout") {
      // task failed because of a timeout
      writeLog && console.log("timeout detected ");
    }
  }

  //start scc and get json results
  try {
    let scc_result = await startSCC(tempDir);
    writeLog && console.log("scc_result", scc_result);
    repoData = readSCCresults(scc_result);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
  //get commits
  try {
    let commits = await git.log(
      [
        "--date=local",
        "--reverse",
        "--no-merges",
        "--shortstat",
        "--pretty='%x40%h%x7E%x7E%cd%x7E%x7E%<(79,trunc)%f%x7E%x7E'",
      ],
      function (error) {
        if (error) {
          console.log("error:", error);
        }
      }
    );
    let tmp = commits.all[0].hash.replace(/\n/g, " ");
    let tmp1 = tmp.replace(/@/g, "\n");
    let commitsArray = tmp1.split(/\n/);
    commitsArray.shift(); //commitsArray[0] = ', so just remove it
    commitsData = readcommits(commitsArray);
    writeLog && console.log("commits", commitsData);
  } catch (error) {
    console.log(error);
    if (error instanceof GitPluginError && error.plugin === "timeout") {
      // task failed because of a timeout
      writeLog && console.log("timeout detected ");
    }
  }
  //delete tempDir recursively
  try {
    fs.rmdirSync(tempDir, { recursive: true }, (error) => {
      if (error) {
        console.error(error.message);
      } else {
        writeLog && console.log(tempDir + " was removed"); //why never log this?
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
  //retrun 2 object with repo data
  writeLog && console.log("results:", repoData);
  return { repoData, commitsData };
}; //end of getRepoData

/*               FUNCTIONS             */
function readSCCresults(scc_result) {
  const repoData = {};
  repoData.byLang = [];
  let [
    bytes,
    files,
    lines,
    codebytes,
    code,
    comment,
    blanks,
    complexity,
    wComplexity,
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  scc_result.forEach((elem) => {
    repoData.byLang.push({
      name: elem.Name,
      bytes: elem.Bytes,
      codebytes: elem.CodeBytes,
      lines: elem.Lines,
      code: elem.Code,
      comment: elem.Comment,
      blanks: elem.Blank,
      complexity: elem.Complexity,
      count: elem.Count,
      wComplexity: elem.WeightedComplexity,
      color: "default",
      rank: 0,
    }); //push
    bytes += elem.Bytes;
    files += elem.Count;
    lines += elem.Lines;
    codebytes = +elem.CodeBytes;
    code += elem.Code;
    comment += elem.Comment;
    blanks += elem.Blank;
    complexity += elem.Complexity;
    wComplexity += elem.WeightedComplexity;
  });

  repoData.total = {
    bytes: bytes,
    files: files,
    lines: lines,
    codebytes: codebytes,
    code: code,
    comment: comment,
    blanks: blanks,
    complexity: complexity,
    wComplexity: wComplexity,
  };

  repoData.weight = {
    files: 400,
    lines: 100000,
    comment: 15000,
    code: 80000,
    bytes: 4000000,
  };

  if (repoData.total.files < 1) {
    writeLog && console.log("this git is empty or incorrect!");
    //should build an empty city
  }
  const colormap = fs.readFileSync(colormap_file, "utf-8");
  let colors = JSON.parse(colormap);
  repoData.byLang.forEach((lang) => {
    if (colors[lang.name]) {
      lang.color = colors[lang.name].color;
    }
    lang.rank = Math.round((100 * lang.code) / repoData.total.code);
  });
  return repoData;
}

function readcommits(arrayOfCommits) {
  let comLog = [];
  let count = 0;
  for (let i = 0; i < arrayOfCommits.length; i++) {
    let [sha, dt, message, data] = arrayOfCommits[i].split(/~~/);
    if (sha == "") {
      continue;
    }
    count++;
    dt = new Date(dt);
    message = message.trim();
    message = message.replace(/-/g, " ");
    let [files, insertions, deletions, impact] = [0, 0, 0, 0];
    if (data.indexOf("file") > 1) {
      files = parseInt(data.match(/(\d+) file/)[1]);
    }
    if (data.indexOf("insertions") > 1) {
      insertions = parseInt(data.match(/(\d+) insertions/)[1]);
    }
    if (data.indexOf("deletions") > 1) {
      deletions = parseInt(data.match(/(\d+) deletions/)[1]);
    }
    impact = insertions - deletions;
    //maybe consider only positive or negative impact, not impact=0
    comLog.push({
      id: count,
      sha: sha,
      dt: dt,
      message: message,
      files: files,
      impact: impact,
    });
  }
  return comLog;
}

async function startSCC(tempDir) {
  return new Promise((resolve, reject) => {
    const scc_process = child.spawn("scc", ["-f", "json"], { cwd: tempDir });
    let scriptOutput = "";
    scc_process.stdout.on("data", (data) => {
      scriptOutput += data;
    });
    scc_process.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
    scc_process.on("close", (code) => {
      writeLog && console.log(`child process exited with code ${code}`);
      if (code) {
        reject(code);
      } else {
        try {
          resolve(JSON.parse(scriptOutput));
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

function createTempDirSync() {
  try {
    const tmpobj = tmp.dirSync();
    return tmpobj.name;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}
async function isGoodRepo(owner, repo) {
  try {
    const creds = fs.readFileSync("credentials.json", "utf-8");
    const token = JSON.parse(creds).token;
    let response = null;
    if (token) {
      response = await fetch(
        "https://api.github.com/repos/" + owner + "/" + repo,
        {
          method: "GET",
          headers: {
            Authorization: "token " + token,
          },
        }
      );
    } else {
      response = await fetch(
        "https://api.github.com/repos/" + owner + "/" + repo
      );
    }
    writeLog && console.log("headers:", response.headers);
    if (response.status > 200) {
      return true;
    } else {
      let json = await response.json();
      handleErrors(response);
      if (json.size > SIZE_LIMIT) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

function handleErrors(response) {
  if (!response.ok) {
    writeLog && console.log(response.statusText);
    throw new Error(response.statusText);
  }
}
