import luxon from "luxon";
import { getRoamDate, nth } from "./helpers.mjs";

const DateTime = luxon.DateTime;

const nthWith = (string) => string + nth(string);

Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

const days = "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday".split(
  ","
);
const getDay = (date) => {
  let dayNo = date.getDay() - 1;
  if (dayNo === -1) {
    dayNo = 6;
  }
  return days[dayNo];
};

const RoamDateBack = (days) =>
  `[[${getRoamDate(DateTime.local().minus({ days }))}]]`;

const googleYears = new Array(6).fill("").map((_, i) => 2004 + i * 3);

const today = DateTime.local();
const month = today.month;
const day = today.day;
const tomorrow = today.plus({ days: 1 });
const tomorrowDay = tomorrow.day;

const seven = RoamDateBack(7);
const thirty = RoamDateBack(30);
const ninety = RoamDateBack(90);
const hundredeighty = RoamDateBack(180);

const whichNumberDay = () => {
  const d = new Date().getDate();
  const n = Math.ceil(d / 7);
  return nthWith(n);
};

const googleStrings = googleYears.map(
  (year) =>
    `(after:${year}/${month}/${day} before:${year}/${
      tomorrowDay < day ? month + 1 : month
    }/${tomorrowDay})`
);
const googleSearch = `(${googleStrings.join(
  " OR "
)}) AND from:shaklev@gmail.com NOT "Buzz from"`;
const googleUrl = `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(
  googleSearch
)
  .split("(")
  .join("%28")
  .split(")")
  .join("%29")}`;

const template = `[[Morning Pages]] {{word-count}}
[[Retro]]
  ${seven}
  ${thirty}
  ${ninety}
  ${hundredeighty}
  [Gmail retro](${googleUrl})
  [Google Drive](https://drive.google.com/drive/u/0/search?q=type:document%20-from:pranav%20-from:bahoshy%20-owner:terrien%20-owner:bianca%20-owner:corallini%20-owner:valentina%20-owner:kim%20-owner:capri%20-owner:larocca%20-owner:odera%20-owner:godefroy%20-owner:abdus-samad%20-owner:i-ching%20-owner:fines-kested%20-owner:kayla%20after:2020-06-16)
[[SRS]]
   #min-all {{[[query]]: {and:[[interval]] {not:[[query]]} {not: [[fi]]} {not: [[icebox]]} {between:[[December 6th, 2015]] [[today]]}}}}
{{[[embed]]: [[Tasks]]}}
[[Daily Goals]]
[[Daily Plan]]
[[Standup]]
[[Log]]
[[Inbox]]`;

console.log(template);

// [[Habit tracker]]
//   {{[[TODO]]}} Meditate
//   {{[[TODO]]}} Twitter max twice
//   {{[[TODO]]}} Stretch/yoga
//   {{[[TODO]]}} Write gratitude
//   {{[[TODO]]}} No snacking
// [[Evening review]]
//   {{[[TODO]]}} Close all tabs
//
// {{[[query]]: {and: {not: [[query]]} [[Recurring Tasks]] {or: [[Every day]] [[${getDay(
//   new Date()
// )}]] [[Week ${new Date().getWeek()}]] [[${nthWith(
//   new Date().getDate()
// )} of the month]] [[${whichNumberDay()} ${getDay(
//   new Date()
// )} of the month]] [[${getRoamDate(new Date()).substring(
//   0,
//   getRoamDate(new Date()).length - 6
// )}]]}}}}
