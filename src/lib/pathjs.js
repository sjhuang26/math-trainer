/**
 * Represents a path of keys that can be followed through an object. For
 * example, the path ["a", "b", "c"] can be followed through the object ob to
 * get the property "ob.a.b.c".
 */
export default class Path {
  static get DELIMITER() {
    return "__";
  }

  static getDelimiter(delimiter) {
    return delimiter === undefined ? this.DELIMITER : delimiter;
  }

  /**
   * Get a new Path instance from either an existing Path object (simply
   * returns back the object) or a String array.
   * @param {(Path|string[])} object The object that the Path will be
   * generated from.
   * @returns {Path} The Path object generated.
   */
  static getPathObject(a) {
    if (a instanceof Path) {
      return a;
    } else {
      return new Path(a);
    }
  }

  /**
   * Creates a new Path.
   * @constructor
   * @param {string[]} path The path array for this Path object.
   */
  constructor(path) {
    this.path = path;
  }
  
  /**
   * Follow the path through a certain object. This method is overloaded and
   * will call either followObject or followGlobal.
   * @param {*} [a] The first argument.
   * @param {*} [b] The second argument.
   * @see followObject
   * @see followGlobal
   * @returns The resulting followed object.
   */
  follow(a, b) {
    // length 0: call global()
    if (a === undefined) return this.followGlobal(false);
    
    // length 1: could be either object(ob, false) or global(boolean).
    if (b === undefined) {
      if (a === true || a === false) {
        return this.followGlobal(a);
      } else {
        return this.followObject(a, false);
      }
    }
    
    // length 2: must be followObject(ob, boolean)
    return this.followObject(a, b);
  }
  
  /**
   * Follow an object.
   * @param {Object} ob The object.
   * @param {boolean} [createPath=false] Whether to create objects if the path
   * dosen't exist.
   * @returns {Object} The resulting object after following.
   */
  followObject(ob, createPath) {
    var a = ob;
    for (var i = 0; i < this.path.length; i++) {
      var item = this.path[i];

      if (a[item] === undefined && createPath) a[item] = {};
      
      a = a[item];
    }
    return a;
  }
  
  /**
   * Follow the global object (ie. window).
   * @param {boolean} [createPath Whether to create objects if the path doesn't
   * exist.
   * @param 
   */
  followGlobal(createPath) {
    return this.followObject(window, createPath);
  }

  toString(delimiter) {
    return this.path.join(this.constructor.getDelimiter(delimiter));
  }

  toStringAppendable(delimiter) {
    return this.constructor.getDelimiter(delimiter) + this.toString(delimiter);
  }
};