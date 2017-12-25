/* WORK IN PROGRESS. DOES NOT WORK. */
requirejs.config({
  shim: {
    "bootstrap": {
      deps: ["jquery", "popper-loader"]
    },
    "storejs": {
      exports: "store"
    },
    "underscorejs": {
      exports: "_"
    },
    "vue": {
      exports: "Vue"
    },
    "popperjs": {
      deps: ["jquery"],
      init: function(p) {
        window.Popper = p;
      }
    }
  },
  paths: {
    "aime-classes": "lib/aime/aime-classes",
    "aime-loader": "lib/aime/aime-loader",
    "amc-10-classes": "lib/amc-10/amc-10-classes",
    "amc-10-loader": "lib/amc-10/amc-10-loader",
    "amc-12-classes" :"lib/amc-12/amc-12-classes",
    "amc-12-loader": "lib/amc-12/amc-12-loader",
    "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min",
    "cachejs": "lib/cache",
    "deepmerge": "lib/deepmerge-1.5.1",
    "default-test-classes": "lib/default-test-utilities/default-test-classes",
    "default-test-loader": "lib/default-test-utilities/default-test-loader",
    "jquery": "https://code.jquery.com/jquery-3.2.1.min",
    "math-trainer": "math-trainer",
    "pathjs": "lib/path",
    "persistjs" :"lib/persist",
    "popperjs": "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min",
    "popper-loader": "popper-loader",
    "object-manager": "lib/object-manager",
    "questionjs": "lib/question",
    "storejs": "https://cdn.rawgit.com/marcuswestin/store.js/2b486f1f/dist/store.modern.min",
    "storagejs": "lib/storage",
    "test-module-packager": "lib/test-module-packager",
    "underscorejs": "http://underscorejs.org/underscore-min",
    "vue": "https://vuejs.org/js/vue",
    "wiki-loader": "lib/aops-wiki/wiki-loader",
    "wiki-question-parser": "lib/aops-wiki/wiki-question-parser"
  }
});

requirejs(["test-module-packager"], (test) => {
  // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function out(html) {
    document.getElementById("content").innerHTML = html;
  }

  try {
    var testFound = false;
    var testName = getParameterByName("test");
    for (var data of test.TEST_DATA) {
      if (data.systemName === testName || data.name === testName) {
        testFound = true;
      }
    }
    if (!testFound) throw "Error: no test found";
  }
  catch (e) {
    out("<h1>Error</h1>");
    out(e);
  }
});