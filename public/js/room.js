import { HiraganaParser } from './user_modules/hiragana-parser/lib/esm/index.mjs';
import { Say } from './user_modules/sample-module/index.js';

/*
-------------------------------------

速度改善
- jqueryのcss操作は禁止。元と後の状態のclassを作っておいて対応する。
- 同じDOMを2回以上参照する場合は変数にいれる
- booleanは厳密な比較を用いる(===)

hiragana-parserクラス
1つの設問に対応するように1つのparserインスタンスを事前に生成しておく
押されたキーをparser.inputで送ると、そのキーが正しいか自動で判定され、
今までに入力した文字列(1)と、まだ打ち残っている文字列(2)を返す。
そして次の文字をinputで再び受け付ける。
正しい入力のキーをinputに渡した場合、(1)(2)が更新される。
そして(2)がだんだん減っていき、空になったらisComplete()がtrueとなる。

-------------------------------------
*/

//全てのDOMの読み込みが終わってから処理を開始
$(document).ready(function() {

const socket = io();

const canvas = $('#canvas-2d')[0];
const context = canvas.getContext('2d');

const canvas2 = $('#canvas-2d-layer2')[0];
const context2 = canvas.getContext('2d');

//let playerImage = new Image();
//playerImage.src = '/error.jpg';
let movement = {};

function gameStart() {
    socket.emit('game-start');
}

$(document).on('keydown keyup',function(e) {
    const KeyToCommand = {
        'ArrowUp':'up',
        'ArrowDown':'down',
        'ArrowLeft':'left',
        'ArrowRight':'right'
    };

    const command = KeyToCommand[e.key];

    if (command) {
        if (e.type === 'keydown') {
            movement[command] = true;
        } else { /* keyup */
            movement[command] = false;
        }
        socket.emit('movement',movement);
    }
});

socket.on('state',function(players) {
    let stage = new createjs.Stage('canvas-2d');

    let i=0;
    Object.values(players).forEach(function(player) {
        let shape = new createjs.Shape();
        shape.graphics.beginFill(player.color);
        shape.graphics.drawCircle(0,0,60);
        shape.x = player.x;
        shape.y = player.y;
        shape.alpha = 0.6;
        stage.addChild(shape);

        let text = new createjs.Text(player.comment,'30px sans-serif','#000');
        text.x = player.x + 80;
        text.y = player.y - 60;
        stage.addChild(text);

        stage.update();
    });
});

//M
socket.on('connect',gameStart);


//canvas layer2 ---------------

// in /js/processingjs/processing.pde

//-------------- canvas layer2

$('#submit-input').on('keypress',function(e) {
    if (e.which == 13) {
        submitProcess();
    }
});

$('#submit-btn').on('click',function() {
    submitProcess();
});

function submitProcess() {
    let comment1 = $('#submit-input').val();
    if (comment1) {
        $('#submit-input').val('');
        socket.emit('comment',comment1);
    }
}


});

