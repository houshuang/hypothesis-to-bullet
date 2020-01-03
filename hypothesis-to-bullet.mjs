import queryString from "query-string";
import fetch from "isomorphic-fetch";
import fs from "fs";
import os from "os";
import lodash from "lodash";

import { getRoamDate } from "./index.mjs";

const parseAnnotation = a => {
  const textRaw = a.text;
  const quotationRaw =
    lodash.get(a, "target[0]selector") &&
    a.target[0].selector.find(x => x.exact) &&
    a.target[0].selector.find(x => x.exact).exact;
  let result = "";
  const quotation = (quotationRaw || "").replace(/\n/g, " ");
  const text = (textRaw || "").replace(/\n/g, " ");
  const extraIndent = text ? "  " : "";
  const quoteString = quotation ? `    - ${quotation}` : "";
  const textString = text ? extraIndent + `    - ^^${text}^^` : "";
  return [quoteString, textString].join("\n");
};

const getAnnotations = async (token, annotatedUrl) => {
  const query = queryString.stringify({
    url: annotatedUrl
  });
  const url = "https://hypothes.is/api/search?user=houshuang&" + query;
  const queryHeaders = token && {
    headers: {
      Authorization: "Bearer " + token
    }
  };
  try {
    await fetch(url, queryHeaders)
      .then(e => e.json())
      .then(e => {
        const article = lodash.get(e, "rows[0].document.title[0]");
        const updated = lodash.get(e, "rows[0].updated");
        const annotations = lodash
          .orderBy(e.rows, f => {
            try {
              return lodash
                .get(f, "target[0].selector")
                .filter(x => x.type === "TextPositionSelector")[0].start;
            } catch (e) {
              return 0;
            }
          })
          .map(x => parseAnnotation(x))
          .join("\n");
        const dateStr = getRoamDate(updated);
        console.log(
          `- ${article}\n  - Source: ${annotatedUrl}\n${annotations}`
        );
      });
  } catch (e) {
    console.error(e);
  }
};

export default annotatedUrl => {
  const token = fs
    .readFileSync(`${os.homedir()}/.hypothesis-token`, "utf-8")
    .trim();
  getAnnotations(token, annotatedUrl);
};

//       const MAX_LIMIT = 1000;
//       const limit = Math.min(
//         parseInt(configData.limit, 10) || MAX_LIMIT,
//         MAX_LIMIT
//       );
//       const numFetches = Math.ceil(Math.min(limit, e.total) / 200);
//       const fetches = new Array(numFetches)
//         .fill()
//         .map((_, i) =>
//           fetch(
//             `https://hypothes.is/api/search?${query}&limit=${Math.min(
//               limit - i * 200,
//               200
//             )}&offset=${i * 200}`,
//             queryHeaders
//           ).then(x => x.json())
//         );
//       return Promise.all(fetches);
//     })
//     .then(z => mapQuery(flatten(z.map(a => a.rows)), configData));
// };

// export default (operator: productOperatorRunnerT);
