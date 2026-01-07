import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import { EventEmitter } from 'eventemitter3';

var Emitter = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(Emitter, _EventEmitter);

  function Emitter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _EventEmitter.call.apply(_EventEmitter, [this].concat(args)) || this;
    _this.EVENT_CHANGE = 'a1';
    _this.EVENT_FULL_SCREEN = 'a2';
    _this.EVENT_VIEW_CHANGE = 'a3';
    _this.EVENT_KEY_DOWN = 'a4';
    _this.EVENT_EDITOR_KEY_DOWN = 'a5';
    _this.EVENT_FOCUS = 'a5';
    _this.EVENT_BLUR = 'a6';
    _this.EVENT_SCROLL = 'a7';
    _this.EVENT_LANG_CHANGE = 'b1';
    return _this;
  }

  return Emitter;
}(EventEmitter);

var globalEmitter = new Emitter();
export { globalEmitter };
export default Emitter;