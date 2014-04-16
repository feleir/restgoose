var assert = require("assert"),
	mongoose = require('mongoose'),
	request = require('supertest'),
	should = require('should');

describe('API: Insert', function() {
	var TestModel = mongoose.model('Test'),
		MultipleModels = mongoose.model('Multiple'),
		url = 'http://localhost:8888';

	it('insert should throw error when a required field is not provided', function(done) {
		request(url)
			.post('/api/test')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.be.ok;
				res.body.error.should.equal('Validation failed because name is required');
				done();
		    });
	});

	it('insert should throw error when a multiple required field are not provided', function(done) {
		request(url)
			.post('/api/multiple')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.be.ok;
				res.body.error.should.equal('Validation failed because description is required and name is required');
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

	it('insert item middleware should be call', function(done) {
		request(url)
			.post('/api/middleware')
			.send({ name: 'Test Name' })
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.name.should.equal('Post middleware');
				done();
		    });
	});
});


