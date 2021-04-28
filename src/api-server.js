import express from "express";
import child from "child_process";
import http from "http";

import log from "./logger.js";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
let jobs = [];
setInterval(() => {
  deleteOld();
}, 1800000); //every 1/2 h

const STATUS_GENERATION_SUCCESSFUL = "generation_successful";
const STATUS_SCRIPT_FAILED = "script_failed";
const STATUS_IN_PROGRESS = "generation_in_progress";

app.get("/", function (req, res) {
  res.status(200).send(`
  <h1>API Debugging Page</h1>

  <h2>Generate a map</h2>
  <pre>/api/generateMap</pre>
  <form action="/api/generateMap" method="POST" target="_blank">
    Repo URL:
    <input type="text" name="repo" size="50" value="https://github.com/GitTerraGame/GitTerra.git"/>
    <input type="submit" />
  </form>

  <h2>Get status of map generation</h2>
  <pre>/api/mapStatus</pre>
  <form action="/api/mapStatus" method="POST" target="_blank">
    Repo URL:
    <input type="text" name="repo" size="50" value="https://github.com/GitTerraGame/GitTerra.git"/>
    <input type="submit" />
  </form>
  `);
});

app.post("/api/generateMap", function (req, res) {
  if (!req.body.repo) {
    return res.status(400).send(`Missing repo parameter`);
  }
  const repo_string = req.body.repo;

  let repo_url;
  try {
    repo_url = new URL(repo_string);
  } catch (err) {
    return res.status(400).send(`Malformed repo URL parameter`);
  }

  if (repo_url.protocol !== "https:") {
    return res
      .status(400)
      .send(`Invalid repo URL parameter (we only accept https: URLs)`);
  }

  //test condition when 2 users ask for the same repo and process is not complete
  let existing_job = jobs.find((v) => v.repo === repo_string);
  if (existing_job && !existing_job.complete) {
    return res.status(200).send(`Process already exists but not complete`);
  }

  const worker = child.spawn("node", ["./src/generateMap.js"]);
  worker.stdin.write(repo_string);
  worker.stdin.end();

  // delete old job so we can push new one into the queue
  if (existing_job) {
    jobs = jobs.filter((v) => v.repo !== repo_string);
  }

  jobs.push({
    repo: repo_string,
    timestamp: Date.now(),
    complete: false,
    status: STATUS_IN_PROGRESS,
  });

  log("stack", jobs);

  worker.on("close", function (code) {
    if (code !== 0) {
      let job = jobs.find((v) => v.repo === repo_string);
      job.complete = true;
      job.status = STATUS_SCRIPT_FAILED;
      log(`[ERROR] Running the script failed: ${code}: ${err_output}`);
    } else {
      let job = jobs.find((v) => v.repo === repo_string);
      job.complete = true;
      job.timestamp = Date.now();
      job.status = STATUS_GENERATION_SUCCESSFUL;
      log("[SUCCESS] Generated a map", output);
    }
  });

  res.status(200).send(`Building your city...`);

  let output = "";
  worker.stdout.on("data", function (data) {
    log("Chunk: ", data.toString());
    output += data;
  });
  let err_output = "";
  worker.stderr.on("data", function (data) {
    log("Error Chunk: ", data.toString());
    err_output += data;
  });
}); ///api/generateMap

app.post("/api/mapStatus", function (req, res) {
  if (!req.body.repo) {
    return res.status(400).send(`Missing repo parameter`);
  }
  const repo_string = req.body.repo;

  let repo_url;
  try {
    repo_url = new URL(repo_string);
  } catch (err) {
    return res.status(400).send(`Malformed repo URL parameter`);
  }

  if (repo_url.protocol !== "https:") {
    return res
      .status(400)
      .send(`Invalid repo URL parameter (we only accept https: URLs)`);
  }
  let job = jobs.find((v) => v.repo === repo_string);
  log("stackStatus", jobs);

  if (!job) {
    log("Can't find existing worker for the repo", repo_string);
    return res
      .status(400)
      .send(`We can't find an existing worker for ${repo_string}`);
  }

  if (job && job.status === STATUS_SCRIPT_FAILED) {
    log("status error", job.status);
    return res.status(500).send(`We had a problem generating the city`);
  }
  if (job && !job.complete) {
    log("status complete", job.complete);
    return res.status(200).send(
      JSON.stringify({
        complete: job.complete,
      })
    );
  }
  if (job && job.complete && job.status === STATUS_GENERATION_SUCCESSFUL) {
    log(
      "generation successful:",
      { complete: job.complete },
      { status: job.status }
    );
    return res.status(200).send(
      JSON.stringify({
        complete: job.complete,
        mapPageURL: "/maps/" + repo_string.replace(/https:\/\//, ""),
      })
    );
  }
}); ///api/mapStatus

function deleteOld() {
  let currentTime = Date.now();
  jobs = jobs.filter((elem) => currentTime - elem.timestamp < 1800000);
}
http.createServer(app).listen(3000, function () {
  console.log("Listening on http://localhost:3000/");
});
