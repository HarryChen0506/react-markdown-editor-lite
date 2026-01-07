type LangItem = {
    [x: string]: string;
};
declare class I18n {
    private langs;
    private current;
    constructor();
    setUp(): void;
    isAvailable(langName: string): boolean;
    add(langName: string, lang: LangItem): void;
    setCurrent(langName: string): void;
    get(key: string, placeholders?: {
        [x: string]: string;
    }): string;
    getCurrent(): string;
}
declare const i18n: I18n;
export default i18n;
