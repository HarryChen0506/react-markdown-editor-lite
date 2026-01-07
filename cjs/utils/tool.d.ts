/// <reference types="react" />
import { KeyboardEventCondition } from '../share/var';
export declare function deepClone(obj: any): any;
export declare function isEmpty(obj: any): boolean;
export declare function isPromise(obj: any): obj is Promise<any>;
export declare function repeat(str: string, num: number): string;
export declare function isKeyMatch(event: React.KeyboardEvent<HTMLDivElement>, cond: KeyboardEventCondition): boolean;
export declare function getLineAndCol(text: string, pos: number): {
    line: number;
    col: number;
    beforeText: string;
    afterText: string;
    curLine: string;
    prevLine: string;
    nextLine: string;
};
