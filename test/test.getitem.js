var assert = require("assert"),
	mongoose = require('mongoose'),
	request = require('supertest'),
	should = require('should');

describe('API: GetItem', function() {
	var TestModel = mongoose.model('Test'),
		url = 'http://localhost:8888';

	it('getitem request should throw error for invalid ids', function(done) {
		request(url)
			.get('/api/test/112323')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.be.ok;
				res.body.error.should.equal('Invalid item identifier');
				done();
		    });
	});
	
	it('getitem request for an item that does not exist', function(done) {
		request(url)
			.get('/api/test/5335f942309c21050740c434')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.be.ok;
				res.body.error.should.equal('Test 5335f942309c21050740c434 not found');
				done();
		    });
	});

	it('getitem request for an existing item', function(done) {
		var newText = new TestModel({ name: 'TestValue' });
	    newText.save(function (err) {
		    if (err) {
		      throw err;
		    } else {
		      request(url)
				.get('/api/test/' + newText.id)
			    // end handles the response
				.end(function(err, res) {
					if (err)
						throw err;
					res.body.iserror.should.not.be.ok;
					res.body.result.should.exists;
					res.body.result.name.should.equal('TestValue');
					res.body.result._id.should.equal(newText.id);
					done();
			    });
		    }
		});
	});
});


