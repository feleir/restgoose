var mongoose = require('mongoose'),
	Model = mongoose.Model,
	checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

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
				if (err) {
					var error = err;
					if (err.message && err.errors) {
						error = err.message;
						var keysLength = Object.keys(err.errors).length;
						Object.keys(err.errors).forEach(function(key, index) {
							if (index === 0) 
								error += ' because ';
							else if (index < keysLength - 1)
								error += ', ';
							else
								error += ' and ';
  							error += key;							
						});
						error += (keysLength > 1 ? ' are ' : ' is ') + 'required';
					} else if (err.message && err.name && err.name === 'CastError') {
						error = 'Unable to cast ' + err.path + ' to ' + err.type;
					}
					return { iserror: true, error: error }
				} else
					return { iserror: false, result: result }
			};

		function ParseMiddleware(args, action) {
			var middleware = Array.prototype.slice.call(args),
				callback;
			if (middleware.length === 2 && Array.isArray(middleware[0]))
			{
				callback = middleware[1];
				middleware = middleware[0];
			}
			action(middleware, callback);
		}

		return {
			getAll: function() {
				ParseMiddleware(arguments, function(middleware, callback) {
					app.get('/api/' + apiName, middleware, function(req, res) {
						mongooseModel.find({}, function(err, items) {
							if (callback)
					    		callback(req, res, err, items);
					    	else
								res.send(apiCallback(err,items));						
						});
					});
				});
				return this;
			},
			getItem: function() {
				ParseMiddleware(arguments, function(middleware, callback) {
					app.get('/api/' + apiName + '/:id', middleware, function(req, res) {
						if (req.params.id.toString().match(/^[0-9a-fA-F]{24}$/)) {
							mongooseModel.findById(req.params.id, function(err, item) {
								if (!item) {
									res.send(apiCallback(apiName + ' ' + req.params.id +  ' not found'));
								} else {
									if (callback)
							    		callback(req, res, err, item);
							    	else
										res.send(apiCallback(err,item));									
								}
							});
						} else {
							res.send(apiCallback('Invalid item identifier'));
						};
					});
				});
				
				return this;
			},
			insert: function() {
				ParseMiddleware(arguments, function(middleware, callback) {
					app.post('/api/' + apiName, middleware, function (req, res){
						var newModel = new mongooseModel(req.body);
					    newModel.save(function (err) {
					    	if (callback)
					    		callback(req, res, err, newModel);
					    	else
								res.send(apiCallback(err,newModel));
						});
					});	
				});
				
				return this;		
			},
			update: function () {
				ParseMiddleware(arguments, function(middleware, callback) {
					app.post('/api/' + apiName + '/:id', middleware, function(req, res) {
						if (req.params.id.toString().match(/^[0-9a-fA-F]{24}$/)) {
							mongooseModel.findById(req.params.id, function (err, item) {
								if (!err) {
									if (item === null) {
										res.send(apiCallback(apiName + ' ' + req.params.id +  ' not found'));
									} else {
						  				for(var key in req.body)
					  						item[key] = req.body[key];
										item.save(function(err, updateditem) {
											if (callback)
									    		callback(req, res, err, updateditem);
									    	else
												res.send(apiCallback(err,updateditem));
										});
									}
							    } else {
							  		res.send(apiCallback(err));
							 	}
							});
						} else {
							res.send(apiCallback('Invalid item identifier'));
						}
					});
				});
				return this;
			},
			remove: function() {
				ParseMiddleware(arguments, function(middleware, callback) {
					app.delete('/api/' + apiName + '/:id', middleware, function (req, res){
						if (req.params.id.toString().match(/^[0-9a-fA-F]{24}$/)) {
							mongooseModel.findByIdAndRemove(req.params.id, function(err) {
								var result = apiName + ' ' + req.params.id +  ' deleted';
								if (callback)
						    		callback(req, res, err, result);
						    	else
									res.send(apiCallback(err,result));
							});
						} else {
							res.send(apiCallback('Invalid item identifier'));
						}
					});	
				});
				
				return this;	
			}
		}
	}
};