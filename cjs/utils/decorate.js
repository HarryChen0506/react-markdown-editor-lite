"use strict";

exports.__esModule = true;
exports.default = void 0;

var _tool = require("./tool");

// 最简单的Decorator，即在现有文字的基础上加上前缀、后缀即可
var SIMPLE_DECORATOR = {
  bold: ['**', '**'],
  italic: ['*', '*'],
  underline: ['++', '++'],
  strikethrough: ['~~', '~~'],
  quote: ['\n> ', '\n'],
  inlinecode: ['`', '`'],
  code: ['\n```\n', '\n```\n']
}; // 插入H1-H6

for (var i = 1; i <= 6; i++) {
  SIMPLE_DECORATOR["h" + i] = ["\n" + (0, _tool.repeat)('#', i) + " ", '\n'];
}

function decorateTableText(option) {
  var _option$row = option.row,
      row = _option$row === void 0 ? 2 : _option$row,
      _option$col = option.col,
      col = _option$col === void 0 ? 2 : _option$col;
  var rowHeader = ['|'];
  var rowData = ['|'];
  var rowDivision = ['|'];
  var colStr = '';

  for (var _i = 1; _i <= col; _i++) {
    rowHeader.push(' Head |');
    rowDivision.push(' --- |');
    rowData.push(' Data |');
  }

  for (var j = 1; j <= row; j++) {
    colStr += '\n' + rowData.join('');
  }

  return rowHeader.join('') + "\n" + rowDivision.join('') + colStr;
}

function decorateList(type, target) {
  var text = target;

  if (text.substr(0, 1) !== '\n') {
    text = '\n' + text;
  }

  if (type === 'unordered') {
    return text.length > 1 ? text.replace(/\n/g, '\n* ').trim() : '* ';
  } else {
    var count = 1;

    if (text.length > 1) {
      return text.replace(/\n/g, function () {
        return "\n" + count++ + ". ";
      }).trim();
    } else {
      return '1. ';
    }
  }
}

function createTextDecorated(text, newBlock) {
  return {
    text: text,
    newBlock: newBlock,
    selection: {
      start: text.length,
      end: text.length
    }
  };
}
/**
 * 获取装饰后的Markdown文本
 * @param target 原文字
 * @param type 装饰类型
 * @param option 附加参数
 * @returns {Decorated}
 */


function getDecorated(target, type, option) {
  if (typeof SIMPLE_DECORATOR[type] !== 'undefined') {
    return {
      text: "" + SIMPLE_DECORATOR[type][0] + target + SIMPLE_DECORATOR[type][1],
      selection: {
        start: SIMPLE_DECORATOR[type][0].length,
        end: SIMPLE_DECORATOR[type][0].length + target.length
      }
    };
  }

  switch (type) {
    case 'tab':
      var inputValue = option.tabMapValue === 1 ? '\t' : ' '.repeat(option.tabMapValue);
      var newSelectedText = inputValue + target.replace(/\n/g, "\n" + inputValue);
      var lineBreakCount = target.includes('\n') ? target.match(/\n/g).length : 0;
      return {
        text: newSelectedText,
        selection: {
          start: option.tabMapValue,
          end: option.tabMapValue * (lineBreakCount + 1) + target.length
        }
      };

    case 'unordered':
      return createTextDecorated(decorateList('unordered', target), true);

    case 'order':
      return createTextDecorated(decorateList('order', target), true);

    case 'hr':
      return createTextDecorated('---', true);

    case 'table':
      return {
        text: decorateTableText(option),
        newBlock: true
      };

    case 'image':
      return {
        text: "![" + (target || option.target) + "](" + (option.imageUrl || '') + ")",
        selection: {
          start: 2,
          end: target.length + 2
        }
      };

    case 'link':
      return {
        text: "[" + target + "](" + (option.linkUrl || '') + ")",
        selection: {
          start: 1,
          end: target.length + 1
        }
      };
  }

  return {
    text: target,
    selection: {
      start: 0,
      end: target.length
    }
  };
}

var _default = getDecorated;
exports.default = _default;