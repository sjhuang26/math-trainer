import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue';

import app from './math-trainer';

$(() => {
  Vue.component("app-math-trainer", {
    template: "#template-app-math-trainer",
    data: function() {
      return {
        currentPage: 0,
        tests: app.test.testNames,
        test: 0,
        pages: ["Browse", "About", "Print"],
        versions: app.VERSIONS
      };
    },
    methods: {
      navigateTest: function(newTest) {
        this.test = newTest;
      }
    },
    computed: {
      testObject: function() {
        return app.test.tests[this.test];
      }
    }
  });

  Vue.component("app-navigation", {
    props: {
      items: {
        type: Array,
        required: true
      },
      activeItem: {
        type: Number,
        required: true
      }
    },
    methods: {
      activate: function(index) {
        this.$emit("update:activeItem", index);
      }
    },
    template: "#template-app-navigation",
    components: {
      "app-navigation-item": {
        props: {
          active: {
            type: Boolean,
            required: false,
            default: false
          }
        },
        template: "#template-app-navigation-item",
        methods: {
          activate: function() {
            this.$emit("activate");
          }
        }
      }
    }
  });

  Vue.component("app-switcher", {
    props: {
      items: {
        type: Array,
        required: true
      },
      activeItem: {
        type: Number,
        required: true
      }
    },
    template: "#template-app-switcher"
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
      },
      wikiViewLink: {
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
  
  Vue.component("page-about", {
    props: {
      versions: {
        type: Array,
        required: true
      }
    },
    template: "#template-page-about"
  });

  Vue.component("page-browse", {
    props: {
      testObject: {
        type: Object,
        required: true
      }
    },
    data: function() {
      return {
        defaultYear: 2010,
        defaultAlternate: 0,
        defaultQuestion: 1,
        problem: "",
        questionIDText: "",
        solutions: [],
        isLoading: false,
        displayQuestion: false,
        answer: "",
        wikiViewLink: "",
        wikiEditLink: "",
        shortErrorDescription: "",
        longErrorDescription: "",
        isError: false,
        questionPageName: "",
        questionID: undefined
      };
    },
    methods: {
      loadQuestion(questionID) {
        this.questionID = questionID;
        
        this.isLoading = true;
        this.displayQuestion = true;
        this.isError = false;
        var qPage = this.testObject.util.Loader.idToQuestionPage(questionID);
        this.wikiViewLink = app.modules.wikiLoader.getPageURI(qPage);
        this.wikiEditLink = app.modules.wikiLoader.getEditPageURI(qPage);
        this.testObject.util.Loader.loadQuestion(questionID).then(question => {
          this.problem = question.problem;
          this.questionPageName = qPage;
          this.solutions = question.solutions;
          this.answer = question.answer;
          this.endLoad();
        }).catch(reason => {
          var errorArray = app.getLoadErrorMessage(reason, questionID);
          this.endLoad(errorArray[0], errorArray[1]);
        });
      },
      tryAgain() {
        this.loadQuestion(this.questionID);
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
      }
    },
    template: "#template-page-browse"
  });

  Vue.component("page-print", {
    data: function() {
      return {
        onlyShow: 0
      };
    },
    props: {
      testObject: {
        type: Object,
        required: true
      }
    },
    methods: {
      printTest(questionID) {
        window.open("generate.html?test=" + questionID.system.TEST_NAME + "&year=" + questionID.year + "&alternate=" + questionID.alternate + "&onlyLoad=" + this.onlyShowParameter, "_blank");
      }
    },
    computed: {
      onlyShowParameter() {
        switch (this.onlyShow) {
          case 0: return "+problems;";
          case 1: return "+problems;+solutions;+alternateSolutions;";
          case 2: return "+solutions;+alternateSolutions;";
        }
      }
    },
    template: "#template-page-print"
  });
  
  Vue.component("problem-display", {
    props: {
      problem: {
        type: String,
        required: false,
        default: ""
      },
      questionPageName: {
        type: String,
        required: true,
      },
      wikiViewLink: {
        type: String,
        required: false,
        default: "#"
      },
      wikiEditLink: {
        type: String,
        required: false,
        default: "#"
      }
    },
    template: "#template-problem-display"
  });

  Vue.component("solution-display", {
    props: {
      solutions: {
        type: Array,
        required: false,
        default: []
      },
      answer: {
        type: String,
        required: false,
        default: ""
      }
    },
    template: "#template-solution-display"
  });

  Vue.component("solution-toggle", {
    data: function() {
      // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
      var uniqueID = "unique-i-d-";
      var possible = "abcdefghijklmnopqrstuvwxyz";
      
      for (var i = 0; i < 10; i++)
        uniqueID += possible.charAt(Math.floor(Math.random() * possible.length));

      return {
        uniqueID: uniqueID,
        solutionToggleText: "Show solution"
      };
    },
    mounted() {
      $(this.$refs.toggle).on("shown.bs.collapse", (function() {
        this.solutionToggleText = "Hide solution";
      }).bind(this));
      $(this.$refs.toggle).on("hidden.bs.collapse", (function() {
        this.solutionToggleText = "Show solution again";
      }).bind(this));
    },
    template: "#template-solution-toggle"
  });

  Vue.component("ytq-classification-selector", {
    props: {
      testObject: {
        type: Object,
        required: true
      },
      defaultYear: {
        type: Number,
        required: false,
        default: 2010
      },
      defaultQuestion: {
        type: Number,
        required: false,
        default: 1
      },
      defaultAlternate: {
        type: Number,
        required: false,
        default: 0
      },
      showQuestion: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data: function() {
      return {
        year: this.defaultYear,
        alternate: this.defaultAlternate,
        question: this.defaultQuestion
      };
    },
    methods: {
      navigateBack() {
        this.question -= 1;
        this.navigate();
      },
      navigateForward() {
        this.question += 1;
        this.navigate();
      },
      navigate() {
        this.$emit("navigate", this.questionID);
      }
    },
    computed: {
      canBack() {
        return this.testObject.util.ClassificationSystem.isQuestionValid(this.question - 1);
      },
      canForward() {
        return this.testObject.util.ClassificationSystem.isQuestionValid(this.question + 1);
      },
      isValid() {
        return this.testObject.util.ClassificationSystem.isValid({
          year: this.year,
          alternate: this.alternate,
          question: this.question
        });
      },
      isAlternateYear() {
        return this.testObject.util.ClassificationSystem.isAlternateYear(this.year);
      },
      alternates() {
        return this.testObject.util.ClassificationSystem.ALTERNATE_NAMES;
      },
      wikiViewLink() {
        return app.modules.wikiLoader.getPageURI();
      },
      questionID() {
        return new app.ytqid(this.testObject.util.ClassificationSystem,
            this.year, this.alternate, this.question);
      }
    },
    template: "#template-ytq-classification-selector"
  });

  Vue.component("test-select", {
    props: {
      tests: {
        type: Array,
        required: true
      },
      defaultTest: {
        type: Number,
        required: true
      }
    },
    methods: {
      navigate: function() {
        this.$emit("navigate", this.test);
      }
    },
    data: function() {
      return {
        test: this.defaultTest
      };
    },
    template: "#template-test-select"
  });

  Vue.component("version-display", {
    props: {
      versions: {
        type: Array,
        required: true
      }
    },
    template: "#template-version-display"
  });
  
  new Vue({
    el: '#app-math-trainer',
    data: {
    }
  });

  // FOR DEBUG ONLY
  window.debug__mathTrainer = {
    app: app
  };
});