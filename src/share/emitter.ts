import EventEmitter from 'eventemitter3';

class Emitter extends EventEmitter {
  EVENT_CHANGE = 'a1';
}
const emitter = new Emitter();

export default emitter;
