import aimeUtil from './lib/aime/aime-util';
import amc10Util from './lib/amc-10/amc-10-util';
import amc12Util from './lib/amc-12/amc-12-util';
import classificationSystem from './lib/question/classification-system';
import question from './lib/question/question';
import pathjs from './lib/pathjs';
import wikiLoader from './lib/aops-wiki/wiki-loader';
import wikiQuestionParser from './lib/aops-wiki/wiki-question-parser';

var VERSIONS = [
  {
    major: 3,
    minor: 0,
    patch: 0,
    majorAppUpdates: [
      "Greatly improved loading times."
    ],
    minorAppUpdates: [],
    majorInternalUpdates: [
      "Reconfigured the whole project to use Webpack."
    ],
    minorInternalUpdates: []
  },
  {
    major: 2,
    minor: 3,
    patch: 0,
    majorAppUpdates: [
      "Allowed excluding the solutions in generated tests."
    ],
    minorAppUpdates: [
      "Improved the error handling for the test generator."
    ],
    majorInternalUpdates: [],
    minorInternalUpdates: [
      "Calls to abstract methods now throw an Error object instead of a String."
    ]
  },
  {
    major: 2,
    minor: 2,
    patch: 1,
    majorAppUpdates: [],
    minorAppUpdates: [
      "Fixed a couple bugs involving printing and test validation.",
      "Improved error handling."
    ],
    majorInternalUpdates: [],
    minorInternalUpdates: []
  },
  {
    major: 2,
    minor: 2,
    patch: 0,
    majorAppUpdates: [
      "Added print test feature to user interface.",
      "Improved the formatting of the test printout."
    ],
    minorAppUpdates: [
      "Added title to app.",
      "Got rid of individual question printing because it seemed unnecessary."
    ],
    majorInternalUpdates: [
      "Generate.html now uses Vue."
    ],
    minorInternalUpdates: [
      "Added abstract static TEST_NAME field to YTQClassificationSystem.",
      "Cleaned up a couple unused props and components."
    ]
  },
  {
    major: 2,
    minor: 1,
    patch: 0,
    majorAppUpdates: [
      "Added ability to print out old tests and questions, but the feature is buried under generate.html."
    ],
    minorAppUpdates: [
      "Removed Refresh button."
    ],
    majorInternalUpdates: [
      "Wrote Promise utility that excecutes at most N promises at a time."
    ],
    minorInternalUpdates: [
    ]
  },
  {
    major: 2,
    minor: 0,
    patch: 2,
    majorAppUpdates: [],
    minorAppUpdates: [
      "Revised app description.",
      "Fixed clearing of Browse question when the About page is opened.",
      "Made a fancier loader.",
      "Enhanced the question selector."
    ],
    majorInternalUpdates: [],
    minorInternalUpdates: [
    ]
  },
  {
    major: 2,
    minor: 0,
    patch: 1,
    majorAppUpdates: [],
    minorAppUpdates: [
      "Fixed app not loading issue."
    ],
    majorInternalUpdates: [],
    minorInternalUpdates: [
      "Got rid of Underscore.js dependency because it wasn't being used."
    ]
  },
  {
    major: 2,
    minor: 0,
    patch: 0,
    majorAppUpdates: [
      "Simplified the app down to just a question viewer."
    ],
    minorAppUpdates: [],
    majorInternalUpdates: [
      "Extensively organized and cleaned up all the code.",
      "Moved code to GitHub."
    ],
    minorInternalUpdates: []
  },
  {
    major: 1,
    minor: 2,
    patch: 0,
    majorAppUpdates: [
      "Added Settings page."
    ],
    minorAppUpdates: [
      "The Browse page alert only appears once now.",
      "Added refresh button to Browse page.",
      "Added wiki viewing and editing links to Browse page.",
      "Fixed a number of bugs where questions were incorrectly loaded from the AoPS wiki.",
      "Added an error notice when wiki loading fails.",
      "Added option to delete all data.",
      "The input fields for the Browse field will persist from session to session.",
      "Added an error message that comes up when a wiki question doesn't load.",
      "Added an error dialog for general errors."
    ],
    majorInternalUpdates: [
      "Rewrote the ObjectManager API, separating parent and child object managers into two classes.",
      "Separated the individual test logic from logic applying to every test with the {{ test }}-classes and {{ test }}-loader modules.",
      "Renamed all QuestionID and Question class references in test class APIs so that they don't include the name of the test, for consistency. For example, amc-12-loader.Amc12Question has been changed to amc-12-loader.Question."
    ],
    minorInternalUpdates: [
      "Wrote a Persist API to simplify app state persistence.",
      "Added key erasing to Cache and Test Loader APIs.",
      "Separated cache and app local variables with a branch functionality to Storage API."
    ]
  },
  {
    major: 1,
    minor: 1,
    patch: 0,
    majorAppUpdates: [
      "Added support for AMC 12."
    ],
    minorAppUpdates: [
      "The About page now shows version details for all previous versions."
    ],
    majorInternalUpdates: [
      "Wrote a local storage API for easy getting and setting from local storage.",
      "The cache now stores to local storage."
    ],
    minorInternalUpdates: [
      "Made the versioning object and system conform to Semantic Versioning (semver.org) and made it better.",
      "Removed the wiki loading test because the app itself seems stable enough to use it for testing."
    ]
  },
  {
    major: 1,
    minor: 0,
    patch: 0,
    majorAppUpdates: [
      "Added support for AMC 10."
    ],
    minorAppUpdates: [
      "Improved question selection validation.",
      "Added a favicon.",
      "Wrote a better About page with full credits."
    ],
    majorInternalUpdates: [
      "Reworked the API to improve extensibility for new tests.",
      "Changed lots of naming in the API to be more coherent."
    ],
    minorInternalUpdates: []
  },
  {
    major: 0,
    minor: 1,
    patch: 0,
    majorAppUpdates: [
      "Created the app."
    ],
    minorAppUpdates: [],
    majorInternalUpdates: [
      "Created the app API."
    ],
    minorInternalUpdates: []
  }
];

var constants = {
  AMC_COPYRIGHT: "The problems on this page are copyrighted by the Mathematical Association of America's American Mathematics Competitions."
};

var modules = {
  aimeUtil: aimeUtil,
  amc10Util: amc10Util,
  amc12Util: amc12Util,
  classificationSystem: classificationSystem,
  pathjs: pathjs,
  question: question,
  wikiLoader: wikiLoader,
  wikiQuestionParser: wikiQuestionParser
};

var test = {};

test.tests = [
  {
    name: "AIME",
    util: modules.aimeUtil,
  },
  {
    name: "AMC 10",
    util: modules.amc10Util
  },
  {
    name: "AMC 12",
    util: modules.amc12Util
  }
];

test.testNames = [];
for (var i = 0; i < test.tests.length; i++) {
  test.testNames.push(test.tests[i].name);
}

test.fromName = function(name) {
  for (var t of test.tests) {
    if (t.name === name) return t;
  }
  return undefined;
}

var getLoadErrorMessage = function(reason, questionID) {
  switch (reason.type) {
    case modules.wikiLoader.errorType.MISSING_PAGE:
      if (questionID.year == new Date().getFullYear()) {
        return ["Test not on wiki", "This year's test is not on the wiki yet."];
      } else {
        return ["Missing page", "The wiki page with the question doesn't exist."];
      }
      break;
    case modules.wikiLoader.errorType.NETWORK_ERROR:
      return ["Network error", "Your computer could not connect to the Internet."];
    case modules.wikiLoader.errorType.OTHER:
      return ["Question cannot be loaded", "The question could not be loaded from the wiki."];
    case modules.wikiQuestionParser.parseErrorType.NO_BLOCKS:
      return ["The wiki page's contents cannot be read by the app."];
      break;
    default:
      return ["Unknown error", "An unknown error occurred."];
  }
};

export default {
  modules: modules,
  test: test,
  VERSIONS: VERSIONS,
  ytqc: modules.question.YTQClassificationSystem,
  ytqid: modules.question.YTQID,
  constants: constants,
  getLoadErrorMessage: getLoadErrorMessage
};