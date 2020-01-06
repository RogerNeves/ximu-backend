var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var middlewareAutenticar = require("../middleware/autenticar");
const { user: userDB, password: passwordDB, url: urlDB}  = require('../dataBase/mysql.json')
const consMysql = `mysql://${userDB}:${passwordDB}@${urlDB}/XimuDB`

var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);
 
router.get('/:idView', async function (req, res) {
	let sql = "SELECT * FROM Gauges INNER JOIN ModelsData ON Gauges.idModelsData = ModelsData.id WHERE idView = " + req.params.idView;

	const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function (error, results) {
		if (error) {
			return res.status(304).end();
		}
		let response = results[0];
		return res.status(200).send(response);
	})
})

router.post('/', async function (req, res) {
	const view = []
	const gauge = []
	view.push(req.body.gauge.name)
	view.push(req.body.gauge.idDashboard)
	view.push(req.body.gauge.type)
	view.push(req.body.radar.idDevice)
	gauge.push(req.body.gauge.data)
	gauge.push(req.body.gauge.dataStyle)
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO views(name, idDashboard, type, idDevice) VALUES (?,?,?,?)", view, async function (error, results) {
		if (error) {
			return res.status(404).end();
		}
		gauge.push(results.insertId)
		await connection.query("INSERT INTO Gauges(data, dataStyle, idView) VALUES (?,?,?)", gauge, async function (error, results) {
			if (error) {
				return res.status(404).end();
			}
			let response = results[0];
			return res.status(200).send(response);
		})
	})
})

module.exports = router;
