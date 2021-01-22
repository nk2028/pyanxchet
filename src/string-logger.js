export default class StringLogger {
  constructor() {
    this.res = [];
  }

  log(...args) {
    this.res.push(args.join(' '));
  }

  tick() {
    this.res = [];
  }

  tock() {
    return this.res.join('\n');
  }
}
