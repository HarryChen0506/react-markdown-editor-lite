/**
 * logger: undo redo
 */

class Logger {  

  name = 'logger'

  record = []

  recycle = []

  pushRecord(val) {
    return this.record.push(val)
  }

  getRecord() {
    return this.record
  }

  getLastRecord() {
    const length = this.record.length
    return this.record[length - 1]
  }

  undo(cb) {
    const lastRecord = this.record.pop()
    this.recycle.push(lastRecord)
    typeof cb === 'function' && cb(this.getLastRecord())
  }

  redo(cb) {
    if (this.recycle.length > 0) {
      const history = this.recycle.pop()
      this.record.push(history)
      typeof cb === 'function' && cb(this.getLastRecord())
    }    
  }

  cleanRedoList(cb) {
    this.recycle = []
    typeof cb === 'function' && cb()
  }
}

export default Logger