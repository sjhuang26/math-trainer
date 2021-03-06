import question from 'lib/question/question';
import QuestionLoader from 'lib/question/question-loader';

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

  static get TEST_NAME() {
    return "AMC 12";
  }

  static getString(id) {
    return this.getTestString(id) + " Question " + id.question;
  }

  static getTestString(id) {
    return (id.isAlternateYear ?
      id.year + " AMC 12" + id.alternateName:
      id.year + " AMC 12");
  }
}

class Loader extends QuestionLoader {
  static idToAnswerPage(id) {
    return id.isAlternateYear ?
        id.year + " AMC 12" + id.alternateName + " Answer Key" :
        id.year + " AMC 12 Answer Key"
  }

  static idToQuestionPage(id) {
    return id.isAlternateYear ?
        id.year + " AMC 12" + id.alternateName + " Problems/Problem " +
        id.question :
        id.year + " AMC 12 Problems/Problem " + id.question;
  }

  static idToTestPage(id) {
    return id.isAlternateYear ?
        id.year + " AMC 12" + id.alternateName + " Problems" :
        id.year + " AMC 12 Problems";
  }
}

export default {
  ClassificationSystem: ClassificationSystem,
  Loader: Loader
};