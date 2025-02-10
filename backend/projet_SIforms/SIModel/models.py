from django.db import models
from django.db.models import JSONField

class SIModel(models.Model):
    id = models.AutoField(primary_key=True)  # Identifiant unique du modèle.
    name = models.CharField(max_length=255)  # Nom du modèle.
    version = models.IntegerField()  # Version du modèle.
    date = models.DateTimeField(auto_now_add=True)  # Date de création de cette version.
    data = models.JSONField()  # Données des questions en format JSON.
    class Meta:
        unique_together = ('name', 'version')

    def __str__(self):
        return f"{self.name} (Version {self.version})"
