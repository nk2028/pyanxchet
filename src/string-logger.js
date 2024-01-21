export default class StringLogger {
  constructor() {
    this.res = [];
  }

  log(...args) {
    this.res.push(args.join(" "));
  }

  popAll() {
    const tmp = this.res;
    this.res = [];
    return tmp;
  }
}
