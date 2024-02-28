import json

f=open("mapa-virtual.json","r").read()
dados =json.loads(f)


def jsontohtml(): 

    primeirapagina= """<!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <title>Mapa</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
    """

    paginacidades = """<!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <title>Cidade</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
    """

    for stats in dados['cidades']: 
        nome = stats['nome']
        id = stats['id']
        print(f"{id}")
        populacao = stats['população']
        destrito = stats['distrito']

        htmlcidade = open(f"html/{id}.html", "w", encoding="utf-8")
        paginaDESTAcidade = paginacidades
        paginaDESTAcidade += f"""
        <h1> {nome} </h1>
        {id}
        {populacao}
        {destrito}
        
        
        """

        paginaDESTAcidade += """
        </body>
        </html>
        """
        htmlcidade.write(paginaDESTAcidade)
        htmlcidade.close()







    primeirapagina += """
    <h1> Cidades </h1>
    """
    lista_cidades = {}
    for ids in dados['cidades']:
        lista_cidades[ids['id']] = ids['nome']

    #    Ordenar a lista de cidades por ordem alfabética do nome
    lista_cidades_ordenada = dict(sorted(lista_cidades.items(), key=lambda item: item[1]))

    # Iterar sobre a lista ordenada
    for id, nome in lista_cidades_ordenada.items():
        primeirapagina += f'<a href="http://localhost:7777/{id}">{nome} </a>'


    primeirapagina += "</body>"
    Htmlmapa = open("html/mapa.html", "w", encoding="utf-8")
    Htmlmapa.write(primeirapagina)
    Htmlmapa.close()




jsontohtml()
