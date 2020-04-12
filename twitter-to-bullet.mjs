import Twit from "twit";
import orderBy from "lodash/orderBy.js";
import { getRoamDate } from "./helpers.mjs";
import entities from "entities";
import path from "path";
import os from "os";
import fs from "fs";

const homedir = os.homedir();
const twitterToken = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.twitter-token.json`, "utf-8")
);

var T = new Twit(twitterToken);
const Tweets = [];
let author = undefined;

const getTweet = async rawId => {
  const id = rawId.split("/").slice(-1)[0];
  const x = await T.get(`statuses/show/${id}`, { tweet_mode: "extended" });
  if (!author) {
    author = x.data.user.screen_name;
  }
  if (true || x.data.user.screen_name === author) {
    if (x.data.entities.urls) {
      Promise.all(
        x.data.entities.urls.map(async (embed, i) => {
          const twitterMatch = embed.expanded_url.match(
            /https:\/\/twitter\.com\/(.+)\/status\/(\d+)/
          );
          if (twitterMatch) {
            const embed = await T.get(`statuses/show/${twitterMatch[2]}`, {
              tweet_mode: "extended"
            });
            x.data.embed = embed.data;
            delete x.data.entities.urls[i];
          }
        })
      );
      Tweets.push(x.data);
      if (x.data.in_reply_to_status_id_str) {
        const result = await getTweet(x.data.in_reply_to_status_id_str);
      }
    }
  }
};

const getTweetText = x => {
  const textRaw = entities.decode(x.full_text || x.text);
  const text = textRaw
    .replace(/(https\:\/\/t\.co\S+)/, "")
    .trim()
    .replace(/\n+/g, "\n    - ");
  return text;
};

const formatTweet = x => {
  const text = getTweetText(x);
  let res = `  - ${text}\n`;
  if (x.embed) {
    res += `    - Embedded [tweet](https://twitter.com/${x.embed.user.screen_name}/${x.embed.id}) by [${x.embed.user.screen_name}](https://twitter.com/${x.embed.user.screen_name})\n`;
    res +=
      formatTweet(x.embed)
        .split("\n")
        .map(x => `    ${x}`)
        .join("\n") + "\n";
  }
  (x.entities.urls || []).forEach(media => {
    if (media.expanded_url.startsWith("https://www.youtube.com")) {
      res += `    - {{youtube: ${media.expanded_url}}}\n`;
    } else if (media && media.expanded_url) {
      res += `    - [${media.expanded_url}](${media.expanded_url})\n`;
    }
  });
  (x.entities.media || []).forEach(media => {
    res += `    - ![](${media.media_url_https})\n`;
  });
  return res;
};

export default url => {
  getTweet(url)
    .then(() => {
      const tweets = orderBy(Tweets, x => new Date(x.created_at));
      const firstTweet = tweets[0];
      console.log(firstTweet.id, firstTweet.entities, firstTweet)
      let result = `[[Twitter thread]] [source](https://twitter.com/${
        firstTweet.user.screen_name
      }/status/${firstTweet.id}) by [[${firstTweet.user.name}]] __[@${
        firstTweet.user.screen_name
      }](https://twitter.com/${
        firstTweet.user.screen_name
      })__ on [[${getRoamDate(firstTweet.created_at)}]]\n`;
      result += tweets.map(x => formatTweet(x)).join("");
      console.log(result);
    })
    .catch(e => console.error(e));
};
