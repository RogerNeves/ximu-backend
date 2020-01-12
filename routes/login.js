const express = require('express');
const app = express();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const autenticar = require("./../config/autenticar");
const { user: userDB, password: passwordDB, url: urlDB, database} = require('../dataBase/mysql.json')
const consMysql = `mysql://${userDB}:${passwordDB}@${urlDB}/${database}`
const router = express.Router();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

router.post('/singin', async function (req, res, next) {
	let email = [];
	email = req.body.singin.email
	let password = req.body.singin.password
	const connection = mysql.createConnection(consMysql);
	connection.query("SELECT * FROM Logins WHERE email = ?", email, async function (error, results) {
		if (error) {
			return res.status(404).send(error);
		}
		if (!await bcrypt.compareSync(password, results[0].password)) {
			return res.status(401).send({ erro: "password invalida" });
		}
		const Authorization = `Bearer ${jwt.sign({ id: results[0].id }, autenticar.segredo)}`

		let resposta = { Authorization };
		return res.status(200).json(resposta);
	});

});

router.post('/singup', async function (req, res, next) {
	let user = [];
	user[0] = req.body.singup.name;
	let login = [];
	login[0] = req.body.singup.email;
	if (req.body.singup.password == req.body.singup.confirmPassword) {
		login[1] = req.body.singup.password;
	}
	const connection = mysql.createConnection(consMysql);
	connection.query("INSERT INTO Users(name) VALUES(?)", user, async function (error, results, fields) {
		if (error) {
			console.log(error);
			res.status(400).send(error).end();
		}
		login[2] = results.insertId;
		var hash = await bcrypt.hash(login[1], 10);
		login[1] = hash;
		console.log(login)
		connection.query('INSERT INTO Logins(email, password, idUsers) VALUES (?,?,?)', login, async function (error, results, fields) {
			if (error) {
				res.status(400).end();
			}
		});
		res.status(201).end();
	});
});

module.exports = router;
