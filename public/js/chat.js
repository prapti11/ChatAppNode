var socket=io();

function scrollToBottom(){
	var messages=jQuery('#messages');
	var newMessage=messages.children('li:last-child');

	var clientHeight=messages.prop('clientHeight');
	var scrollTop=messages.prop('scrollTop');
	var scrollHeight=messages.prop('scrollHeight');
	var newMessageHeight=newMessage.innerHeight();
	var lastMessageHeight=newMessage.prev().innerHeight();

	if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight)
	{
		// console.log('Should Scroll');
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect',function() {
	// console.log("Connected to Server");

	var params=jQuery.deparam(window.location.search);
	socket.emit('join',params,function(err){
		if(err){
			alert(err);
			window.location.href="/";
		}
		else{
			console.log("No error");
		}
	});

	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	      console.log(this.responseText);
	      var messages=JSON.parse(this.responseText);
	      console.log(messages);
	      messages.forEach(function(message){
				if(message.messageType==="text"){
					var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');
					var template = jQuery('#message-template').html();
					var html = Mustache.render(template,{
					 	text : message.text,
					 	from : message.from,
					 	createdAt : formattedTime
					 });
					jQuery('#messages').append(html);
				}
				else{
					var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');
					var template = jQuery('#location-message-template').html();
					var html = Mustache.render(template,{
					 	url : message.url,
					 	from : message.from,
					 	createdAt : formattedTime
					});
					jQuery('#messages').append(html);
					
				}
				scrollToBottom();
			});

	    }
  	};
  	xhttp.open("GET", "https://thawing-mesa-63770.herokuapp.com/api/messages/"+params.room, true);
  	xhttp.setRequestHeader("Content-type", "application/json");
  	xhttp.send();


	
});
socket.on('disconnect',function(users){

});

socket.on('updateUserList',function(users){
	// console.log('User List',users);
	var ol= jQuery('<ol></ol>');
	users.forEach(function(user){
		ol.append(jQuery('<li></li>').text(user));
	});
	jQuery('#users').html(ol);
});

socket.on('newMessage',function(message){
	console.log("New Message Received",message);
	var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template,{
	 	text : message.text,
	 	from : message.from,
	 	createdAt : formattedTime
	 });
	 jQuery('#messages').append(html);
	 scrollToBottom();
	// var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');	
	// var li=jQuery('<li></li>');
	// li.text(message.from +" "+formattedTime+" : "+message.text);
	// jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){

	console.log(message);
	var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template,{
	 	url : message.url,
	 	from : message.from,
	 	createdAt : formattedTime
	 });
	 jQuery('#messages').append(html);
	 scrollToBottom();
	// var li=jQuery('<li></li>');
	// var a=jQuery('<a target="_blank">My current location</a>');
	// li.text(message.from+" "+formattedTime+":");
	// a.attr('href',message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
});



// socket.emit('createMessage',{

// 		'from' : "abc",
// 		'text' : "Hello"

// 	},function(data){
// 		console.log('Got it',data);
// 	});

$('#message-form').on('submit',function(e){

e.preventDefault();
var params=jQuery.deparam(window.location.search);
var messageTextbox=jQuery("[name='message']");
socket.emit('createMessage',{
	from : params.name,
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