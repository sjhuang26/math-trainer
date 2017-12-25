define(["question", "question-loader"], (question, QuestionLoader) => {
  class ClassificationSystem extends question.YTQClassificationSystem {
    static get FIRST_YEAR() {
      return 1983;
    }
  
    static get FIRST_ALTERNATE_YEAR() {
      return 2000;
    }
  
    static get NUM_QUESTIONS() {
      return 15;
    }
  
    static get ALTERNATE_NAMES() {
      return ["I", "II"];
    }
  }

  class Loader extends QuestionLoader {
    static idToAnswerPage(id) {
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
    }
  
    static idToQuestionPage(id) {
      if (id.isAlternateYear) {
        // years with alternate tests (an I and an II)
        return id.year + " AIME " + id.alternateName + " Problems/Problem " + id.question;
      } else {
        // years without them
        return id.year + " AIME Problems/Problem " + id.question;
      }
    }
  }

  return {
    ClassificationSystem: ClassificationSystem,
    Loader: Loader
  };
});