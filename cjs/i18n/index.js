"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _emitter = require("../share/emitter");

var _enUS = _interopRequireDefault(require("./lang/en-US"));

var _zhCN = _interopRequireDefault(require("./lang/zh-CN"));

var I18n = /*#__PURE__*/function () {
  function I18n() {
    this.langs = {
      enUS: _enUS.default,
      zhCN: _zhCN.default
    };
    this.current = 'enUS';
    this.setUp();
  }

  var _proto = I18n.prototype;

  _proto.setUp = function setUp() {
    if (typeof window === 'undefined') {
      // 不在浏览器环境中，取消检测
      return;
    }

    var locale = 'enUS'; // 检测语言

    if (navigator.language) {
      var it = navigator.language.split('-');
      locale = it[0];

      if (it.length !== 1) {
        locale += it[it.length - 1].toUpperCase();
      }
    } // IE10及更低版本使用browserLanguage
    // @ts-ignore


    if (navigator.browserLanguage) {
      // @ts-ignore
      var _it = navigator.browserLanguage.split('-');

      locale = _it[0];

      if (_it[1]) {
        locale += _it[1].toUpperCase();
      }
    }

    if (this.current !== locale && this.isAvailable(locale)) {
      this.current = locale;

      _emitter.globalEmitter.emit(_emitter.globalEmitter.EVENT_LANG_CHANGE, this, locale, this.langs[locale]);
    }
  };

  _proto.isAvailable = function isAvailable(langName) {
    return typeof this.langs[langName] !== 'undefined';
  };

  _proto.add = function add(langName, lang) {
    this.langs[langName] = lang;
  };

  _proto.setCurrent = function setCurrent(langName) {
    if (!this.isAvailable(langName)) {
      throw new Error("Language " + langName + " is not exists");
    }

    if (this.current !== langName) {
      this.current = langName;

      _emitter.globalEmitter.emit(_emitter.globalEmitter.EVENT_LANG_CHANGE, this, langName, this.langs[langName]);
    }
  };

  _proto.get = function get(key, placeholders) {
    var str = this.langs[this.current][key] || '';

    if (placeholders) {
      Object.keys(placeholders).forEach(function (k) {
        str = str.replace(new RegExp("\\{" + k + "\\}", 'g'), placeholders[k]);
      });
    }

    return str;
  };

  _proto.getCurrent = function getCurrent() {
    return this.current;
  };

  return I18n;
}();

var i18n = new I18n();
var _default = i18n;
exports.default = _default;