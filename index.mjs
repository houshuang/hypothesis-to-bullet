import twitter from "./twitter-to-bullet.mjs";
import hypothesis from "./hypothesis-to-bullet.mjs";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const nth = function(d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const getRoamDate = dateString => {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const date = d.getDate();
  const month = months[d.getMonth()];
  const nthStr = nth(date);
  return `${month} ${date}${nthStr}, ${year}`;
};

const url = process.argv[2];
const user = process.argv[3];
if (url.startsWith("https://twitter")) {
  twitter(url);
} else {
  hypothesis(url, user);
}
