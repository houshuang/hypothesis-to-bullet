# hypothesis-to-bullet

Script to fetch Hypothes.is annotations or Twitter threads and output Markdown that is suitable for Roam for macOS computers.

## Installation Instructions

1. Ensure that you are running Node v.13.5.0 or greater. You can check from the command line by typing in `node -v`.
1. Clone or download the repository.
1. From the command line, enter the directory.
1. Run `npm install`.
1. Create a file named `.hypothesis-token` in your home directory.
1. Add the token from the Developer section of Hypothesis into that file.
1. Create a file named `.twitter-token.json` in your home directory, it should look like this:

```
{
  "consumer_key": "xx",
  "consumer_secret": "xx",
  "access_token": "xx",
  "access_token_secret": "xx"
};
```

Test the scripts on the command-line. 

To test Twitter, make sure the Twitter token has been added, then:
`node index.mjs TWEET_URL`
(the url should be of the last tweet in a thread)

To test Hypothesis, make sure the Hypothesis token has been added, then:
`node index.mjs ANNOTATED_URL HYPOTHESIS_USER_NAME`

If you get any error messages, contact me and do not proceed. If everything is going well, you can add it to your keyboard shortcut manager.

1. Use your favorite shortcut/hotkey tool to execute the following AppleScript:

>  tell application "Google Chrome" to get URL of active tab of front window
>  set theText to result
>  do shell script "/Users/YOUR-USER-NAME/.nvm/versions/node/v13.5.0/bin/node ~/PLACE-WHERE-YOU-CLONED-THE-REPOSITORY/hypothesis-to-bullet/index.mjs  "& theText &" YOUR-HYPOTHESIS-USERNAME | pbcopy"

Note that this assumes you are using Node Version manager and have not changed any of the default directories. This also assumes you have used NVM to install v13.5.0.

You may use any shortcut application you desire, bute Keyboard Maestro and Better Touch Tool make the process of executing an AppleScript very easy.

For Twitter, I've made a bunch of assumptions about content, and there are probably things that will break and which can be refined:
- use the URL of the last tweet (click on the date)
- it will "walk backwards" to the parent tweets, until there are no more parents.
- it will only include tweets by the author of the original tweet
- however it will also include embedded tweets by anyone
- we try to do smart things with URLs, images and videos

email shaklev@gmail.com for more info
