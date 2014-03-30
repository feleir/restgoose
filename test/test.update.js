var assert = require("assert"),
	mongoose = require('mongoose'),
	request = require('supertest'),
	should = require('should');

describe('API: Update', function() {
	var TestModel = mongoose.model('Test'),
		url = 'http://localhost:8888';

	it('update request should throw error for invalid ids', function(done) {
		request(url)
			.post('/api/test/112323')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.be.ok;
				res.body.error.name.should.equal('CastError');
				res.body.error.value.should.equal('112323');
				res.body.error.message.should.equal('Cast to ObjectId failed for value "112323" at path "_id"');
				done();
		    });
	});

	it('update itemid that does not exists', function(done) {
		request(url)
			.post('/api/test/5335f942309c21050740c434')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.not.be.ok;
				should.not.exists(res.body.result);
				done();
		    });
	});
	
	it('update item should validate input', function(done) {
		var newText = new TestModel({ name: 'TestValue' });
	    newText.save(function (err) {
		    if (err) {
		      throw err;
		    } else {
		      request(url)
				.post('/api/test/' + newText.id)
				.send({ name: null})
			    // end handles the response
				.end(function(err, res) {
					if (err)
						throw err;
					res.body.iserror.should.be.ok;
					res.body.error.name.should.equal('ValidationError');
					res.body.error.message.should.equal('Validation failed');
					done();
			    });
		    }
		});
	});
	it('update item should return item details', function(done) {
		var newText = new TestModel({ name: 'TestValue' });
	    newText.save(function (err) {
		    if (err) {
		      throw err;
		    } else {
		      request(url)
				.post('/api/test/' + newText.id)
				.send({ name: 'New Name'})
			    // end handles the response
				.end(function(err, res) {
					if (err)
						throw err;
					res.body.iserror.should.not.be.ok;
					res.body.result.should.exists;
					res.body.result.name.should.equal('New Name');
					res.body.result._id.should.equal(newText.id);
					done();
			    });
		    }
		});
	});
});


