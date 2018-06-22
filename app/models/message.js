const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	from : {
		type : String,
		required : true,
		minlength : 1,
		trim : true
	},
	text : {
		type : String,
		required : true,
		minlength : 1,
		trim : true
	},
	room : {
		type : String,
		required : true,
		minlength : 1,
		trim : true	
	},
	messageType : {
		type : String,
		trim : true	
	},
	createdAt : {
		type : Number
	}
});


module.exports=mongoose.model('Message',MessageSchema);