define(["object-manager", "storejs", "deepmerge", "pathjs"], (objectManager, store, deepmerge, pathjs) => {
  class StorageManager {
    constructor(namespace, initialData, forceReset) {
      // specifies which local variables will be used -- {{ namespace }} and {{ namespace }}__modifications 
      this.namespace = namespace;

      // the storage for the data
      this.dataStorage = new StorageObjectManager(this.namespace, this.initialData, this.forceReset);
      
      // the storage for modifications to this data
      // Set to this object.
      this.modificationsStorage = new StorageObjectManager(this.namespace + "__modifications", {});

      // the model, an unstored object which always has an accurate representation of the data for getting.
      // Get from this object.
      this.model = this.saveModificationsToData();
    }

    saveModifications() {
      this.modificationsStorage.save();
    }

    saveModificationsToData() {
      this.model = deepmerge(this.dataStorage.data, this.modificationsStorage.data);
      this.dataStorage.save(this.model);

      // Wipe the modifications storage
      this.modificationsStorage.erase();
      this.modificationsStorage.save();
    }
  }

  class StorageObjectManagerChild extends objectManager.ObjectManagerChild {
    constructor(parent, path) {
      super(parent, path);
    }

    load() {
      this.parent.load();
    }

    save(newData) {
      if (newData !== undefined) this.writeData(newData);

      this.parent.save();
    }
  }

  class StorageObjectManagerParent extends objectManager.ObjectManagerParent {
    static get CHILD_CONSTRUCTOR() {
      return StorageObjectManagerChild;
    }
    
    constructor(namespace, initialData, forceReset) {
      super();

      this.namespace = namespace;
      this.forceReset = forceReset;
      this.branches = [];
      
      initialData = initialData === undefined ? {} : initialData;

      if (forceReset) {
        this.data = initialData;
        this.save();
      } else {
        this.load();
        if (this.data === undefined) {
          this.data = initialData;
          this.save();
        }
      }
    }
    
    getBranch(path) {
      return this.branches[pathjs.Path.getPathObject(path).toStringAppendable()];
    }
    
    branch(path, initialData, forceReset) {
      var branchString = pathjs.Path.getPathObject(path).toStringAppendable();
      var branch = new StorageObjectManagerParent(this.namespace + branchString,
          initialData === undefined ? {} :
          initialData, forceReset === undefined ? this.forceReset : forceReset);
      
      this.branches[branchString] = branch;

      return branch;
    }

    load() {
      this.data = store.get(this.namespace);
    }

    save(newData) {
      if (newData !== undefined) this.writeData(newData);

      store.set(this.namespace, this.data);
    }
  }

  return {
    StorageManager: StorageManager,
    StorageObjectManagerChild: StorageObjectManagerChild,
    StorageObjectManagerParent: StorageObjectManagerParent
  };
});