import { KeyConfigs } from "./parser.interface.mjs";
export interface HiraganaParserOptions {
    hiraganas: string;
    configs?: KeyConfigs;
}
/**
 * タイピングゲーム向けのパーサー
 * パースしたいひらがなを引数に渡して初期化します
 */
export declare class HiraganaParser {
    /** パーサーのオプション */
    private options;
    private roman;
    private answers;
    private _inputedRoma;
    get inputedRoma(): string;
    get notInputedRoma(): string;
    private _inputedHiragana;
    get inputedHiragana(): string;
    get notInputedHiragana(): string;
    constructor(options: HiraganaParserOptions);
    /**
     * 次の文字を入力する、入力を受け入れたらtrueを返す
     */
    input: (char: string) => boolean;
    /**
     * 入力が完了しているかどうか
     */
    isComplete: () => boolean;
}
//# sourceMappingURL=game.d.mts.map