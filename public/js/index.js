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
//let playerImage = new Image();
//playerImage.src = '/error.jpg';
let movement = {};

const colors = [
    '#ff8e8e','#ff82c6','#c68eff','#9393ff','#93c9ff','#8effff','#8effc6','#c6ff8e','#ffff8e'
];

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
    context.clearRect(0,0,canvas.width,canvas.height);

    let stage = new createjs.Stage('canvas-2d');

    let i=0;
    Object.values(players).forEach(function(player) {
        if (i > colors.length) i = 0;
        i++;

        let shape = new createjs.Shape();
        shape.graphics.beginFill(colors[i]);
        shape.graphics.drawCircle(0,0,60);
        shape.x = player.x;
        shape.y = player.y;
        stage.addChild(shape);
        stage.update();

        context.lineWidth = 2;
        context.fillStyle = "0ff";
        context.font = '30px sans-serif';
        context.fillText(player.comment, player.x + 80, player.y - 20);
        
    });
});

socket.on('connect',gameStart);

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

