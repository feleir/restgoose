restgoose
=========

An easy to use module to create a rest api for a mongoose model.

* [How its works](#how-its-works)

### How Its works

Extends the express app object with a new method **apiFromModel** that takes a mongoose model as parameter.

```javascript
var mongoose = require('mongoose'),
	  Model = mongoose.Model,
	  express = require('express'),
	  app = express();

  var TestModel = mongoose.model('Test', { name: {type: String, required: true } });
  require('../index.js')(app);
  app.apiFromModel(TestModel)
				.getAll()
				.getItem()
				.insert()
				.update()
				.remove();
```
