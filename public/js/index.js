var socket=io();
socket.on('connect',function() {
	console.log("Connected to Server");

	
});
socket.on('disconnect',function(){
	console.log('Disconnected from Server');
});

socket.on('newMessage',function(message){
	console.log("New Message Received",message);
	var li=jQuery('<li></li>');
	li.text(message.from+" : "+message.text);
	jQuery('#message').append(li);
});

// socket.emit('createMessage',{

// 		'from' : "abc",
// 		'text' : "Hello"

// 	},function(data){
// 		console.log('Got it',data);
// 	});

jQuery('#message-form').on('submit',function(e){

e.preventDefault();

socket.emit('createMessage',{
	from : 'User',
	text : jQuery("[name='message']").val()
},function(data){
	console.log(data);
});
});