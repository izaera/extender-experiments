## NPM Loader

# Overview

There are three infrastructure projects involved:

* liferay-portal ([https://github.com/liferay/liferay-portal]())
* liferay-amd-loader ([https://github.com/izaera/liferay-amd-loader]())
* liferay-gulp-packager ([https://github.com/izaera/liferay-gulp-packager]())

And one sample project to test the feature:

* extender-experiments ([https://github.com/izaera/extender-experiments]())


# Setup

Clone the projects and select the `version_loader` branch in all projects.

The next step is npm-linking the loader with the portal:

1. Go to `liferay-amd-loader` and run `npm link`
2. Go to `liferay-portal` project and change to `modules/apps/foundation/frontend-js/frontend-js-web` directory
3. Run `npm link liferay-amd-loader`

Now, build the `liferay-amd-loader` project by running `gulp` inside the project folder and then start the portal.


# Deployment of sample portlet

Go to `liferay-gulp-packager` and run `npm link`.

Go to `extender-experiments` portlet and change to `modules/extender-experiment-portlet` directory. Run `npm link liferay-gulp-packager` and then `npm install`.

Now, we will modify the two versions of `isarray` that npm downloaded so that we can later check if the correct one is being loaded. To do this, go to the `node_modules` folder and look for `isarray` and `isobject` folders (the last one will contain another `node_modules` with another `isarray` folder inside).

Open both copies of `index.js` and modify `isarray`'s code to make it look like this one:

```
module.exports = /*Array.isArray ||*/ function (arr) {
  console.log("isArray x.x.x called");
  return toString.call(arr) == '[object Array]';
};
```

Substitute `x.x.x` by `2.0.1` and `1.0.0` depending on which version of `isarray` you are modifying.

Now run `gradle deploy`. That will deploy the OSGi portlet to the portal.

Note that the build process for the portlet has been modified to disable `metal-cli` and substitute it with a new step that launches `gulp`.

Point your browser to `localhost:8080` and add a new `extender-experiment-portlet` to the home page. 

Open Chrome Dev Tools and reload the page. You should see how the portlet loads the correct modules in the JS console:

```
import isArray from 'isarray' in index.es.js returned function (arr) {
    console.log("isArray 2.0.1 called");
    return toString.call(arr) == '[object Array]';
  }
Calling isArray([]) from index.es.js
isArray 2.0.1 called
which returns true
import isObject from 'isobject' in index.es.js returned function isObject(val) {
    return val != null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && isArray(val) === false;
  }
Calling isObject([]) from index.es.js
isArray 1.0.0 called
which returns false
```






