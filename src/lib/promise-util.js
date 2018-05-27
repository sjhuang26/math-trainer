export default class PromiseThreadScheduler {
  constructor(numThreads, initialResult, tasks) {
    this.numThreads = numThreads;
    this.result = initialResult === undefined ? {} : initialResult;
    this.tasks = tasks === undefined ? [] : tasks;
  }

  pickUpNextTask() {
    if (this.tasks.length) {
      return this.tasks.shift()(this.result);
    } else {
      return null;
    }
  }
  
  push(newTask) {
    this.tasks.push(newTask);
  }

  getThread() {
    var next;
    next = () => {
      var nextTask = this.pickUpNextTask();
      if (nextTask === null) {
        return Promise.resolve();
      } else {
        return nextTask.then(next);
      }
    };

    return Promise.resolve().then(next);
  }

  start() {
    var threads = [];
    for (var i = 0; i < this.numThreads; i++) {
      threads.push(this.getThread());
    }
    return Promise.all(threads).then(() => this.result);
  }
};