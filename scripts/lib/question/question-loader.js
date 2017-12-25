define(["wiki-question-parser", "wiki-loader", "question"],
    (wikiQuestionParser, wikiLoader, question) => class QuestionLoader {
  /**
   * @abstract
   */
  static idToAnswerPage(questionID) {
    throw "abstract";
  }

  /**
   * @abstract
   */
  static idToQuestionPage(questionID) {
    throw "abstract";
  }

  static loadQuestion(questionID) {
    var qPage = this.idToQuestionPage(questionID);
    var aPage = this.idToAnswerPage(questionID);
    return Promise.all([
      wikiLoader.load(qPage)
        .then(wikiQuestionParser.parseQuestionPage),
      wikiLoader.load(aPage)
        .then(wikiQuestionParser.parseAnswerPage)
    ]).then(values => {
      return new question.Question(
        questionID,
        values[0].problem,
        values[1].answers[questionID.question - 1],
        values[0].solutions
      );
    });
  }
});