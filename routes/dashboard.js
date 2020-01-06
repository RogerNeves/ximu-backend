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

router.get('/', async function (req, res) {
	let sql = 'SELECT * FROM Dashboards WHERE 1=1'
	if(req.query.id)
		sql = sql + " AND id = "+req.query.id
	sql = sql + " AND idUser = " + req.userId;

	const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function (error, results) {
		if (error) {
			return res.status(304).end();
		}
		let resposta = results;
		return res.status(200).send(resposta);
	});
});

router.post('/', async function (req, res) {
	let dashboard = [];
	dashboard.push(req.body.dashboard.name);
	console.log(req)
	dashboard.push(req.userId);
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO Dashboards(name, idUser) VALUES (?,?)", dashboard, async function (error, results) {
		if (error) {
			return res.status(304).end();
		}
		let resposta = results[0];
		return res.status(200).send(resposta);
	});
})

router.put('/:id', async function (req, res) {
	let dashboard = [];
	dashboard.push(req.body.dashboard.name);
	dashboard.push(req.body.dashboard.id)
	const connection = mysql.createConnection(consMysql);
	await connection.query("UPDATE dashboards SET name=?, WHERE id = ?", dashboard, async function (error, results) {
		if (error) {
			return res.status(404).end();
		}
		return res.status(200).end();
	});
})

router.delete('/:id', async function (req, res) {
	let id = [req.params.id];
	console.log(id);
	const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM dashboard WHERE id = ?", id, async function (error, results) {
		if (error) {
			console.log(error)
			return res.status(404).end();
		}
		return res.status(200).end();
	});
})

module.exports = router;
