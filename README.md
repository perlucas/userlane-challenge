# Web Crawler Command - Userlane Coding Challenge
Simple web crawler command, presented as a solution for the [Userlane's Coding Challenge](https://gist.github.com/adriandulic/688447e4b08151dce8eeff4554c2b901). I've spent ~4hs. working on this challenge.

## Setup
- Install required dependencies through `npm install`
- Run `npm run crawler` to show the usage hints
- Run `npm run test` to run the unit tests

## Dependencies
- Typescrypt (ts-node & ts-jest)
- command-line-args & command-line-usage (CLI args and self-documenting support)
- JSDOM (HTML parsing)
- validate (CLI args validation)
- Jest (unit tests)

## Localenv testing
I've provided an additional `static-html-demo` folder which contains a static HTML website that can be used to easily test this command. This is included as a separate project. By running `npm install` and `npm run start`, this app will spin up an Express server that hosts a static website in localhost:9000. Then we can run `npm run crawler -- -u http://localhost:9000` back in the main project to see it in action.

## Improvements and pending to-do's
Having more time, I'd like to address the following:
- Better error handling for non-HTML URLs (currently, this crashes the app)
- Better error handling and retry handling for HTTP 429 errors
- Better support for relative links (currently, it only supports absolute links)
- Refactor the `scripts/crawler.ts` module, separating validation logic from the user hint support into different files
- Provide a `-o [file]` additional option to allow to dump the output into a file. Currently, this is limited to doing `npm run crawler -- -u testing.com > myFile.json`