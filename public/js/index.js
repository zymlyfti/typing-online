import { HiraganaParser } from './hiragana-parser/lib/esm/index.mjs';

/*
-------------------------------------

速度改善
- jqueryのcss操作は禁止。元と後の状態のclassを作っておいて対応する。
- 同じDOMを2回以上参照する場合は変数にいれる
- booleanは厳密な比較を用いる(===)

-------------------------------------
*/

//全てのDOMの読み込みが終わってから処理を開始
$(document).ready(function() {

const socket = io();

//const $se = $('#btnsound');
const seMiss = new Audio('/miss.wav');
const seKeydown = new Audio('/keydown.wav');
const $body = $('body');
const $questionField = $('#question-field');
const $questionKanji = $('#question-kanji');
const $questionText = $('#question-text');
const $questionRoma = $('#question-roma');

let questionTextKanji = 'もし採用をだしたら入社していただけますか';
let questionText = 'もしさいようをだしたらにゅうしゃしていただけますか';
let checkMiss = 'initialize';
let typeCount = 0;
let missCount = 0;
let startTime,endTime;


//1つの設問に対応するように1つのparserインスタンスを事前に生成しておく
//押されたキーをparser.inputで送ると、そのキーが正しいか自動で判定され、
//今までに入力した文字列(1)と、まだ打ち残っている文字列(2)を返す。
//そして次の文字をinputで再び受け付ける。
//正しい入力のキーをinputに渡した場合、(1)(2)が更新される。
//そして(2)がだんだん減っていき、空になったらisComplete()がtrueとなる。

$questionKanji.html(questionTextKanji);
$questionText.html(questionText);

const parser = new HiraganaParser({hiraganas: questionText});
$questionRoma.html( makeOutput(parser) );

$body.on('keydown',function(e) {
    typed(e.key);
});


//user-defined functions
function typed(key) {
    //タイプ音再生
    seKeydown.currentTime = 0;
    seKeydown.play();

    parser.input(key);

    if (!parser.isComplete()) {
        //設問を打ち終わっていない場合 
        $questionRoma.html( makeOutput(parser) );
    } else {
        //設問を打ち終わっている場合
        $questionField.html('<h2>FIN</h2>');
    }
}

function makeOutput(parser) {
    let output = '';

    output += '<div class="inputed">' + parser.inputedRoma + '</div>';
    output += '<div class="not-inputed"><div class="nowmiss">' + parser.notInputedRoma[0] + '</div>' + parser.notInputedRoma.slice(1,parser.notInputedRoma.length); + '</div>';
    
    //今までに打ったroma字が前回のmakeOutputから1文字も進んでいない場合を、ミスとして判定する
    if (checkMiss == parser.inputedRoma) {
        //間違った入力
        //ミス音再生
        seMiss.currentTime = 0;
        seMiss.play();

        //間違えた1文字を赤色に変更してフォーカスする
        output = output.replace('nowmiss','nowmiss-after');

        missCount++;
    } else {
        //正しい入力
    }

    checkMiss = parser.inputedRoma;
    return output;
}


});

