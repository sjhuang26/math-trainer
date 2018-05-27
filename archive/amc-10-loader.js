define(["default-test-loader", "amc-10-classes"],
    (baseModule, testClasses) => class Amc10Loader {
  
}



  {
  return new baseModule({
    testQuestion: testClasses.Question,
    idToAnswerPage: id => id.isAlternateYear ?
        id.year + " AMC 10" + id.alternateName + " Answer Key" :
        id.year + " AMC 10 Answer Key",
    idToQuestionPage: id => id.isAlternateYear ?
        id.year + " AMC 10" + id.alternateName + " Problems/Problem " +
        id.question :
        id.year + " AMC 10 Problems/Problem " + id.question
  });
});