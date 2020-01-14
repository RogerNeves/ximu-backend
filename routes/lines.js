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
	let sql = "SELECT `Lines`.id, `Lines`.idview, `Lines`.dataStyle,`Lines`.dateStyle,Data.name as dataName, Divider.name as dividerName  FROM (`Lines` INNER JOIN ModelsData as Data ON Lines.data = Data.id) INNER JOIN ModelsData as Divider ON Lines.divider = Divider.id WHERE idView = " + req.params.idView;

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
	const line = []
	view.push(req.body.view.name)
	view.push(req.body.view.idDashboard)
	view.push(req.body.view.type)
	view.push(req.body.view.idDevice)
	line.push(req.body.line.data)
	line.push(req.body.line.divider)
	line.push(req.body.line.dataStyle)
	line.push(req.body.line.dateStyle || null)
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO Views(name, idDashboards, type, idDevice) VALUES (?,?,?,?)", view, async function (error, results) {
		if (error) {
			return res.status(404).end();
		}
		line.push(results.insertId)
		console.log(line)
		await connection.query("INSERT INTO `Lines`(data, divider, dataStyle, dateStyle, idView) VALUES (?,?,?,?,?)", line, async function (error, results) {
			if (error) {
				console.log(error)
				return res.status(404).end();
			}
			let response = results[0];
			return res.status(200).send(response);
		})
	})
})

module.exports = router;
