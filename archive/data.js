define(() => {
  return class Data {
    constructor(ob) {
      this.dataObject = ob instanceof Data ? ob.dataObject : ob; 
    }

    get dataGet() {
      return this.dataObject;
    }

    set dataSet(newValue) {
      this.dataObject = newValue;
    }
  };
});