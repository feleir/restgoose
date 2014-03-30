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
require('../index.js');

describe('API: Create app', function() {
	var TestModel = mongoose.model('Test', { name: {type: String, required: true } }),
		url = 'http://localhost:8888';

	before(function(done) {
		app.configure(function () {
			app.use(express.json());
			app.use(express.urlencoded());
		  	app.use(express.methodOverride());
		  	app.use(app.router);
		  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		});
		TestModel.api(app)
			.getAll()
			.getItem()
			.insert()
			.update()
			.remove();

		app.listen(8888, function() {
		    done();
		});
	});
	it('API: should create app', function(done) {
		done();
	});
});