# hypothesis-to-bullet

Script to fetch Hypothes.is annotations or Twitter threads and output Markdown that is suitable for Roam for macOS computers.

## Installation Instructions

1. Ensure that you are running Node v.13.5.0 or greater. You can check from the command line by typing in `node -v`.
1. Clone or download the repository.
1. From the command line, enter the directory.
1. Run `npm install`.
1. Create a file named `.hypothesis-token` in your home directory.
1. Add the token from the Developer section of Hypothesis into that file.
1. Create a file named `.twitter-token.js` in your home directory, it should look like this:

```
module.exports = {
  consumer_key: "xx",
  consumer_secret: "xx",
  access_token: "xx",
  access_token_secret: "xx"
};
```

1. Use your favorite shortcut/hotkey tool to execute the following AppleScript:

>  tell application "Google Chrome" to get URL of active tab of front window
>  set theText to result
>  do shell script "/Users/YOUR-USER-NAME/.nvm/versions/node/v13.5.0/bin/node ~/PLACE-WHERE-YOU-CLONED-THE-REPOSITORY/hypothesis-to-bullet/index.mjs  "&theText &"|pbcopy"

Note that this assumes you are using Node Version manager and have not changed any of the default directories. This also assumes you have used NVM to install v13.5.0.

You may use any shortcut application you desire, bute Keyboard Maestro and Better Touch Tool make the process of executing an AppleScript very easy.

email shaklev@gmail.com for more info
