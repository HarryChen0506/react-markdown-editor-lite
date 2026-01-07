function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

export function deepClone(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  var objArray = Array.isArray(obj) ? [] : {};

  if (obj && typeof obj === 'object') {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // 如果obj的属性是对象，递归操作
        if (obj[key] && typeof obj[key] === 'object') {
          objArray[key] = deepClone(obj[key]);
        } else {
          objArray[key] = obj[key];
        }
      }
    }
  }

  return objArray;
}
export function isEmpty(obj) {
  // 判断字符是否为空的方法
  return typeof obj === 'undefined' || obj === null || obj === '';
}
export function isPromise(obj) {
  return obj && (obj instanceof Promise || (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function');
}
export function repeat(str, num) {
  var result = '';
  var n = num;

  while (n--) {
    result += str;
  }

  return result;
}
export function isKeyMatch(event, cond) {
  var withKey = cond.withKey,
      keyCode = cond.keyCode,
      key = cond.key,
      aliasCommand = cond.aliasCommand;
  var e = {
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    altKey: event.altKey,
    shiftKey: event.shiftKey,
    keyCode: event.keyCode,
    key: event.key
  };

  if (aliasCommand) {
    e.ctrlKey = e.ctrlKey || e.metaKey;
  }

  if (withKey && withKey.length > 0) {
    for (var _iterator = _createForOfIteratorHelperLoose(withKey), _step; !(_step = _iterator()).done;) {
      var it = _step.value;

      if (typeof e[it] !== 'undefined' && !e[it]) {
        return false;
      }
    }
  } else {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return false;
    }
  }

  if (e.key) {
    return e.key === key;
  } else {
    return e.keyCode === keyCode;
  }
}
export function getLineAndCol(text, pos) {
  var lines = text.split('\n');
  var beforeLines = text.substr(0, pos).split('\n');
  var line = beforeLines.length;
  var col = beforeLines[beforeLines.length - 1].length;
  var curLine = lines[beforeLines.length - 1];
  var prevLine = beforeLines.length > 1 ? beforeLines[beforeLines.length - 2] : null;
  var nextLine = lines.length > beforeLines.length ? lines[beforeLines.length] : null;
  return {
    line: line,
    col: col,
    beforeText: text.substr(0, pos),
    afterText: text.substr(pos),
    curLine: curLine,
    prevLine: prevLine,
    nextLine: nextLine
  };
}