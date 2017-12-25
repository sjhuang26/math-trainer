define(["pathjs"], (pathjs) => {
  class ObjectManager {
    constructor(data) {
      this.data = data;
      this.children = [];
    }

    static get CHILD_CONSTRUCTOR() {
      return ObjectManagerChild;
    }

    erase() {
      this.writeData({});
    }

    get dataGet() {
      return this.data;
    }

    get dataSet() {
      return this.data;
    }

    rebuild() {
      throw new Error("abstract");
    }

    getObject(path) {
      return pathjs.Path.getPathObject(path).follow(this.data, true);
    }

    getObjectManager(path, newConstructor) {
      if (newConstructor === undefined) newConstructor = this.constructor.CHILD_CONSTRUCTOR;
      var objectManager = new newConstructor(this, path);
      this.children.push(objectManager);
      return objectManager;
    }

    writeData(newData) {
      this.data = newData;
      this.rebuild();
    }
  }

  class ObjectManagerChild extends ObjectManager {
    constructor(parent, path) {
      path = pathjs.Path.getPathObject(path);
      super(path.follow(parent.data, true));
      this.path = path;
      this.parent = parent;
    }

    rebuild() {
      this.data = this.path.follow(this.parent.data, true);
    }

    getObjectManager(path, newConstructor) {
      if (newConstructor === undefined) newConstructor = this.constructor;
      var objectManager = new newConstructor(this, path);
      this.children.push(objectManager);
      return objectManager;
    }
  }
  
  class ObjectManagerParent extends ObjectManager {
    constructor(data) {
      super(data);
    }

    rebuild() {
      // recursively reset
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].rebuild();
      }
    }
  }

  return {
    ObjectManager: ObjectManager,
    ObjectManagerChild: ObjectManagerChild,
    ObjectManagerParent: ObjectManagerParent
  };
});