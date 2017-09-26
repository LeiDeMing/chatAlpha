var express=require('express'),
    app=express(),
    server=require('http').createServer(app),
    io=require('socket.io').listen(server),
    users=[];

app.use('/',express.static(__dirname+'/www'));

io.sockets.on('connection',function(socket){
    socket.on('login',function(nickname){
        if(users.indexOf(nickname)>-1){
            socket.emit('userExisted');
        }else{
            socket.nickName=nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system',nickname,users.length,'login');
            io.sockets.emit('allUsers',users);
        }
    });
    socket.on('disconnect',function(){
        if(socket.nickName!==null){
            users.splice(users.lengtg,1);
            socket.broadcast.emit('system',socket.nickName,users.length,'logout');
            socket.broadcast.emit('allUsers',users);
        }
    });
    socket.on('postMsg',function(msg,color){
        socket.broadcast.emit('newMsg',socket.nickName,msg,color);
    });
    socket.on('postImg',function(img,color){
        socket.broadcast.emit('newImg',socket.nickName,img,color);
    });
});

server.listen(3000);