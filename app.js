const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql2/promise');

const port = 3000

//template engine
app.set('view engine', 'ejs');

//静的ファイルを宣言
app.use(express.static('public'));

//ルーティング-------------------------

//index
app.get('/',(req,res)=>{
    const ipaddr = req.connection.remoteAddress;

    const txt = 'test';
    res.render('index',{sdata1:txt});
});

//クライアントでio()の実行、すなわちsocket.ioサーバーに接続された場合に発火
io.on('connection',(socket)=>{
    console.log('ユーザーが接続しました');


    //接続が終了されたら
    socket.on('disconnect', function(data) {
        console.log('ユーザーが退室したした');
    });
});

http.listen(port,function() {
    console.log('listening on 3000');
});
