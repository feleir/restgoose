var mongoose = require('mongoose'),
	Model = mongoose.Model;

module.exports = function(app) {
	app.apiFromModel = function(model) {
		if (!!!model)
			throw new Error('Model cannot be null');
		if (!!!model.name || model.model.name !== 'model')
			throw new Error('Model needs to be a Mongoose model');

		var app = this,
			mongooseModel = model,
			apiName = mongooseModel.modelName,
			apiCallback = function(err, result) {
				if (err)
					return { iserror: true, error: err }
				else
					return { iserror: false, result: result }
			};

		return {
			getAll: function() {
				app.get('/api/' + apiName, Array.prototype.slice.call(arguments), function(req, res) {
					mongooseModel.find({}, function(err, items) {
						res.send(apiCallback(err,items));
					});
				});
				return this;
			},
			getItem: function() {
				app.get('/api/' + apiName + '/:id', Array.prototype.slice.call(arguments), function(req, res) {
					mongooseModel.findById(req.params.id, function(err, item) {
						res.send(apiCallback(err,item));
					});
				});
				return this;
			},
			insert: function() {
				app.post('/api/' + apiName, Array.prototype.slice.call(arguments), function (req, res){
					var newModel = new mongooseModel(req.body);
				    newModel.save(function (err) {
						res.send(apiCallback(err,newModel));
					});
				});	
				return this;		
			},
			update: function () {
				app.post('/api/' + apiName + '/:id', Array.prototype.slice.call(arguments), function(req, res) {
					mongooseModel.findById(req.params.id, function (err, item) {
						if (!err) {
							if (item === null) {
								res.send(apiCallback('Invalid item identifier ' + req.params.id));
							} else {
				  				for(var key in req.body)
			  						item[key] = req.body[key];
								item.save(function(err, updateditem) {
									res.send(apiCallback(err,updateditem));
								});
							}
					    } else {
					  		res.send(apiCallback(err));
					 	}
					});
				});
				return this;
			},
			remove: function() {
				app.delete('/api/' + apiName + '/:id', Array.prototype.slice.call(arguments), function (req, res){
					mongooseModel.findByIdAndRemove(req.params.id, function(err) {
						return res.send(apiCallback(err,apiName + ' ' + req.params.id +  ' deleted'));
					});
				});	
				return this;	
			}
		}
	}
};