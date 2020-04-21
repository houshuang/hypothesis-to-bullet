import luxon from "luxon";
import fs from "fs";
import process from "process";
import { getRoamDate, nth } from "./helpers.mjs";

const DateTime = luxon.DateTime;

var data = "";
process.stdin.resume();
process.stdin.on("data", function(buf) {
  data += buf.toString();
});
process.stdin.on("end", function() {
  function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return tempArray;
  }

  const [instructionsRaw, ...linesRaw] = data.split("\n");
  const instructions = instructionsRaw.replace(/[\-\#]/g, "").trim();
  const [ratioStr, sizeStr, indent, initialStr] = instructions.split(",");
  const ratio = parseInt(ratioStr || "1", 10);
  const size = parseInt(sizeStr || "1", 10);
  const initial = parseInt(initialStr || "1", 10);

  const lines = chunkArray(linesRaw, size);

  let c = 0;
  const day = DateTime.local().plus({ days: initial });
  lines.forEach(line => {
    c += ratio;
    if (day.plus({ days: c }).weekday > 5) {
      c += 1;
    }
    if (day.plus({ days: c }).weekday > 5) {
      c += 1;
    }
    if (indent) {
      console.log(`[[${getRoamDate(day.plus({ days: c }))}]]`);
    }
    line.forEach(l => {
      if (l.trim() === "") {
        return;
      }
      if (indent) {
        console.log(`  ${l}`);
      } else {
        console.log(`${l} #[[${getRoamDate(day.plus({ days: c }))}]]`);
      }
    });
  });
});
