/**
 * logger: undo redo
 */
interface LoggerProps {
    maxSize?: number;
}
declare class Logger {
    private record;
    private recycle;
    private maxSize;
    initValue: string;
    constructor(props?: LoggerProps);
    push(val: string): number;
    get(): string[];
    getLast(): string;
    undo(skipText?: string): string;
    redo(): string;
    cleanRedo(): void;
    getUndoCount(): number;
    getRedoCount(): number;
}
export default Logger;
