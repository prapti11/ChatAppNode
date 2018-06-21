var socket=io();
socket.on('connect',function() {
	console.log("Connected to Server");

	
});
socket.on('disconnect',function(){
	console.log('Disconnected from Server');
});

socket.on('newMessage',function(message){
	console.log("New Message Received",message);

	var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');	
	var li=jQuery('<li></li>');
	li.text(message.from +" "+formattedTime+" : "+message.text);
	jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){

	console.log(message);
		var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');	

	var li=jQuery('<li></li>');
	var a=jQuery('<a target="_blank">My current location</a>');
	li.text(message.from+" "+formattedTime+":");
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
var messageTextbox=jQuery("[name='message']");
socket.emit('createMessage',{
	from : 'User',
	text : messageTextbox.val()
},function(data){
	console.log(data);
	messageTextbox.val('');
});

});



var locationButton=$('#send-location');
locationButton.click(function(){
	console.log("clicked");
if(!navigator.geolocation){
	return alert('Geolocation not supported');
}

locationButton.attr('disabled','disabled').text('Sending.....');
navigator.geolocation.getCurrentPosition(function(position){
	console.log(position);

	socket.emit('createLocationMessage',{
		latitude: position.coords.latitude,
		longitude: position.coords.longitude
	},function(data){
		console.log(data)
		locationButton.removeAttr('disabled').text('Send Location');
	});

},function(){
	locationButton.removeAttr('disabled').text('Send Location');
	alert('Unable to fetch location');
});
});