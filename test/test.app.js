var assert = require("assert"),
	mongoose = require('mongoose'),
	Model = mongoose.Model,
	express = require('express'),
	app = express(),
	request = require('supertest'),
	should = require('should'),
	mockgoose = require('Mockgoose'); 

mockgoose(mongoose);
mongoose.connect('mongodb://mongoose/test');

describe('API: Create app', function() {
	var TestModel = mongoose.model('Test', { name: {type: String, required: true } }),
		url = 'http://localhost:8888';

	before(function(done) {
		require('../index.js')(app);
		app.configure(function () {
			app.use(express.json());
			app.use(express.urlencoded());
		  	app.use(express.methodOverride());
		  	app.use(app.router);
			app.apiFromModel(TestModel)
				.getAll()
				.getItem()
				.insert()
				.update()
				.remove();
		  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		});

		app.listen(8888, function() {
		    done();
		});
	});
	it('API: express app should be extended with apiFromModel', function(done) {
		app.apiFromModel.should.be.an.Function;
		done();
	});
	it('API: should create routes', function(done) {
		app.routes.get.length.should.equal(2);
		app.routes.get[0].path.should.equal('/api/Test');
		app.routes.get[1].path.should.equal('/api/Test/:id');
		app.routes.post[0].path.should.equal('/api/Test');
		app.routes.post[1].path.should.equal('/api/Test/:id');
		app.routes.delete[0].path.should.equal('/api/Test/:id');
		done();
	});
	it('API: should throw error for null model', function(done) {
		(function(){
  			app.apiFromModel();
		}).should.throw('Model cannot be null');
		done();
	});
	if('API: should throw an error for invalid model' , function(done) {
		(function(){
  			app.apiFromModel('test');
		}).should.throw('Model needs to be a Mongoose model');
		done();
	});
});