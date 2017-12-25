define(["question", "question-loader"], (question, QuestionLoader) => {
  class ClassificationSystem extends question.YTQClassificationSystem {
    static get FIRST_YEAR() {
      return 2000;
    }
  
    static get FIRST_ALTERNATE_YEAR() {
      return 2002;
    }
  
    static get NUM_QUESTIONS() {
      return 25;
    }
  
    static get ALTERNATE_NAMES() {
      return ["A", "B"];
    }
  }

  class Loader extends QuestionLoader {
    static idToAnswerPage(id) {
      return id.isAlternateYear ?
          id.year + " AMC 10" + id.alternateName + " Answer Key" :
          id.year + " AMC 10 Answer Key"
    }
  
    static idToQuestionPage(id) {
      return id.isAlternateYear ?
          id.year + " AMC 10" + id.alternateName + " Problems/Problem " +
          id.question :
          id.year + " AMC 10 Problems/Problem " + id.question;
    }
  }

  return {
    ClassificationSystem: ClassificationSystem,
    Loader: Loader
  };
});