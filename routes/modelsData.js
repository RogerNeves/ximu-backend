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
  let sql
  if(req.query.id){
    sql = "SELECT * FROM ModelsData WHERE id = " + req.query.id;
  }else if(req.query.idModel){
    sql = "SELECT * FROM ModelsData WHERE idModel = " + req.query.idModel;
  }  

  const connection = mysql.createConnection(consMysql);
  connection.query(sql, async function (error, results) {
    if (error) {
      return res.status(304).end();
    }
    let resposta = results;
    if(req.query.id)
      resposta = results[0]
    return res.status(200).send(resposta);
  });
});

router.post('/', async function (req, res) {
  const dado = [];
  dado.push(req.body.dado.nome);
  dado.push(req.body.dado.modelo);
  dado.push(req.body.dado.tipoDado);
  const connection = mysql.createConnection(consMysql);
  await connection.query("INSERT INTO dadosentrada(nome, IdModelos, idTiposDados) VALUES (?,?,?)", dado, async function (error, results) {
    if (error) {
      return res.status(304).end();
    }
    let resposta = results[0];
    return res.status(200).send(resposta);
  });
})


router.put('/', async function (req, res) {
  let dadosNovos = req.body.datas.filter(dado => !dado.id)
  dadosNovos = dadosNovos.map(dado => {
    return [dado.nome, dado.IdModel, parseInt(dado.idDataType)]})
  const values = dadosNovos.map(() => "(?)")
  const connection = mysql.createConnection({
    host: urlDB,
    user: userDB,
    password: passwordDB,
    database: 'Ximu',
    multipleStatements: true
  })
  if(dadosNovos.length){
    await connection.query("INSERT INTO ModelsData(Name, IdModel, idDataType) VALUES " + values.join(","), dadosNovos, async function (error, results) {
      if (error) {
        console.log(error);
        return res.status(304).end();
      }
      });
  }
    let dadosAntigos = req.body.datas.filter(dado => dado.id)
    dadosAntigos = dadosAntigos.map(dado => [dado.nome, parseInt(dado.idTiposDados), dado.id])

    dadosAntigos = dadosAntigos.map((dado) => mysql.format("UPDATE ModelsData SET name = ? ,idDataType= ?  WHERE id = ?; ", dado));
    await connection.query(dadosAntigos.join(""), async function (error, results) {
      if (error) {
        console.log(error);
        return res.status(304).end();
      }
      let resposta = results[0];
      return res.status(200).send(resposta);
    });
})

router.delete('/:id', async function (req, res) {
  let id = [req.params.id];
  console.log(id);
  const connection = mysql.createConnection(consMysql);
  await connection.query("DELETE FROM modelo WHERE id = ?", id, async function (error, results) {
    if (error) {
      console.log(error)
      return res.status(304).end();
    }
    return res.status(200).end();
  });
})

module.exports = router;
