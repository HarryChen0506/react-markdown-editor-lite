/**
 * logger: undo redo
 */

const MAX_LOG_SIZE = 100;

class Logger {
  private record: string[] = [];

  private recycle: string[] = [];

  initValue: string = '';

  push(val: string) {
    const result = this.record.push(val);
    // 如果超过了最长限制，把之前的清理掉，避免造成内存浪费
    while (this.record.length > MAX_LOG_SIZE) {
      this.record.shift();
    }
    return result;
  }

  get() {
    return this.record;
  }

  getLast(): string {
    const length = this.record.length;
    return this.record[length - 1];
  }

  undo(skipText?: string) {
    const current = this.record.pop();
    if (typeof current === 'undefined') {
      return this.initValue;
    }
    // 如果最上面的和现在的不一样，那就不需要再pop一次
    if (current !== skipText) {
      this.recycle.push(current);
      return current;
    }
    // 否则的话，最顶上的一个是当前状态，所以要pop两次才能得到之前的结果
    const last = this.record.pop();
    if (typeof last !== 'undefined' && this.record.length === 0) {
      // 如果只剩了初始化值，还是把它给放回去，不然之后就没用的了
      this.record.push(last);
    }
    if (typeof current !== 'undefined') {
      this.recycle.push(current);
    }
    return last || this.initValue;
  }

  redo() {
    const history = this.recycle.pop();
    if (typeof history !== 'undefined') {
      this.push(history);
      return history;
    }
    return undefined;
  }

  cleanRedo() {
    this.recycle = [];
  }

  hasRedo() {
    return this.recycle.length > 0;
  }
}

export default Logger;
