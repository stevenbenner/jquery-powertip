# PowerTip

PowerTip is a jQuery tooltip plugin with some advanced features like **hover intent testing**, **tooltip queueing**, and **support for complex data**.

This software is licensed under the [MIT license][license].

[![Release Version][releasebadge]][releases] [![NPM Version][npmbadge]][npmpage] [![Test Status][testbadge]][teststatus]

[license]: LICENSE.txt
[releases]: https://github.com/stevenbenner/jquery-powertip/releases
[teststatus]: https://github.com/stevenbenner/jquery-powertip/actions/workflows/run-tests.yml
[releasebadge]: https://img.shields.io/github/release/stevenbenner/jquery-powertip.svg?style=flat-square
[npmbadge]: https://img.shields.io/npm/v/jquery-powertip.svg?style=flat-square
[testbadge]: https://img.shields.io/github/actions/workflow/status/stevenbenner/jquery-powertip/run-tests.yml?style=flat-square

## Getting started

* Download the latest stable release from the [PowerTip web site][projectpage] or install [jquery-powertip][npmpage] from npm.
* Add the JavaScript and CSS file references to your web site.
* Add a `title` or `data-powertip` attribute to the elements you want to show tooltips for.
* Run the `powerTip()` method on those elements.

[npmpage]: https://www.npmjs.com/package/jquery-powertip

## Documentation

You can find the documentation for the **latest release version** on the [PowerTip web site][projectpage]. You will find the documentation for the **latest in-development version** in the [doc folder][docs] in the GitHub repository.

[projectpage]: https://stevenbenner.github.io/jquery-powertip/
[docs]: https://github.com/stevenbenner/jquery-powertip/tree/master/doc

## Building from source

> [!NOTE]
> You do not have to build this project to use it. This is only needed if you intend to do development work or release your own version. For typical usage please follow the installation instructions in the documentation linked above. Alternatively, you can find examples of using the source version of PowerTip without any build steps in the html files in the `test` folder.

You can build your own release version of PowerTip from the source code by using the included task runner commands.

### Dependencies

You should have the following software installed on your computer to run the build system:

 * [Node.js][nodejs]
 * [GruntJS][gruntjs] (optional)

[gruntjs]: https://gruntjs.com/
[nodejs]: https://nodejs.org/

### Instructions

#### Clone git repo

Clone the git repository to your local system:

```shell
git clone https://github.com/stevenbenner/jquery-powertip.git
cd jquery-powertip
```

#### Install npm dependencies

First you will need to install the npm dependencies to run the build system. Run the following command to install all project dependencies:

```shell
npm install
```

You only need to do this once.

#### Build distributale version

Then you can run the following command to build a distributable version of the project with all of the assets included:

```shell
npm run build
```

The built assets will be placed in the `dist` folder.

#### Other commands

If you installed GruntJS on your computer then you can run various other commands that are useful for development or debugging.

| Command        | Action                                       |
| :------------- | :------------------------------------------- |
| `grunt build`  | Run a minimal build (skip docs and zip file) |
| `grunt clean`  | Remove build artifacts                       |
| `grunt eslint` | Run the code linter                          |
| `grunt test`   | Run the test suite                           |

There are many other grunt tasks available as well. You can review the `Gruntfile.js` file to see the whole list.

##### Further reading

 * For more detailed instructions on running the test suite please see the [testing documentation][testingdoc].
 * For instructions on publishing a new version please see the [release process documentation][releasedoc].

[testingdoc]: test/README.md
[releasedoc]: doc/release-process.md
