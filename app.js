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

class Player {
    constructor(obj={}) {
        this.id=Math.floor(Math.random()*1000000000);
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (FIELD_WIDTH - this.width);
        this.y = Math.random() * (FIELD_HEIGHT - this.height);
        this.angle = 0;
        this.movement = {};
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
    console.log('user connected');

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
        console.log('user disconnected');

        if (!player) {
            return;
        }
        delete players[player.id];
        player = null;
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
    io.sockets.emit('state',players);
},1000/30);


//ルーティング-------------------------

//index
app.get('/',(req,res)=>{
    //全部127.0.0.1になる、想定外
    const ipaddr = req.connection.remoteAddress;

    const txt = 'test';
    res.render('index',{sdata1:txt});
});

http.listen(port,function() {
    console.log('listening on 3000');
});
