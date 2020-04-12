import luxon from "luxon";
import { getRoamDate } from "./helpers.mjs";

const DateTime = luxon.DateTime;

const RoamDateBack = days =>
  `[[${getRoamDate(DateTime.local().minus({ days }))}]]`;

const googleYears = new Array(17).fill("").map((_, i) => 2004 + i);

const today = DateTime.local();
const month = today.month;
const day = today.day;
const tomorrow = today.plus({ days: 1 });
const tomorrowDay = tomorrow.day;

const seven = RoamDateBack(7);
const thirty = RoamDateBack(30);
const ninety = RoamDateBack(90);

const googleStrings = googleYears.map(
  year =>
    `(after:${year}/${month}/${day} before:${year}/${month}/${tomorrowDay})`
);
const googleSearch = `(${googleStrings.join(
  " OR "
)}) AND from:shaklev@gmail.com`;
const googleUrl = `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(
  googleSearch
    .split("(")
    .join("%28")
    .split(")")
    .join("%29")
)}`;

const template = `[[Log]]
[[Retro]]
  ${seven}
  ${thirty}
  ${ninety}
  [Gmail retro](${googleUrl})
[[Daily Plan]]
[[Standup]]
[[Inbox]]`;

console.log(template);
