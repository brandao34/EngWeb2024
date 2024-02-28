var http = require('http')
var fs = require('fs')
var url = require('url')


http.createServer(function (req, res){
    var regex = /^\/c\d+$/
    var q = url.parse(req.url, true)
    if(regex.test(q.pathname)){
        fs.readFile('html/' + q.pathname.substring(1) + '.html', function(erro,dados){  // abrir pasta html
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        })
    }
    /*else if (q.pathname == '/w3.css'){
        fs.readFile('w3.css', function(erro,dados){
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.write(dados)
            res.end()
        })
    }*/
    else if (q.pathname == '/'){
        fs.readFile('html/mapa.html', function(erro,dados){
            if (erro) {
                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                res.end("<p>Erro interno do servidor.</p>")
            } else {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(dados)
                res.end()
            }
        })    
    }
    else {
        res.writeHead(400,{'Content-Type': 'text/html; charset=utf-8'}) // error 400 bad request, aparece no browser
        res.write('<p>Erro: pedido não suportado.</p>')
        res.write('<pre>' + q.pathname + '</pre>')
        res.end()
    }
    console.log(q)
}).listen(7777)