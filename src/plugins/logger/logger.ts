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

  undo() {
    if (!this.hasUndo()) {
      return undefined;
    }
    const current = this.record.pop();
    if (current !== undefined) {
      this.recycle.push(current);
    }
    return this.getLast();
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

  hasUndo() {
    return this.record.length > 1;
  }

  hasRedo() {
    return this.recycle.length > 0;
  }
}

export default Logger;
