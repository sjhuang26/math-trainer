import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/generate-main.css';
import Vue from 'vue';

import app from './math-trainer';

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
        isError: false,
        shortErrorDescription: "",
        longErrorDescription: "",
        loadProblems: false,
        loadSolutions: false,
        loadAlternateSolutions: false
      };
    },
    mounted() {
      this.load();
    },
    methods: {
      load() {
        this.isLoading = true;
        this.isError = false;

        // https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
        var params = JSON.parse('{"' + decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

        var test = app.test.fromName(params.test);
        var testObject = (test === undefined) ? undefined : test.util;
        var year = parseInt(params.year);
        var alternate = parseInt(params.alternate);
        var onlyLoad = params.onlyLoad;

        this.loadProblems = true;
        this.loadSolutions = true;
        this.loadAlternateSolutions = true;

        if (onlyLoad !== undefined) {
          this.loadProblems = onlyLoad.includes("+problems;"),
          this.loadSolutions = onlyLoad.includes("+solutions;"),
          this.loadAlternateSolutions = onlyLoad.includes("+alternateSolutions;")
        };
        
        if (test === undefined) {
          this.endLoad("Test invalid", "This test does not exist.");
        } else if (year === undefined || alternate === undefined) {
          this.endLoad("Inputs invalid", "Must specify test, year, and alternate.");
        } else if (!testObject.ClassificationSystem.isValid({
          year: year,
          alternate: alternate,
          question: 1
        })) {
          this.endLoad("Inputs invalid", "Test is invalid.");
        } else {
          var testID = new app.ytqid(testObject.ClassificationSystem, year, alternate, 1);
          testObject.Loader.loadTest(testID, this.loadSolutions || this.loadAlternateSolutions).then(questions => {
            this.testTitle = testObject.ClassificationSystem.getTestString(testID);
            this.questions = questions;
            this.endLoad();
          })/*.catch(reason => {
            var errorArray = app.getLoadErrorMessage(reason, testID);
            this.endLoad(errorArray[0], errorArray[1]);
          });*/
        }
      },
      endLoad(shortErrorDescription, longErrorDescription) {
        if (shortErrorDescription === undefined) {
          this.isError = false;
        } else {
          this.isError = true;
          this.shortErrorDescription = shortErrorDescription;
          this.longErrorDescription = longErrorDescription;
        }
        this.isLoading = false;
      },
      printTest() {
        window.print();
      }
    },
    template: "#template-app-output"
  });

  Vue.component("content-embed", {
    props: {
      content: {
        type: String,
        required: true
      }
    },
    template: "#template-content-embed"
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
      },
      shortErrorDescription: {
        type: String,
        required: true
      },
      longErrorDescription: {
        type: String,
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