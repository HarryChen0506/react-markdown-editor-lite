interface Decorated {
    text: string;
    newBlock?: boolean;
    selection?: {
        start: number;
        end: number;
    };
}
/**
 * 获取装饰后的Markdown文本
 * @param target 原文字
 * @param type 装饰类型
 * @param option 附加参数
 * @returns {Decorated}
 */
declare function getDecorated(target: string, type: string, option?: any): Decorated;
export default getDecorated;
