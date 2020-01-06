var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var middlewareAutenticar = require("../middleware/deviceAuth");
var meansurament = require("../models/measurementsDAO");
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
//router.use(middlewareAutenticar);

router.post("/", function (req, res) {
	var item ={};
	for (var [key, value] of Object.entries(req.body)) {
		item[key]= value;		
	}
	var db = new meansurament(item);
	var response = {};

	db.save(function (err) { 
		if (err) {
			console.log(err)
			response = { "error": true, "message": "Error adding data" };
		} else {
			response = { "error": false, "message": "Data added" };
		}
		res.status(200).json(response);
	});
});

module.exports = router;