define(["default-test-loader", "amc-12-classes"], function(baseModule, testClasses) {
  return new baseModule({
    testQuestion: testClasses.Question,
    idToAnswerPage: id => id.isAlternateYear ?
        id.year + " AMC 12" + id.alternateName + " Answer Key" :
        id.year + " AMC 12 Answer Key",
    idToQuestionPage: id => id.isAlternateYear ?
        id.year + " AMC 12" + id.alternateName + " Problems/Problem " +
        id.question :
        id.year + " AMC 12 Problems/Problem " + id.question
  });
});