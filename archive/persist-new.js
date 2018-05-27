define(["data"], function(Data) {
  class Persist extends Data {
    constructor(ob) {
      super(ob);
    }
    
    getSettingObject(key, defaultValue, settingType) {
      return new PersistSetting(this.dataGet.bind(this), key, defaultValue, settingType, this.dataSet.bind(this));
    }
  }

  class PersistSetting {
    constructor() {
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
});