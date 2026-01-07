"use strict";

exports.__esModule = true;
exports.default = void 0;

/**
 * logger: undo redo
 */
var MAX_LOG_SIZE = 100;

var Logger = /*#__PURE__*/function () {
  function Logger(props) {
    if (props === void 0) {
      props = {};
    }

    this.record = [];
    this.recycle = [];
    this.maxSize = void 0;
    this.initValue = '';
    var _props = props,
        _props$maxSize = _props.maxSize,
        maxSize = _props$maxSize === void 0 ? MAX_LOG_SIZE : _props$maxSize;
    this.maxSize = maxSize;
  }

  var _proto = Logger.prototype;

  _proto.push = function push(val) {
    var result = this.record.push(val); // 如果超过了最长限制，把之前的清理掉，避免造成内存浪费

    while (this.record.length > this.maxSize) {
      this.record.shift();
    }

    return result;
  };

  _proto.get = function get() {
    return this.record;
  };

  _proto.getLast = function getLast() {
    var length = this.record.length;
    return this.record[length - 1];
  };

  _proto.undo = function undo(skipText) {
    var current = this.record.pop();

    if (typeof current === 'undefined') {
      return this.initValue;
    } // 如果最上面的和现在的不一样，那就不需要再pop一次


    if (current !== skipText) {
      this.recycle.push(current);
      return current;
    } // 否则的话，最顶上的一个是当前状态，所以要pop两次才能得到之前的结果


    var last = this.record.pop();

    if (typeof last === 'undefined') {
      // 已经没有更老的记录了，把初始值给出去吧
      this.recycle.push(current);
      return this.initValue;
    } // last 才是真正的上一步


    this.recycle.push(current);
    return last;
  };

  _proto.redo = function redo() {
    var history = this.recycle.pop();

    if (typeof history !== 'undefined') {
      this.push(history);
      return history;
    }

    return undefined;
  };

  _proto.cleanRedo = function cleanRedo() {
    this.recycle = [];
  };

  _proto.getUndoCount = function getUndoCount() {
    return this.undo.length;
  };

  _proto.getRedoCount = function getRedoCount() {
    return this.recycle.length;
  };

  return Logger;
}();

var _default = Logger;
exports.default = _default;