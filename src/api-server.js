import express from "express";
import child from "child_process";
import http from "http";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
let stack = [];
setInterval(() => {
  deleteOld();
}, 1800000); //every 1/2 h

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
  //test condition when 2 users ask for the same repo and proces is not complete
  let process_exists = stack.find((v) => v.repo === repo_string);
  if (process_exists && !process_exists.complete) {
    return res.status(200).send(`Process already exists but not complete`);
  }
  const generator = child.spawn("bash", ["./generateRepoMap.sh"]);
  generator.stdin.write(repo_string);
  generator.stdin.end();
  stack.push({
    repo: repo_string,
    timestamp: Date.now(),
    complete: false,
    status: "progress",
  });
  //console.log("stack", stack);

  generator.on("close", function (code) {
    if (code !== 0) {
      let elem = stack.find((v) => v.repo === repo_string);
      elem.complete = true;
      elem.status = "error";
      //      console.log(`Error running the script: ${code}`);
    } else {
      let elem = stack.find((v) => v.repo === repo_string);
      elem.complete = true;
      elem.timestamp = Date.now();
      elem.status = "finished";
      //      console.log("Finished running the script", output);
    }
  });

  res.status(200).send(`Building your city...`);

  let output = ""; // what to do with output?
  generator.stdout.on("data", function (data) {
    //    console.log("Chunk: ", data.toString());
    output += data;
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
  let elemToCheck = stack.find((v) => v.repo === repo_string);
  //  console.log("stackStatus", stack);
  if (elemToCheck && elemToCheck.status === "error") {
    //    console.log("status error", elemToCheck.status);
    return res.status(500).send(`An error occur`);
  }
  if (elemToCheck && !elemToCheck.complete) {
    //    console.log("status complete", elemToCheck.complete);
    return res.status(200).send(
      JSON.stringify({
        complete: elemToCheck.complete,
      })
    );
  }
  if (
    elemToCheck &&
    elemToCheck.complete &&
    elemToCheck.status === "finished"
  ) {
    //    console.log("status finished:", elemToCheck.complete, elemToCheck.status);
    return res.status(200).send(
      JSON.stringify({
        complete: elemToCheck.complete,
        mapPageURL: "/maps/" + repo_string.replace(/https:\/\//, ""),
      })
    );
  }
}); ///api/mapStatus

function deleteOld() {
  let currentTime = Date.now();
  //  console.log("before", stack.length);
  stack = stack.filter((elem) => currentTime - elem.timestamp < 1800000);
  //  console.log("after", stack.length);
}
http.createServer(app).listen(3000, function () {
  console.log("Listening on http://localhost:3000/");
});
