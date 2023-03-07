import { KeyConfigs } from "./parser.interface.mjs";
/**
 * Romanのツリー構造を返す
 */
export declare const hiraganaToRomans: (hiraganas: string, configs?: KeyConfigs) => Roman;
export declare class Roman {
    roma: string;
    children: Roman[];
    parent: Roman | undefined;
    hiragana: string;
    constructor(roma: string, hiragana: string);
    addChild(roman: Roman): void;
}
//# sourceMappingURL=parser.d.mts.map