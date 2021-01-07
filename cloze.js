import luxon from "luxon";
import { getRoamDate, nth } from "./helpers.mjs";

const DateTime = luxon.DateTime;

const RoamDateForwards = (days) =>
  `[[${getRoamDate(DateTime.local().plus({ days }))}]]`;

const test = `(dopamine) With enough training, ~~[[unconditioned stimuli]]|1~~ we've never seen before, like a red dot or notification on your smartphone, can become ~~[[conditioned stimuli]]|1~~, because we learn to anticipate a reward} (the negative reinforcement} of alleviating our negative ~~[[emotions]]~~, or the ~~positive reinforcement~~ of seeing a novel thing). This '~~double reinforcement~~' can lead to ~~impulsive/addictive behavior~~ since every time we feel bored, anxious, angry, sad or lonely, we seek those things that both numb the bad feeling and distract our attention with pleasure`;

const test2 = '@EU consists of: UK, France, Germany, England, Italy'

const processText = text => {
  let links = [];
  if (text[0] === "@") {
    text = text.slice(1, text.length);
    const [_, tobeLinkified] = text.split(":");
    links = tobeLinkified.split(",").map(x => x.trim());
  } else {
    let state = "normal"; // 'seenOne'
    let counter = 0;
    let currentLinks = [];
    text.split("").forEach(char => {
      currentLinks.forEach((x, i) => (currentLinks[i] += char));
      if (state === "seenOne" && char !== "~") {
        state = "normal";
      }
      if (state === "seenOneOut" && char !== "~") {
        state = "normal";
      }
      if (char === "~") {
        counter += 1;
        if (state === "seenOne") {
          currentLinks.push("");
          state = "inside";
        } else if (state === "normal") {
          state = "seenOne";
        } else if (
          counter > 0 &&
          (state === "inside" || state === "seenOneOut")
        ) {
          counter -= 1;
          if (state === "seenOneOut") {
            const l = currentLinks.pop();
            if (l) {
              links.push(l.slice(0, -2));
            }
            state = "normal";
          } else if (state === "inside") {
            state = "seenOneOut";
          }

          if (counter === 0) {
            state = "normal";
          }
        }
      }
    });
  }
  const linkArray = [];
  const unnumberedLinks = [];
  links.forEach(l => {
    const [link, counter] = l.split("|");
    if (counter) {
      const c = parseInt(counter, 10);
      if (linkArray[c]) {
        linkArray[c].push(link);
      } else {
        linkArray[c] = [link];
      }
    } else {
      unnumberedLinks.push([link]);
    }
  });
  linkArray.forEach(l => {
    unnumberedLinks.push(l);
  });
  console.log(text.replace(/\d?\~\~/g, ""));
  console.log('  - srs')
  unnumberedLinks.forEach((ls,i) => {
    let newText = text;
    ls.forEach((l) => {
      newText = newText.replace(l, `{{=: ... | ${l}}}`);
      newText = newText.replace(/\d?\~\~/g, "");
      console.log(`    - ${newText} [[[[interval]]:1.0]] [[[[factor]]:2.30]] ${RoamDateForwards(i+1)}`) });

  });
};
processText(process.argv[2])
