class ClassificationSystem {
  /**
   * @abstract
   */
  get levels() {
    throw new Error("abstract");
  }

  /**
   * @abstract
   */
  isValid(series) {
    throw new Error("abstract");
  }

  constructor() {
  }
}

class ID {
  constructor(system, series) {
    if (!system.isValid(series)) throw new Error("Series is invalid");

    this.system = system;
    this.series = series;
  }
}

class Level {
  constructor (name, typeInformation) {
    this.name = name;
    this.typeInformation = typeInformation;
  }

  mapQualitativeToName(value) {
    return this.typeInformation.nameMap[value];
  }
}

export default {
  ClassificationSystem: ClassificationSystem,
  ID: ID,
  Level: Level
};