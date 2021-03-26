import getStdin from "get-stdin";
import fs from "fs";
import { spawn } from "child_process";

import { generateMapHTML } from "./map.js";

const min_tiles = 10;

async function main() {
  try {
    const repoData = await readSCC();

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
        min_tiles
    );

    const mapHTML = generateMapHTML(number_of_blocks);

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

async function readSCC() {
  const repoData = {};

  let json = JSON.parse(await getStdin());
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

  json.forEach((elem) => {
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
    console.log("this git is empty or incorrect!");
    process.exit(1);
  }

  return repoData;
}
