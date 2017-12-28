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
    },
    "vue": {
      exports: "Vue"
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
    "vue": "https://vuejs.org/js/vue",
    "wiki-loader": "lib/aops-wiki/wiki-loader",
    "wiki-question-parser": "lib/aops-wiki/wiki-question-parser"
  }
});

requirejs(["jquery", "math-trainer", "vue"], ($, app, Vue) => {
  function out(html) {
    $("#output").append(html);
  }

  function outTag(tagName, content, extra) {
    out("<" + tagName + (extra === undefined ? "" : extra) + ">" + content + "</" + tagName + ">");
  }

  $(() => {
    Vue.component("app-output", {
      data() {
        return {
          testTitle: "",
          questions: [],
          isLoading: true,
          isError: false
        };
      },
      mounted() {
        // https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
        var params = JSON.parse('{"' + decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        console.log("Parameters", params);

        if (params.test !== undefined) {
          var testObject = app.test.fromName(params.test).util;
          var testID = new app.ytqid(testObject.ClassificationSystem, parseInt(params.year), parseInt(params.alternate), 1);
          testObject.Loader.loadTestWithSolutions(testID)
              .then(questions => {
            this.testTitle = testObject.ClassificationSystem.getTestString(testID);
            this.questions = questions;
            this.endLoad();
          });
        } else {
          this.endLoad("Parameters incorrect");
        }
      },
      methods: {
        endLoad(error) {
          if (error === undefined) {
            this.isLoading = false;
            this.isError = false;
          } else {
            this.isLoading = false;
            this.isError = true;
          }
        },
      },
      template: "#template-app-output"
    });

    Vue.component("loader", {
      props: {
        isLoading: {
          type: Boolean,
          required: true
        },
        isError: {
          type: Boolean,
          required: true
        }
      },
      methods: {
        tryAgain: function() {
          this.$emit("try-again");
        }
      },
      template: "#template-loader"
    });

    Vue.component("problem-row", {
      props: {
        number: {
          type: [String, Number],
          required: true
        },
        content: {
          type: String,
          required: true
        }
      },
      template: "#template-problem-row"
    });

    Vue.component("solution-row", {
      props: {
        number: {
          type: [String, Number],
          required: true
        },
        solution: {
          type: String,
          required: true
        },
        answer: {
          type: [String, Number],
          required: true
        }
      },
      template: "#template-solution-row"
    });

    Vue.component("alternate-solution-row", {
      props: {
        number: {
          type: [String, Number],
          required: true
        },
        solutions: {
          type: Array,
          required: true
        }
      },
      template: "#template-alternate-solution-row"
    });

    new Vue({
      el: '#app-output',
      data: {
      }
    });
  });
});