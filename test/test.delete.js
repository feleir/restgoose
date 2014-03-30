var assert = require("assert"),
	mongoose = require('mongoose'),
	request = require('supertest'),
	should = require('should');

describe('API: Delete', function() {
	var TestModel = mongoose.model('Test'),
		url = 'http://localhost:8888';

	
	it('delete request should throw error for invalid ids', function(done) {
		request(url)
			.del('/api/test/112323')
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

	it('delete request for an item that does not exist', function(done) {
		request(url)
			.del('/api/test/5335f942309c21050740c434')
		    // end handles the response
			.end(function(err, res) {
				if (err)
					throw err;
				res.body.iserror.should.not.be.ok;
				res.body.result.should.equal('Test 5335f942309c21050740c434 successfully deleted');
				done();
		    });
	});

	it('delete should delete an item that does exist', function(done) {
		var newText = new TestModel({ name: 'TestValue' });
	    newText.save(function (err) {
		    if (err) {
		      throw err;
		    } else {
				request(url)
				.del('/api/test/' + newText.id)
			    // end handles the response
				.end(function(err, res) {
					if (err)
						throw err;
					res.body.iserror.should.not.be.ok;
					res.body.result.should.equal('Test ' + newText.id + ' successfully deleted');
					done();
			    });		    
			}
		});
		
	});
});


