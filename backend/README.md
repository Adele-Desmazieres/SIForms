# biblio
```
pip install djangorestframework 
pip install psycopg2 
pip install python-dotenv
pip install qrcode[pil]
```
# psql

## start pqsl 
```
sudo service postgresql start
```
## lancer le terminal pqsl 
``` 
sudo -i -u postgres 
pqsl
```


# setup 

faire un fichier .env

copie coller ce qui a ci dessous et remplir les cases manquants
```
SECRET_KEY=django-insecure-l2!h2**v04*+so*f*w^#=v7n4ydhsxrw8bb1$!tgr4-nh4=6j3
DEBUG=True
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
```

ensuite faire les commande ci dessous pour ajouter les tables dans postgre 
```
python3 manage.py makemigrations
python3 manage.py migrate
```
et pour lancer
```
python3 manage.py runserver 
```
