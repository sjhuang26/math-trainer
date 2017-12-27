requirejs.config({
  shim: {
    "bootstrap": {
      deps: ["jquery", "popper-loader"]
    },
    "popperjs": {
      deps: ["jquery"],
      init: function(p) {
        window.Popper = p;
      }
    }
  },
  paths: {
    "aime-util": "lib/aime/aime-util",
    "amc-10-util": "lib/amc-10/amc-10-util",
    "amc-12-util": "lib/amc-12/amc-12-util",
    "classification-system": "lib/question/classification-system",
    "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min",
    "jquery": "https://code.jquery.com/jquery-3.2.1.min",
    "math-trainer": "math-trainer",
    "pathjs": "lib/pathjs",
    "promise-util" :"lib/promise-util",
    "popperjs": "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min",
    "popper-loader": "popper-loader",
    "question": "lib/question/question",
    "question-loader": "lib/question/question-loader",
    "wiki-loader": "lib/aops-wiki/wiki-loader",
    "wiki-question-parser": "lib/aops-wiki/wiki-question-parser"
  }
});

requirejs(["jquery", "math-trainer"], ($, app) => {
  function out(html) {
    $("#output").append(html);
  }

  function outTag(tagName, content, extra) {
    out("<" + tagName + (extra === undefined ? "" : extra) + ">" + content + "</" + tagName + ">");
  }

  $(() => {
    // https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
    var params = JSON.parse('{"' + decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    console.log(params);
    if (params.question !== undefined) {
      var testObject = app.test.fromName(params.test).util;
      testObject.Loader.loadQuestion(new app.ytqid(testObject.ClassificationSystem, parseInt(params.year), parseInt(params.alternate), parseInt(params.question)))
          .then(question => {
        outTag("h1", testObject.ClassificationSystem.getString(question.questionID));
        outTag("h2", "Problem");
        out(question.problem);
        outTag("p", "Answer: " + question.answer, ' class="lead"');
        for (var i = 0; i < question.solutions.length; i++) {
          outTag("h2", "Solution " + (i + 1));
          out(question.solutions[i]);
        }
      });
    } else {
      var testObject = app.test.fromName(params.test).util;
      var testID = new app.ytqid(testObject.ClassificationSystem, parseInt(params.year), parseInt(params.alternate), 1);
      testObject.Loader.loadTestWithSolutions(testID)
          .then(questions => {
        outTag("h1", testObject.ClassificationSystem.getTestString(testID));
        for (var question of questions) {
          outTag("h2", "Question " + question.questionID.question);
          outTag("h3", "Problem");
          out(question.problem);
          outTag("p", "Answer: " + question.answer, ' class="lead font-weight-bold"');
          for (var i = 0; i < question.solutions.length; i++) {
            outTag("h4", "Solution " + (i + 1));
            out(question.solutions[i]);
          }
        }
      });
    }
  });
});