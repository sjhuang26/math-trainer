define(["wiki-question-parser", "wiki-loader", "question", "promise-util"],
    (wikiQuestionParser, wikiLoader, question, promiseUtil, classificationSystem) => class QuestionLoader {
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
    return Promise.all([
      this.loadQuestionPage(questionID),
      this.loadAnswerPage(questionID)
    ]).then(values => {
      return new question.Question(
        questionID,
        values[0].problem,
        values[1].answers[questionID.question - 1],
        values[0].solutions
      );
    });
  }

  static loadQuestionPage(questionID) {
    return wikiLoader.load(this.idToQuestionPage(questionID))
    .then(wikiQuestionParser.parseQuestionPage);
  }

  static loadAnswerPage(questionID) {
    return wikiLoader.load(this.idToAnswerPage(questionID))
    .then(wikiQuestionParser.parseAnswerPage);
  }

  static undefinedArray(length) {
    var arr = [];
    arr.length = length;
    arr.fill(undefined);
    return arr;
  }

  static loadTestWithSolutions(questionID) {
    // Create the scheduler.
    var scheduler = new promiseUtil.PromiseThreadScheduler(3, {
      questionPage: this.undefinedArray(questionID.system.NUM_QUESTIONS)
    });
    
    // Push answer page tasks.
    scheduler.push(result => this.loadAnswerPage(questionID).then(r => {
      result.answerPage = r;
    }));
    
    // Push question page tasks for each question
    for (var i = 1; i <= questionID.system.NUM_QUESTIONS; i++) {
      // Push the result of a function that takes in the question number and
      // returns the task that loads that question (and the task is a function
      // that takes the result and returns a promise that loads the page and
      // when resolved adds the question page into the result).
      scheduler.push((qNum => (result => {
        // Generate the ID
        var q = new question.YTQID(questionID.system,
            questionID.year,
            questionID.alternate,
            qNum);
        
        return this.loadQuestionPage(q).then(qPage => {
          // Add the question page to the result.
          result.questionPage[qNum - 1] = {id: q, content: qPage};
        });
      }))(i));
    }
    
    // Start the scheduler.
    return scheduler.start().then(result => {
      // Assemble the question array and answerPage answers into Question objects
      var questions = [];
      for (var i = 0; i < questionID.system.NUM_QUESTIONS; i++) {
        var questionPage = result.questionPage[i];
        questions.push(new question.Question(questionPage.id,
            questionPage.content.problem,
            result.answerPage.answers[i],
            questionPage.content.solutions));
      }
      return questions;
    });
  }
});