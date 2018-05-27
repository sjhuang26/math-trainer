define(["object-manager"], (objectManager) => {
  var CacheMixin = Base => class extends Base {
    eraseKey() {
      this.eraseRawKey(this.getKey.apply(null, arguments));
    }

    eraseRawKey(key) {
      this.dataSet[key] = undefined;
    }
    
    fetch() {
      return (this.getValueIsPromise ? this.fetchWithFunction : this.fetchWithPromise).apply(this, arguments);
    }

    fetchWithFunction() {
      var key = this.getKey.apply(null, arguments);
      var value = this.dataGet[key];
      if (value === undefined) {
        value = this.getValue.apply(null, arguments);
        this.dataSet[key] = value;
      }
      return value;
    }
    
    fetchWithPromise() {
      var key = this.getKey.apply(null, arguments);
      var value = this.dataGet[key];
      if (value === undefined) {
        return this.getValue.apply(null, arguments).then(value => {
          this.dataSet[key] = value;
          return value;
        });
      }
      
      return Promise.resolve(value);
    }
  };

  class CacheManagerChild extends CacheMixin(objectManager.ObjectManagerChild) {
    constructor(parent, path, getKey, getValue, getValueIsPromise) {
      super(parent, path);
      this.getKey = getKey;
      this.getValue = getValue;
      this.getValueIsPromise = !!getValueIsPromise;
    }
  }

  class CacheManagerParent extends CacheMixin(objectManager.ObjectManagerParent) {
    constructor(data, getKey, getValue, getValueIsPromise) {
      super(data);
      this.getKey = getKey;
      this.getValue = getValue;
      this.getValueIsPromise = !!getValueIsPromise;
    }
  }

  return {
    CacheManagerChild: CacheManagerChild,
    CacheManagerParent: CacheManagerParent
  };
});