define(["default-test-classes"], (DefaultTestClasses) => {
  class Amc10ClassificationSystem extends YTQClassificationSystem {
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

  return {
    Amc10ClassificationSystem: Amc10ClassificationSystem
  };
});