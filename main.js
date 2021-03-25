import yargs from "yargs";
import fs from "fs";
import { spawn } from "child_process";

import diamond from "./diamond.js";
import map from "./map.js";

let GHData = {}; // global object to keep all data collected on given Git
const SCCfile = "./temp/sccresult.json";
async function main() {
  getInput();
  readSCC(SCCfile);
  //  await getGitHubData();
  //  console.log(GHData);
  const mapHTML = map.generateMapHTML(GHData.total.lines, diamond);
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

function readSCC(SCCfile) {
  const filetext = fs.readFileSync(SCCfile, "utf-8");
  let json = JSON.parse(filetext);
  GHData.byLang = [];
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
  json.forEach((elem) => {
    GHData.byLang.push({
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
    });
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
  GHData.total = {
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
}
/**
 * This function check validity of input
 * @return bolean or exit with error code
 */
function getInput() {
  const argv = yargs(process.argv.slice(2)).argv;
  const owner = argv.o;
  const repo = argv.r;
  GHData = { owner: owner, repo: repo };
}
