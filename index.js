var mongoose = require('mongoose'),
	Model = mongoose.Model;

Model.api = function(expressApp) {
	var self = this,
		sendError = function(err) {
			return {
				iserror: true,
				error: err
			}
		},
		sendValue = function(value) {
			return {
				iserror: false,
				result: value,
			}
		}

	return {
		getAll: function() {
			expressApp.get('/api/' + self.modelName, function(req, res) {
				self.find({}, function (err, values) {
				    if (!err) {
				      return res.send(sendValue(values));
				    } else {
				      return res.send(sendError(err));
				    }
				});
			});
			return this;
		},
		getItem: function() {
			expressApp.get('/api/' + self.modelName + '/:id', function(req, res) {
				self.findById(req.params.id, function (err, value) {
				    if (!err) {
				      return res.send(sendValue(value));
				    } else {
				      return res.send(sendError(err));
				    }
				});
			});
			return this;
		},
		insert: function() {
			expressApp.post('/api/' + self.modelName, function (req, res){
				var newModel = new self(req.body);
			    newModel.save(function (err) {
				    if (!err) {
				      res.send(sendValue(newModel));
				    } else {
				      res.send(sendError(err));
				    }
				});
			});	
			return this;		
		},
		update: function () {
			expressApp.post('/api/' + self.modelName + '/:id', function(req, res) {
				self.findById(req.params.id, function (err, item) {
					if (!err) {
						if (item === null) {
							res.send(sendValue(null));
						} else {
			  				for(var key in req.body)
		  						item[key] = req.body[key];
							item.save(function(err, updateditem) {
								if (!err) {
									res.send(sendValue(updateditem));
								} else {
									res.send(sendError(err));
								}
							});
						}
				    } else {
				  		res.send(sendError(err));
				 	}
				});
			});
			return this;
		},
		remove: function() {
			expressApp.delete('/api/' + self.modelName + '/:id', function (req, res){
				self.findByIdAndRemove(req.params.id, function(err) {
					if (err) {
						res.send(sendError(err))
					} else {
						res.send(sendValue(self.modelName + ' ' + req.params.id +  ' successfully deleted'));
					}
				});
			});	
			return this;	
		}
	};
}