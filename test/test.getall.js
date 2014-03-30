var assert = require("assert"),
	mongoose = require('mongoose'),
	request = require('supertest'),
	should = require('should');

describe('API: GetAll', function() {
	var TestModel = mongoose.model('Test'),
		url = 'http://localhost:8888';

	it('getall request should exist', function(done) {
		request(url)
			.get('/api/test')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.not.be.ok;
				res.body.result.should.exists;
				res.body.result.should.be.an.Array;
				res.body.result.length.should.be.exactly(0);
				done();
		    });
	});

	it('getall with values in the db', function(done) {
		var newText = new TestModel({ name: 'TestValue' });
	    newText.save(function (err) {
		    if (err) {
		      throw err;
		    } else {
		      request(url)
				.get('/api/test')
			    // end handles the response
				.end(function(err, res) {
					if (err)
						throw err;
					res.body.iserror.should.not.be.ok;
					res.body.result.should.exists;
					res.body.result.should.be.an.Array;
					res.body.result.length.should.be.exactly(1);
					res.body.result[0].name.should.equal('TestValue');
					res.body.result[0]._id.should.equal(newText.id);
					done();
			    });
		    }
		});
	});
});


