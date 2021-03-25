import fetch from "node-fetch";
import yargs from "yargs";
import fs from "fs";
import { spawn } from "child_process";

import { generateMapHTML } from "./map.js";

let GHData = {}; // global object to keep all data collected on given Git
const SCCfile = "./temp/sccresult.json";
async function main() {
  getInput();
  readSCC(SCCfile);
  //  possible values of univ_coeff 10-100+. 10*log10(sum(each param/~avg(param))+1)/maxLog10+5  (+1 to make range start from 1, not 0; +10 to make small repos has at least 10)
  const univ_coeff = Math.round(
    (100 *
      Math.log10(
        GHData.total.files / GHData.weight.files +
          GHData.total.lines / GHData.weight.lines +
          GHData.total.comment / GHData.weight.comment +
          GHData.total.code / GHData.weight.code +
          GHData.total.bytes / GHData.weight.bytes +
          1
      )) /
      3 +
      10
  );
  //  console.log("coeff", univ_coeff);
  const mapHTML = generateMapHTML(univ_coeff);
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
  }); //foreach
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
  if (GHData.total.files < 1) {
    console.log("this git is empty or incorrect!");
    process.exit(1);
  }
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
  //fill out weight constants
  GHData.weight = {
    files: 400,
    lines: 100000,
    comment: 15000,
    code: 80000,
    bytes: 4000000,
  };
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
