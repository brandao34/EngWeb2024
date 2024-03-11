
var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js');             // Colocar na mesma pasta
const { Console } = require('console');

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}



// Server creation

var compositorServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET":
                
                                // GET /periodos --------------------------------------------------------------------
                                if(req.url == '/periodos'){ // SOLUÇÃO DA LISTAGEM (o que pode mudar é a template)
                                    // lista dos periodos, tem de se fazer get ao json server
                                    axios.get('http://localhost:3000/periodo')
                                    .then(resposta => {
                                        res.writeHead(200, {'Content-Type': "text/html"})
                                        res.end(templates.periodosListPage(resposta.data, d))
                                    })
                                    .catch( erro => {
                                        //res.writeHead(520, {'Content-Type': "text/html"})
                                        res.end(templates.errorPage(erro, d))
                                    })
                                }
                                // GET /periodos/{id} --------------------------------------------------------------------
                                else if (/\/periodos\/[A-Z]{1,2}/.test(req.url)){
                                    var partes = req.url.split('/')
                                    idPeriodo = partes[partes.length - 1]
                                    axios.get('http://localhost:3000/periodo/' + idPeriodo)
                                    .then(resposta => {
                                        res.writeHead(200, {'Content-Type': "text/html"})
                                        res.end(templates.periodoPage(resposta.data, d))
                                    })
                                    .catch( erro => {
                                        res.writeHead(521, {'Content-Type': "text/html"})
                                        res.end(templates.errorPage(erro, d))
                                    })
                                }
                
                                // GET /compositores?periodo
                                else if (req.url.includes('/compositores?periodo=')){
                                    var periodo = req.url.split('=')[1]
                                    axios.get('http://localhost:3000/compositores?periodo=' + periodo)
                                    .then(resposta => {
                                        res.writeHead(200, {'Content-Type': "text/html"})
                                        res.end(templates.compositoresByPeriodoPage(resposta.data, d, periodo))
                                    })
                                    .catch( erro => {
                                        res.writeHead(521, {'Content-Type': "text/html"})
                                        res.end(templates.errorPage(erro, d))
                                    })
                                }







                // GET /compositores --------------------------------------------------------------------
                else if(req.url == '/compositores'){ // SOLUÇÃO DA LISTAGEM (o que pode mudar é a template)
                    // lista dos alunos, tem de se fazer get ao json server
                    axios.get('http://localhost:3000/compositores')
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.end(templates.studentsListPage(resposta.data, d))
                    })
                    .catch( erro => {
                        res.writeHead(520, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if (/\/compositores\/C[0-9]{2,3}/.test(req.url)){
                    axios.get('http://localhost:3000' + req.url)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.end(templates.studentPage(resposta.data, d))
                    })
                    .catch( erro => {
                        res.writeHead(520, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                }

                // GET /compositores/registo --------------------------------------------------------------------
                else if (req.url == '/compositores/registo'){
                    res.writeHead(200, {'Content-Type': "text/html"})
                    res.end(templates.studentFormPage(d))
                }
                // GET /compositores?periodo


                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/C[0-9]{2,3}/.test(req.url)){
                    var partes = req.url.split('/')
                    idAluno = partes[partes.length - 1]
                    axios.get('http://localhost:3000/compositores/' + idAluno)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.end(templates.studentFormEditPage(resposta.data,d))
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })


                }
                // GET /compositores/delete
                else if (/\/compositores\/delete\/C[0-9]{2,3}/.test(req.url)){
                    var partes = req.url.split('/')
                    idAluno = partes[partes.length - 1]
                    axios.delete('http://localhost:3000/compositores/' + idAluno)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        res.end(`<pre> ${JSON.stringify(resposta.data)}<pre>`)
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                }

                // GET /periodos --------------------------------------------------------------------

                
                // GET /periodos/{id} --------------------------------------------------------------------
                // Get -> ERRO 
                else{
                    res.writeHead(404, {'Content-Type': "text/html"})
                    // meter a template mais bonitinha e tal
                    res.end(templates.errorPage(`Pedido Não Suportado: ${req.url}`, d))
                }
                break
            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if(req.url == '/compositores/registo'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.post('http://localhost:3000/compositores', result)
                            .then(resposta => {
                                res.writeHead(201, {'Content-Type': "text/html"})
                                res.end(templates.studentPage(resposta.data, d))
                            })
                            .catch( erro => {
                                res.writeHead(520, {'Content-Type': "text/html"})
                                res.end(templates.errorPage(erro, d))
                            })

                        } else {
                            res.writeHead(200, {'Content-Type': "text/html"})
                            res.end("<p>Unable to collect data from body...</p>")
                        }
                    })
                }

                
                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/C[0-9]{2,3}/.test(req.url)){
                    var partes = req.url.split('/')
                    idAluno = partes[partes.length - 1]
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.put('http://localhost:3000/compositores/'+ idAluno, result)
                            .then(resposta => {
                                res.writeHead(201, {'Content-Type': "text/html"})
                                res.end(templates.studentPage(resposta.data, d))
                            })
                            .catch( erro => {
                                res.writeHead(520, {'Content-Type': "text/html"})
                                res.end(templates.errorPage(erro, d))
                            })

                        } else {
                            res.writeHead(200, {'Content-Type': "text/html"})
                            res.end("<p>Unable to collect data from body...</p>")
                        }
                    })
                }
                // POST ? -> Lancar um erro
        
            break
        
            default: 
                // Outros metodos nao sao suportados
        }
    }
})

compositorServer.listen(7777, ()=>{
    console.log("Servidor a  escuta na porta 7777...")
})


