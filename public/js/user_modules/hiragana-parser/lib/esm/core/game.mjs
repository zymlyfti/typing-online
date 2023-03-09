import { makeAnswers, romaToHiranaga } from "./converter.mjs";
import { hiraganaToRomans } from "./parser.mjs";
/**
 * タイピングゲーム向けのパーサー
 * パースしたいひらがなを引数に渡して初期化します
 */
export class HiraganaParser {
    /** パーサーのオプション */
    options;
    roman;
    answers;
    _inputedRoma = '';
    get inputedRoma() {
        return this._inputedRoma;
    }
    get notInputedRoma() {
        const answer = this.answers.find(answer => answer.startsWith(this._inputedRoma));
        if (answer) {
            return answer.replace(this._inputedRoma, '');
        }
        return answer ?? '';
    }
    _inputedHiragana = '';
    get inputedHiragana() {
        return this._inputedHiragana;
    }
    get notInputedHiragana() {
        return this.options.hiraganas.replace(this._inputedHiragana, '');
    }
    constructor(options) {
        this.options = options;
        this.roman = hiraganaToRomans(options.hiraganas, options.configs);
        this.answers = makeAnswers(this.roman).sort((a, b) => { return a.length - b.length; });
    }
    /**
     * 次の文字を入力する、入力を受け入れたらtrueを返す
     */
    input = (char) => {
        const newInputedString = `${this._inputedRoma}${char}`;
        const canInput = this.answers.some(answer => answer.startsWith(newInputedString));
        if (canInput) {
            this._inputedRoma = newInputedString;
        }
        // ここでひらがな探す
        this._inputedHiragana = romaToHiranaga(this.roman, this.inputedRoma);
        return canInput;
    };
    /**
     * 入力が完了しているかどうか
     */
    isComplete = () => {
        return this.answers.some(answer => answer === this._inputedRoma);
    };
}
