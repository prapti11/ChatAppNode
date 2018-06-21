const path= require('path');
const express=require('express');
const publicPath = path.join(__dirname,'../public');
const app=express();
const socketIO=require('socket.io');
const http=require('http');
const port=process.env.PORT||3000;
var server=http.createServer(app);
app.use(express.static(publicPath));
var io=socketIO(server);

io.on('connection',function(socket){
console.log("new user connected");

socket.emit('newMessage',{
	"from" : "Admin",
	"text" : "Welcome User",
	"createdAt" : new Date().getTime()
});

socket.broadcast.emit('newMessage',{
	'from' : 'Admin',
	'text' : 'New user joined',
	'createdAt' : new Date().getTime()
});

socket.on('createMessage',function(message){
console.log("New Messgae Created",message);
io.emit('newMessage',{
	from: message.from,
	text: message.text,
	createdAt: new Date().getTime()
});
// socket.broadcast.emit('newMessage',
// {
// 	from: message.from,
// 	text: message.text,
// 	createdAt: new Date().getTime()
// });

});

socket.on('disconnect',function(socket){
	console.log("user disconnected");
});



});



server.listen(port,function(){
	console.log("Server running at port "+port);
});

