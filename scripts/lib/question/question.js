define(["classification-system"], (classificationSystem) => {
  class YTQClassificationSystem extends classificationSystem.ClassificationSystem {
    /**
     * @abstract
     */
    static get FIRST_YEAR() {
      throw "abstract";
    }

    /**
     * @abstract
     */
    static get FIRST_ALTERNATE_YEAR() {
      throw "abstract";
    }

    /**
     * @abstract
     */
    static get NUM_QUESTIONS() {
      throw "abstract";
    }

    /**
     * @abstract
     */
    static get ALTERNATE_NAMES() {
      throw "abstract";
    }

    /**
     * @abstract
     */
    static get TEST_NAME() {
      throw "abstract";
    }

    /**
     * @abstract
     */
    static getString(ytqid) {
      throw "abstract";
    }

    /**
     * @abstract
     */
    static getTestString(ytqid) {
      throw "abstract";
    }

    static isYearValid(year) {
      return this.FIRST_YEAR <= year &&
          year <= new Date().getFullYear();
    }

    static isQuestionValid(question) {
      return question > 0 && question <= this.NUM_QUESTIONS;
    }

    static isAlternateYear(year) {
      return this.FIRST_ALTERNATE_YEAR <= year && this.isYearValid(year);
    }
    
    static get levels() {
      return [
        new classificationSystem.Level("year", {
          type: "numerical"
        }),
        new classificationSystem.Level("alternate", {
          type: "qualitative",
          nameMap: this.ALTERNATE_NAMES
        }),
        new classificationSystem.Level("question", {
          type: "numerical"
        })
      ];
    }

    static isValid(series) {
      return this.isYearValid(series.year)
        && (series.alternate === 0 || this.isAlternateYear(series.year))
        && this.isQuestionValid(series.question);
    }
  }

  class Question {
    constructor(questionID, problem, answer, solutions) {
      this.questionID = questionID;
      this.problem = problem;
      this.answer = answer;
      this.solutions = solutions;
    }
  }

  class YTQID extends classificationSystem.ID {
    constructor(system, year, alternate, question) {
      super(system, {
        year: year,
        alternate: alternate,
        question: question
      });
    }

    get isAlternateYear() {
      return this.system.isAlternateYear(this.series.year);
    }

    get alternateName() {
      return this.system.levels[1].mapQualitativeToName(this.series.alternate);
    }

    get year() {
      return this.series.year;
    }

    get alternate() {
      return this.series.alternate;
    }

    get question() {
      return this.series.question;
    }
  }

  return {
    YTQClassificationSystem: YTQClassificationSystem,
    Question: Question,
    YTQID: YTQID
  };
});