import express from "express";
import child from "child_process";
import http from "http";

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get("/generateRepoMap", function (req, res) {
  res.status(200).send(`<form action="" method="POST" target="_blank">
    Enter Repo URL:
    <input type="text" name="repo" size="50" value="https://github.com/GitTerraGame/GitTerra.git"/>
    <input type="submit" />
  </form>`);
});

app.post("/generateRepoMap", function (req, res) {
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

  const generator = child.spawn("bash", ["./generateRepoMap.sh"]);
  generator.stdin.write(repo_string);
  generator.stdin.end();

  generator.on("close", function (code) {
    if (code !== 0) {
      console.log(`Error running the script: ${code}`);
    } else {
      console.log("Finished running the script", output);
    }
  });

  res.status(200).send(`Building your city...`);

  let output = "";
  generator.stdout.on("data", function (data) {
    console.log("Chunk: ", data.toString());
    output += data;
  });
});

http.createServer(app).listen(3000, function () {
  console.log("Listening on 3000");
});
