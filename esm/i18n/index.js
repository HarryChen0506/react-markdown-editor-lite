import { globalEmitter } from '../share/emitter';
import enUS from './lang/en-US';
import zhCN from './lang/zh-CN';

var I18n = /*#__PURE__*/function () {
  function I18n() {
    this.langs = {
      enUS: enUS,
      zhCN: zhCN
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
      globalEmitter.emit(globalEmitter.EVENT_LANG_CHANGE, this, locale, this.langs[locale]);
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
      globalEmitter.emit(globalEmitter.EVENT_LANG_CHANGE, this, langName, this.langs[langName]);
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
export default i18n;