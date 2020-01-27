import { EventEmitter } from 'eventemitter3';

class Emitter extends EventEmitter {
  EVENT_CHANGE = 'a1';
  EVENT_LANG_CHANGE = 'b1';
}
const emitter = new Emitter();

export default emitter;
