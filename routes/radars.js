var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var middlewareAutenticar = require("../middleware/autenticar");
const { user: userDB, password: passwordDB, url: urlDB, database} = require('../dataBase/mysql.json')
const consMysql = `mysql://${userDB}:${passwordDB}@${urlDB}/${database}`

var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/:idView', async function (req, res) {
	let sql = "SELECT * FROM (Radars INNER JOIN ModelsData as Data ON Radars.data = Data.id) INNER JOIN ModelsData as Divider ON Radars.divider = Divider.id WHERE idView = " + req.params.idView;

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
	const radar = []
	view.push(req.body.view.name)
	view.push(req.body.view.idDashboard)
	view.push(req.body.view.type)
	view.push(req.body.view.idDevice)
	radar.push(req.body.radar.data)
	radar.push(req.body.radar.divider)
	radar.push(req.body.radar.dataStyle)
	radar.push(req.body.radar.dateStyle || null)
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO views(name, idDashboards, type, idDevice) VALUES (?,?,?,?)", view, async function (error, results) {
		if (error) {
			return res.status(404).end();
		}
		radar.push(results.insertId)
		await connection.query("INSERT INTO Radars(data, divider, dataStyle, dateStyle, idView) VALUES (?,?,?,?,?)", radar, async function (error, results) {
			if (error) {
				return res.status(404).end();
			}
			let response = results[0];
			return res.status(200).send(response);
		})
	})
})


module.exports = router;
