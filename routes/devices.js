var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
var middlewareAutenticar = require("../middleware/autenticar");
const autenticar = require("./../config/deviceAuth.json");
const { user: userDB, password		: passwordDB, url: urlDB}  = require('../dataBase/mysql.json')
const consMysql = `mysql://${userDB}:${passwordDB}@${urlDB}/XimuDB`
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/', async function (req, res) {
	let sql
	if (req.query.id) {
		sql = "SELECT * FROM Devices WHERE id = " + req.query.id;
	}
	else if (req.query.model) {
		sql = "SELECT * FROM Devices WHERE idModel = " + req.query.model;
	} else {
		sql = "SELECT Devices.id AS id,Devices.name AS name, Models.name AS model, Devices.token as token FROM Devices INNER JOIN Models on Devices.idModels = Models.id WHERE Models.idUser = " + req.userId;
	}

	const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function (error, results) {
		if (error) {
			console.log(error)
			return res.status(404).end();
		}
		let resposta = results;
		if (req.query.id) {
			resposta = results[0]
		}
		return res.status(200).send(resposta);
	});
});

router.post('/', async function (req, res) {
	let device = [];
	device.push(req.body.device.name);
	device.push(parseInt(req.body.device.IdModels));
	device.push(req.userId);
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO Devices(name, IdModels,idUser) VALUES (?,?,?)", device, async function (error, results) {
		if (error) {
			console.log(error)
			return res.status(304).end();
		}
		let resposta = results[0];
		const id = results.insertId
		const token = `Bearer ${await jwt.sign({id},autenticar.segredo)}`
		const update = [token, id]

		await connection.query("UPDATE Devices SET token=? WHERE id = ?", update, async function (error, results) {
			if (error) {
				console.log(error);
				return res.status(304).end();
			}
			console.log(results);
			
			return res.status(200).send(results);
		});
	});
})

router.put('/', async function (req, res) {
	let device = [];
	device.push(req.body.device.name);
	device.push(parseInt(req.body.device.IdModelos));
	device.push(req.body.device.id)
	const connection = mysql.createConnection(consMysql);
	await connection.query("UPDATE Devices SET name=?, idModel=? WHERE id = ?", device, async function (error, results) {
		if (error) {
			return res.status(304).end();
		}
		return res.status(200).end();
	});
})

router.delete('/:id', async function (req, res) {
	let id = [req.params.id];
	console.log(id);
	const connection = mysql.createConnection(consMysql);
	await connection.query("DELETE FROM Devices WHERE id = ?", id, async function (error, results) {
		if (error) {
			console.log(error)
			return res.status(404).end();
		}
		return res.status(200).end();
	});
})

module.exports = router;
