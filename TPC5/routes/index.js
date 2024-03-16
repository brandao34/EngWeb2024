var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)

  res.render('index', { title: 'Compositores' });
});


/* GET compositores */
router.get('/compositores', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)

  axios.get('http://localhost:3000/compositores')
  .then(resposta => {res.render('listaCompositores', {lista: resposta.data, data:d, titulo: "Lista de Compositores"});
})
  .catch( erro => {
    res.render('error', {error: erro,message: 'Erro a recuperar os compositores'})
  })

});


/* GET compositores/registo */
router.get('/compositores/registo', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  res.render('registoCompositores', {data:d, titulo: "Registo de Compositores"})
});
/* POST alunos/registo */
router.post('/compositores/registo', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  console.log (JSON.stringify(req.body))
  axios.post ('http://localhost:3000/compositores', req.body)
  .then(resposta => {
    res.render('confirmRegisto', {info: req.body, data:d, titulo: "Registo de Compositor cenas " })
  })
  .catch( erro => {
    res.render('error', {error: erro,message: 'Erro a gravar um compositor novo'})
  })
});


router.get('/compositores/:id', function(req, res){
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores/' + req.params.id)
                    .then(resposta => {
                      res.render('compositores', {title: 'Consulta de Compositor',aluno: resposta.data,data: d});
                    })
                    .catch( erro => {
                      res.render('error',{erro,message:'Erro ao recuperar o aluno.'})
                    })
});


/* GET periodos */
router.get('/periodo', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)

  axios.get('http://localhost:3000/periodo')
  .then(resposta => {res.render('listaPeriodos', {lista: resposta.data, data:d, titulo: "Lista de Periodos"});
})
  .catch( erro => {
    res.render('error', {error: erro,message: 'Erro a recuperar os periodos'})
  })

});




module.exports = router;
