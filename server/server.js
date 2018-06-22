const path= require('path');
const express=require('express');
const publicPath = path.join(__dirname,'../public');
const app=express();
const socketIO=require('socket.io');
const http=require('http');
const port=process.env.PORT||3000;
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser');
const User= require('../app/models/user');

mongoose.connect('mongodb://shobhit1997:shobhit1997@ds117111.mlab.com:17111/chat_app');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Expose-Header','x-auth');
	res.setHeader('Access-Control-Allow-Header','Origin, X-Requested-With,content-type,Accept');
	next();
});

var server=http.createServer(app);
app.use(express.static(publicPath));
var io=socketIO(server);
var users=new Users();

io.on('connection',function(socket){
console.log("new user connected");

socket.on('join',function(params,callback){
	if(!isRealString(params.name)|| !isRealString(params.room))
	{
		return callback('Name and Room name is required');
	}
	socket.join(params.room);
	users.removeUser(socket.id);
	users.addUser(socket.id,params.name,params.room);

	io.to(params.room).emit('updateUserList',users.getUserList(params.room));
	socket.emit('newMessage',generateMessage('Admin','Welcome '+ params.name));
	socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',params.name+' Joined'));

	callback();
});
socket.on('createMessage',function(message,callback){
console.log("New Messgae Created",message);
var user=users.getUser(socket.id);
if(user){
	io.to(user.room).emit('newMessage',generateMessage(message.from,message.text));
}

callback("this is from server");

});


socket.on('createLocationMessage',function(message,callback){
console.log("New Location Message Created",message);
var user=users.getUser(socket.id);
if(user){
	io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,message.latitude,message.longitude));
}
callback('this is from server');
});

socket.on('disconnect',function(){
	console.log("disconnect "+socket.id);
	var user=users.removeUser(socket.id);
	// console.log(user);
	if(user){
		io.to(user.room).emit('updateUserList',users.getUserList(user.room));
		io.to(user.room).emit('newMessage',generateMessage('Admin',user.name+" has left"));
	}
});

});


var router = express.Router();

router.route('/signup')
	.post(function(req,res){

		var body=_.pick(req.body,['name','phone','password']);
		var user=new User(body);
		console.log(body);
		user.save().then(function(){
			return user.generateAuthToken();
		}).then(function(token){
			res.header('x-auth',token).send(user);

		}).catch(function(e){
			res.status(400).send(e);
		});
	});

router.route('/login')
	.post(function(req,res){
		var body=_.pick(req.body,['phone','password']);
		User.findByCredentials(body.phone,body.password).then(function(user){
			return user.generateAuthToken().then(function(token){
				res.header('x-auth',token).send(user);
			});
		}).catch(function(e){
			res.status(400).send(e);
		});

	});

app.use('/api',router);


server.listen(port,function(){
	console.log("Server running at port "+port);
});

