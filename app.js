const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql2/promise');

const port = 3000;

//template engine
app.set('view engine', 'ejs');

//静的ファイルを宣言
app.use(express.static('public'));

//user -------------------------------

const FIELD_WIDTH = 864, FIELD_HEIGHT = 486;

const colors = [
    '#ff8e8e','#ff82c6','#c68eff','#9393ff','#93c9ff','#8effff','#8effc6','#c6ff8e','#ffff8e'
];

class Player {
    constructor(obj={}) {
        this.id=Math.floor(Math.random()*1000000000);
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (FIELD_WIDTH - this.width);
        this.y = Math.random() * (FIELD_HEIGHT - this.height);
        this.angle = 0;
        this.movement = {};
        this.comment = "Hello";
        this.color = colors[ Math.floor(Math.random() * colors.length) ];
    }

    move(key) {
        const distance = 28;

        if (key === 'w') {
            this.y -= distance;
        }
        if (key === 's') {
            this.y += distance;
        }
        if (key === 'a') {
            this.x -= distance;
        }
        if (key === 'd') {
            this.x += distance;
        }
    }

}

let players = {};

io.on('connection',function(socket) {
    let player = null;
    
    socket.on('game-start',function(config) {
        player = new Player({
            socketId: socket.id
        });
        players[player.id] = player;
    });

    socket.on('movement',function(movement) {
        if(!player) {
            return;
        }
        player.movement = movement;
    });

    socket.on('disconnect',function() {
        if (!player) {
            return;
        }
        delete players[player.id];
        player = null;
    });

    socket.on('comment',function(comment1) {
        if (!player) {
            return;
        }
        player.comment = comment1;
    });

});  //io.on

setInterval(function() {
    Object.values(players).forEach((player) => {
        const movement = player.movement;

        if (movement.up) {
            player.move('w');
        }
        if (movement.down) {
            player.move('s');
        }
        if (movement.left) {
            player.move('a');
        }
        if (movement.right) {
            player.move('d');
        }

    });
    
    //M
    io.sockets.emit('state',players);

    //1000[ms] = 1[s]
    //1[s]に33回通信(30FPS)
},1000/30);



//ルーティング-------------------------

//index
app.get('/',(req,res)=>{
    //全部127.0.0.1になる、想定外
    const ipaddr = req.connection.remoteAddress;

    const txt = 'test';
    res.render('index',{sdata1:txt});
});

app.get('/room',(req,res)=>{
    res.render('room');
});

//クライアントでio()の実行、すなわちsocket.ioサーバーに接続された場合に発火
io.on('connection',(socket)=>{
    console.log('user connected');


    //接続が終了されたら
    socket.on('disconnect', function(data) {
        console.log('user disconnected');
    });
});

http.listen(port,function() {
    console.log('listening on 3000');
});
