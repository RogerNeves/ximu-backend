const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require("body-parser")
const middlewareAutenticar = require("../middleware/autenticar")
const { user: userDB, password: passwordDB, url: urlDB}  = require('../dataBase/mysql.json')
const consMysql = `mysql://${userDB}:${passwordDB}@${urlDB}/XimuDB`

const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
router.use(middlewareAutenticar);

router.get('/:idView', async function (req, res) {
	let sql = "SELECT Bars.id, Bars.idview,Bars.dataStyle,Bars.dateStyle,Data.name as dataName, Divider.name as dividerName FROM (Bars INNER JOIN ModelsData as Data ON Bars.data = Data.id) INNER JOIN ModelsData as Divider ON Bars.divider = Divider.id WHERE idView = " + req.params.idView;

	const connection = mysql.createConnection(consMysql);
	await connection.query(sql, async function (error, results) {
		if (error) {
			return res.status(304).end();
		}
		let response = results[0];
		console.log(results)
		return res.status(200).send(response);
	})
})

router.post('/', async function (req, res) {
	const view = []
	const bar = []
	view.push(req.body.bar.name)
	view.push(req.body.bar.idDashboard)
	view.push(req.body.bar.type)
	view.push(req.body.radar.idDevice)
	bar.push(req.body.bar.data)
	bar.push(req.body.bar.divider)
	bar.push(req.body.bar.dataStyle)
	bar.push(req.body.bar.dateStyle || null)
	const connection = mysql.createConnection(consMysql);
	await connection.query("INSERT INTO views(name, idDashboard, type, idDevice) VALUES (?,?,?,?)", view, async function (error, results) {
		if (error) {
			return res.status(404).end();
		}
		bar.push(results.insertId)
		await connection.query("INSERT INTO Bars(data, divider, dataStyle, dateStyle, idView) VALUES (?,?,?,?,?)", bar, async function (error, results) {
			if (error) {
				return res.status(404).end();
			}
			let response = results[0];
			return res.status(200).send(response);
		})
	})
})

module.exports = router;