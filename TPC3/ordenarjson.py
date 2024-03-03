import json

# Carregar o ficheiro JSON original
with open("filmes.json", "r") as f:
    data = json.load(f)

# Criar a estrutura de dados do novo JSON
novo_json = {
    "filmes": [],
    "cast": [],
    "genres": [],
}

# Contador para IDs
cast_id_counter = 1
genres_id_counter = 1

# Iterar pelos filmes
for filme in data["filmes"]:
    # Adicionar filme ao novo JSON
    novo_json["filmes"].append({
        "id": filme["_id"]["$oid"],
        "title": filme["title"],
        "year": filme["year"],
        "castId": [],
        "genresId": [],
    })

    # Mapear IDs para elenco e géneros
    for cast_member in filme["cast"]:
        # Verificar se o membro do elenco já existe
        cast_id = None
        for cast_entry in novo_json["cast"]:
            if cast_entry["cast"] == cast_member:
                cast_id = cast_entry["castId"]
                break

        # Se não existir, adicionar novo membro do elenco
        if not cast_id:
            cast_id = cast_id_counter
            cast_id_counter += 1
            novo_json["cast"].append({
                "castId": cast_id,
                "cast": cast_member,
            })

        # Adicionar ID do membro do elenco ao filme
        novo_json["filmes"][-1]["castId"].append(cast_id)

    # Mapear IDs para géneros
    try:
        for genre in filme["genres"]:
            # Verificar se o género já existe
            genre_id = None
            for genre_entry in novo_json["genres"]:
                if genre_entry["genres"] == genre:
                    genre_id = genre_entry["genresId"]
                    break
    except KeyError:
        pass    

        # Se não existir, adicionar novo género
        if not genre_id:
            genre_id = genres_id_counter
            genres_id_counter += 1
            novo_json["genres"].append({
                "genresId": genre_id,
                "genres": genre,
            })

        # Adicionar ID do género ao filme
        novo_json["filmes"][-1]["genresId"].append(genre_id)

# Salvar o novo ficheiro JSON
with open("ficheiro_convertido.json", "w") as f:
    json.dump(novo_json, f, indent=4)
