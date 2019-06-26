/**
 * logger: undo redo
 */

class Logger {  

  private name = 'logger'

  private record: any[] = []

  private recycle: any[] = []

  pushRecord(val: any) {
    return this.record.push(val)
  }

  getRecord() {
    return this.record
  }

  getLastRecord(): any {
    const length = this.record.length
    return this.record[length - 1]
  }

  undo(cb?: (obj: any) => void) {
    const lastRecord = this.record.pop()
    this.recycle.push(lastRecord)
    typeof cb === 'function' && cb(this.getLastRecord())
  }

  redo(cb?: (obj: any) => void) {
    if (this.recycle.length > 0) {
      const history = this.recycle.pop()
      this.record.push(history)
      typeof cb === 'function' && cb(this.getLastRecord())
    }    
  }

  cleanRedoList(cb?: () => void) {
    this.recycle = []
    typeof cb === 'function' && cb()
  }
}

export default Logger