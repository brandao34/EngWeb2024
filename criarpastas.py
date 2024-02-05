import os 


# criar 8 pastas de TPC 
# Criar Pasta de projeto
# Criar Pasta de Teste 
# Criar ficheiro .gitkeep dentro de cada pasta 

nome = "TPC"

for i in range(8):
    nomePasta = f"{nome}{i+1}" # alternativa nome + str(i+1)
    # Criar Pasta 
    os.mkdir(nomePasta) 
    open(f"{nomePasta}/.gitkeep", "w")


nomePasta = "Teste" # alternativa nome + str(i+1)
# Criar Pasta 
os.mkdir(nomePasta) 
open(f"{nomePasta}/.gitkeep", "w")   


nomePasta = "Projeto" # alternativa nome + str(i+1)
# Criar Pasta 
os.mkdir(nomePasta) 
open(f"{nomePasta}/.gitkeep", "w")  


