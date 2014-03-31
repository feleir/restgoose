restgoose
=========

An easy to use module to create a rest api for a mongoose model.

* [How its works](#how-its-works)
* [Methods](#methods)
* [Unit tests](#uni tests)

### How Its works

Extends the express app object with a new method **apiFromModel** that takes a mongoose model as parameter.

```javascript
var mongoose = require('mongoose'),
	  Model = mongoose.Model,
	  express = require('express'),
	  app = express();

	var TestModel = mongoose.model('Test', { name: {type: String, required: true } });
	require('../index.js')(app);
	app.use(express.json());
	app.use(express.urlencoded());
	app.apiFromModel(TestModel)
		.getAll()
		.getItem()
		.insert()
		.update()
		.remove();
```

### Methods

Every method accept as arguments middleware functions.

```javascript
	var MiddleWareModel = mongoose.model('Middleware', { name: {type: String, required: true } });
	app.apiFromModel(MiddleWareModel)
	  	.insert(function(req, res, next) {
	  		req.body.name = 'Middleware 1';
	  		next();
	  	}, function(req, res, next) {
	  		req.body.name = 'Middleware 2';
	  		next();
	  	});
```

1) getAll(middleware....)
Adds a new get route to the express app **/api/ModelName** which returns all the objects in for the model

2) getItem(middleware....)
Adds a new get route to the express app **/api/ModelName/:id** which returns the object with the requested id

3) insert(middleware....)
Adds a new post route to the express app **/api/ModelName** which will try to insert a new object with the information send in the request, mongoose takes care of the validation

4) update(middleware....)
Adds a new post route to the express app **/api/ModelName/:id** which will try to update the object with the requested id with the information send in the request, mongoose takes care of the validation

5) delete(middleware....)
Adds a new delete route to the express app **/api/ModelName/:id** which will try to delete the object with the requested id

### Unit tests

Full unit tests coverage and examples can be found in the **test** folder.

