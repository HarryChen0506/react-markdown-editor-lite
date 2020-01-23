/**
 * logger: undo redo
 */

const MAX_LOG_SIZE = 100;

class Logger {
  private record: string[] = [];

  private recycle: string[] = [];

  pushRecord(val: string) {
    const result = this.record.push(val);
    // 如果超过了最长限制，把之前的清理掉，避免造成内存浪费
    while (this.record.length > MAX_LOG_SIZE) {
      this.record.shift();
    }
    return result;
  }

  getRecord() {
    return this.record;
  }

  getLastRecord(): string {
    const length = this.record.length;
    return this.record[length - 1];
  }

  undo(cb?: (obj: string) => void) {
    const lastRecord = this.record.pop();
    if (lastRecord) {
      this.recycle.push(lastRecord);
      if (typeof cb === 'function') {
        cb(this.getLastRecord());
      }
    }
  }

  redo(cb?: (obj: string) => void) {
    const history = this.recycle.pop();
    if (history) {
      this.pushRecord(history);
      if (typeof cb === 'function') {
        cb(this.getLastRecord());
      }
    }
  }

  cleanRedoList(cb?: () => void) {
    this.recycle = [];
    if (typeof cb === 'function') {
      cb();
    }
  }
}

export default Logger;
