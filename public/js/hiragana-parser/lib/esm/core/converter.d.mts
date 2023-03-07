import { Roman } from "./parser.mjs";
import { KeyConfigs } from "./parser.interface.mjs";
/**
 * ひらがなからローマ字入力できる組み合わせを全部返す
 */
export declare const hiraganaToRomas: (hiraganas: string, configs?: KeyConfigs) => string[];
/**
 * Romanのツリー構造を後ろに辿っていって、ローマ字入力できる組み合わせを作る
 */
export declare const makeAnswers: (roman: Roman, answers?: string[]) => string[];
/**
 * Romanのツリー構造から、入力済みのローマ字からパースできるひらがなで適切そうなものを返す
 * FIXME: このへんのロジック突貫工事で汚いから直したい
 */
export declare const romaToHiranaga: (roman: Roman, inputedRoma: string) => string;
//# sourceMappingURL=converter.d.mts.map