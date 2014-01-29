# PowerTip Release Process

**THIS DOCUMENT IS FOR INTERNAL REFERENCE ONLY** - I am documenting the release process so that I have a nice checklist to go over when releasing a new version of PowerTip. You probably don't care how PowerTip is built and released unless you plan on maintaining your own fork.

## Version Format

PowerTip uses [Semantic Versioning](http://semver.org/) and the version is in the format of [MAJOR].[MINOR].[PATCH]. Versioning is dictated by the exposed API that PowerTip users consume when using the plugin.

This includes anything in the following namespaces:

* `$.fn.powerTip`
* `$.fn.powerTip.defaults`
* `$.fn.powerTip.smartPlacementLists`
* `$.powerTip`

The events that fire during the tooltip life cycle are also considered to be part of the API for versioning purposes.

### Semantic Versioning Requirements

> * MAJOR version when you make incompatible API changes,
> * MINOR version when you add functionality in a backwards-compatible manner, and
> * PATCH version when you make backwards-compatible bug fixes.

## The Release Process

1. **Update the date and diff for the release in CHANGELOG.yml**

	The CHANGELOG.yml file is used to generate the release notes seen on the project page.

2. **Bump the version in package.json and jquery.powertip.json**

	The package.json is used when building and the jquery.powertip.json file is used on the [PowerTip jQuery Plugins page](http://plugins.jquery.com/powertip/).

3. **Run `grunt build:release`**

	This will build and test all of the code and generate the zip archive for release in the dist folder.

4. **Tag the version**

	Make sure the changes from steps 1 and 2 have been commited.

	`git tag -a vX.X.X -m "vX.X.X"`

	Don't push the tag yet. Once you push a new semver tag the jQuery plugins site will get a notification via the web hook.

5. **Run `grunt deploy:docs && grunt deploy:assets`**

	This will build the project page content, commit it to the gh-pages branch, and return to the master branch. It does not push any changes to the repo.

6. **Review commits and push them**

	**POINT OF NO RETURN**

	This is the fail-safe step. Make sure the build looks right. Make sure the commits from steps 1 and 2 are correct. Make sure the commits added to the gh-pages branch look right. If everything looks good then push the commits and the tag. With that the new version is out and available for download.

7. **Add new release to GitHub repo**

	Since the GitHub releases feature is a fairly recent addition this part of the process is still manual. Add a release for the tag, copy and paste the release notes, and add the zip archive to the release.

8. **Update JSFiddle if needed** (it usually will not be needed)

	The [PowerTip JSFiddle](http://jsfiddle.net/stevenbenner/2baqv/) is used by people wanting to quickly play with the plugin before really digging into it. If there were any breaking changes or significant new features then they should be added to the JSFiddle.
