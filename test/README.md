# Testing PowerTip

This project has an extensive test suite powered by [QUnit][qunit] and an interactive test page for testing a few quirky scenarios.

[qunit]: https://qunitjs.com/

## Running the test suite via the command line

The command line test suite is the preferred method of testing. It has the most comprehensive set of tests, and includes code linting.

 * All commands should be run from the project's root directory (where the `package.json` file is).
 * The test automation is run with [Node.js][nodejs]. So you must have that installed before you can use the command line tools.

[nodejs]: https://nodejs.org/

Install the necessary npm dependencies with the following command (this only needs to be done once):

```shell
npm install
```

After that you can run the test suite with the following command:

```shell
npm run test
```

## Running the test suite in a web browser

You can also run the main test suite directly in a web browser. This is particularly useful for testing a specific browser. Simply open the `index.html` file in a browser and the test suite will immediately begin the testing process.

## Running the edge case tests

The edge cases test page includes a number of tests that cover scenarios which are either difficult or impossible to automate. So that set of tests can only be done with human interaction. It also includes a helpful status window for debugging.

You can perform those tests by opening `edge-cases.html` in a web browser. Each test case includes instructions on how to verify correct functionality.
