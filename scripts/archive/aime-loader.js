define(["default-test-loader", "aime-classes"], function(baseModule, testClasses) {
  return new baseModule({
    testQuestion: testClasses.Question,

    idToAnswerPage: function(id) {
      if (id.isAlternateYear) {
        // years with alternate tests
        return id.year + " AIME " + id.alternateName + " Answer Key";
      } else if (id.year === 1983) {
        // 1983 has a special format (!)
        return "1983_AIME/Answer_Key";
      } else {
        // years without alternate tests
        return id.year + " AIME Answer Key";
      }
    },

    idToQuestionPage: function(id) {
      if (id.isAlternateYear) {
        // years with alternate tests (an I and an II)
        return id.year + " AIME " + id.alternateName + " Problems/Problem " + id.question;
      } else {
        // years without them
        return id.year + " AIME Problems/Problem " + id.question;
      }
    }
  });
});