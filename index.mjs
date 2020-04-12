import child_process from "child_process";
import twitter from "./twitter-to-bullet.mjs";
import hypothesis from "./hypothesis-to-bullet.mjs";

const url = process.argv[2];
const user = process.argv[3];
if (url.startsWith("https://twitter")) {
  twitter(url);
} else if (url.startsWith("https://www.youtube")) {
  child_process.execFileSync("youtube-dl", [url], {
    cwd: "/Users/stian/Downloads/movies"
  });
} else {
  hypothesis(url, user);
}
