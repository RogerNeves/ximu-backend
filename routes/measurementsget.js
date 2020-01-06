var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var middlewareAutenticar = require("../middleware/autenticar");
var mongoOp = require("../models/measurementsDAO");
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);


router.get("/:idParam", function (req, res) {
	idParam = req.params.idParam;
	var response = {};
	mongoOp.find({idDevice:idParam}, function (err, data) {
		if (err) {
			response = { "error": true, "message": "Error fetching data" };
		} else {
			response = { "error": false, "message": data };
		}
		res.status(200).json(response);
	});
});
module.exports = router;