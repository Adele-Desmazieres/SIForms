import json
import django
from django.utils.timezone import now
import os
from django.conf import settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projet_SIforms.settings')
django.setup()

from SIModel.models import SIModel  

# Lire le fichier JSON
with open('data.json', 'r') as file:
    data = json.load(file)

# Insérer dans la base de données
model_instance = SIModel(
    name="ExampleModel",
    version=1,
    date=now(),
    data=data
)
model_instance.save()

print("Data inserted successfully!")
