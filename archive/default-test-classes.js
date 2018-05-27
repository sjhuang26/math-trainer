define(["questionjs"], (questionjs) => class DefaultTestClasses {
  constructor(args) {
    this.QuestionID = class extends questionjs.QuestionID {};
    this.Question = class extends questionjs.Question {};

    this.QuestionID.FIRST_YEAR = args.FIRST_YEAR;
    this.QuestionID.FIRST_ALTERNATE_YEAR = args.FIRST_ALTERNATE_YEAR;
    this.QuestionID.NUM_QUESTIONS = args.NUM_QUESTIONS;
    this.QuestionID.ALTERNATE_NAMES = args.ALTERNATE_NAMES;
  }
});