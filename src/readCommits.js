import getStdin from "get-stdin";

import log from "./logger.js";

async function readcommits() {
  let comLog = [];
  const commits = await getStdin();
  let lines = commits.split(/\n/);
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    let [sha, dt, message, data] = lines[i].split(/~~/);
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
  log("from comLog:", comLog.length);
  return comLog;
}
readcommits();
