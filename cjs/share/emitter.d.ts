import { EventEmitter } from 'eventemitter3';
declare class Emitter extends EventEmitter {
    EVENT_CHANGE: string;
    EVENT_FULL_SCREEN: string;
    EVENT_VIEW_CHANGE: string;
    EVENT_KEY_DOWN: string;
    EVENT_EDITOR_KEY_DOWN: string;
    EVENT_FOCUS: string;
    EVENT_BLUR: string;
    EVENT_SCROLL: string;
    EVENT_LANG_CHANGE: string;
}
declare const globalEmitter: Emitter;
export { globalEmitter };
export default Emitter;
