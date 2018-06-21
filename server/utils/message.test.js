var expect = require('expect');

var {generateMessage}= require('./message');


describe('generateMessage',function(){
	it('should generate correct message object',function(){
		var from= 'Shobhit';
		var text= 'message';
		var message = generateMessage(from,text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from,text});

	}) ;

});