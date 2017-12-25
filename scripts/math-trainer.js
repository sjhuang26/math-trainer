define([
  "aime-util",
  "amc-10-util",
  "amc-12-util",
  "classification-system",
  "question",
  "pathjs",
  "wiki-loader",
  "wiki-question-parser"
], (
  aimeUtil,
  amc10Util,
  amc12Util,
  classificationSystem,
  question,
  pathjs,
  wikiLoader,
  wikiQuestionParser
) => {
  var VERSIONS = [
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

  return {
    modules: modules,
    test: test,
    VERSIONS: VERSIONS,
    ytqc: modules.question.YTQClassificationSystem,
    ytqid: modules.question.YTQID
  };
});