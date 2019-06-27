/**
 * logger: undo redo
 */

class Logger {  

  private record: string[] = []

  private recycle: string[] = []

  pushRecord(val: string) {
    return this.record.push(val);
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
      typeof cb === 'function' && cb(this.getLastRecord());
    }
  }

  redo(cb?: (obj: string) => void) {
    const history = this.recycle.pop();
    if (history) {
      this.record.push(history);
      typeof cb === 'function' && cb(this.getLastRecord());
    }    
  }

  cleanRedoList(cb?: () => void) {
    this.recycle = [];
    typeof cb === 'function' && cb();
  }
}

export default Logger