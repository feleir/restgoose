var assert = require("assert"),
	mongoose = require('mongoose'),
	request = require('supertest'),
	should = require('should');

describe('API: Insert', function() {
	var TestModel = mongoose.model('Test'),
		url = 'http://localhost:8888';

	it('insert should throw error when a required field is not provided', function(done) {
		request(url)
			.post('/api/test')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.be.ok;
				res.body.error.name.should.equal('ValidationError');
				res.body.error.message.should.equal('Validation failed');
				done();
		    });
	});
	
	it('insert item should return item details', function(done) {
		request(url)
			.post('/api/test')
			.send({ name: 'Test Name' })
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.not.be.ok;
				res.body.result.name.should.equal('Test Name');
				res.body.result._id.should.exists;
				done();
		    });
	});
});


