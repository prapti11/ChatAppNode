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
	jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){

	console.log(message);
	var li=jQuery('<li></li>');
	var a=jQuery('<a target="_blank">My current location</a>');
	li.text(message.from+":");
	a.attr('href',message.url);
	li.append(a);
	jQuery('#messages').append(li);
});



// socket.emit('createMessage',{

// 		'from' : "abc",
// 		'text' : "Hello"

// 	},function(data){
// 		console.log('Got it',data);
// 	});

$('#message-form').on('submit',function(e){

e.preventDefault();

socket.emit('createMessage',{
	from : 'User',
	text : jQuery("[name='message']").val()
},function(data){
	console.log(data);
});

});



var locationButton=$('#send-location');
locationButton.click(function(){
	console.log("clicked");
if(!navigator.geolocation){
	return alert('Geolocation not supported');
}
navigator.geolocation.getCurrentPosition(function(position){

	console.log(position);

	socket.emit('createLocationMessage',{
		latitude: position.coords.latitude,
		longitude: position.coords.longitude
	},function(data){
		console.log(data)
	});

},function(){
	alert('Unable to fetch location');
});
});