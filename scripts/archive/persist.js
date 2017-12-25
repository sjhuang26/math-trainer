define(["storagejs"], function(storagejs) {
  class PersistObjectManagerChild extends storagejs.StorageObjectManagerChild {
    constructor(parent, path) {
      super(parent, path);
    }

    getSettingObject(key, defaultValue, settingType) {
      return new PersistSetting(this.data, key, defaultValue, settingType, this.save.bind(this));
    }
  }

  class PersistObjectManagerParent extends storagejs.StorageObjectManagerParent {
    static get CHILD_CONSTRUCTOR() {
      return PersistObjectManagerChild;
    }

    constructor(namespace, initialData, forceReset) {
      super(namespace, initialData, forceReset);
    }

    getSettingObject(key, defaultValue, settingType) {
      return new PersistSetting(this.data, key, defaultValue, settingType, this.save.bind(this));
    }
  }

  class PersistSetting {
    constructor(data, key, defaultValue, settingType, save) {
      this.data = data;
      this.key = key;
      this.defaultValue = defaultValue;
      this.settingType = settingType;
      this.save = save;
    }

    getSetting() {
      var d = this.data[this.key] === undefined ? this.defaultValue : this.data[this.key];
      switch (this.settingType) {
        case Number:
          return Number.parseFloat(d);
        default:
          return d;
      }
    }

    setSetting(newValue) {
      this.data[this.key] = newValue;
      this.save();
    }

    onlyOnce() {
      if (this.getSetting()) {
        return false;
      } else {
        this.setSetting(true);
        return true;
      }
    }
  }

  return {
    PersistObjectManagerChild: PersistObjectManagerChild,
    PersistObjectManagerParent: PersistObjectManagerParent
  };
});