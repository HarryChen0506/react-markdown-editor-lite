/**
 * logger: undo redo
 */

const MAX_LOG_SIZE = 100;

class Logger {
  private record: string[] = [];

  private recycle: string[] = [];

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

  undo(cb?: (obj: string) => void) {
    const lastRecord = this.record.pop();
    if (lastRecord) {
      this.recycle.push(lastRecord);
      if (typeof cb === 'function') {
        cb(this.getLast());
      }
    }
  }

  redo(cb?: (obj: string) => void) {
    const history = this.recycle.pop();
    if (history) {
      this.push(history);
      if (typeof cb === 'function') {
        cb(this.getLast());
      }
    }
  }

  cleanRedo(cb?: () => void) {
    this.recycle = [];
    if (typeof cb === 'function') {
      cb();
    }
  }

  hasUndo() {
    return this.record.length > 0;
  }

  hasRedo() {
    return this.recycle.length > 0;
  }
}

export default Logger;
