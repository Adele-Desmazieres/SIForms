from django.db import models
from django.utils.timezone import now

class Form(models.Model):
    id = models.AutoField(primary_key=True)
    id_client = models.IntegerField(help_text="Identifiant unique dans l'application.")
    data = models.TextField(help_text="Données des réponses du formulaire.")
    created_at = models.DateTimeField(default=now, help_text="Date de création du formulaire.")
    sent_at = models.DateTimeField(null=now, blank=True, help_text="Date de réception par le serveur.")
    is_complete = models.BooleanField(default=False, help_text="Indique si le formulaire a été complété.")
    model = models.IntegerField(help_text="Identifiant du modèle suivi par le formulaire.")
    author = models.IntegerField(null=True, blank=True, help_text="Identifiant de l'auteur du formulaire.")
    
    class Meta:
        verbose_name = "Formulaire"
        verbose_name_plural = "Formulaires"
        ordering = ['-sent_at']

    def __str__(self):
        return f"Form {self.id} - Client {self.id_client}"


class ImageBlob(models.Model):
    id = models.AutoField(primary_key=True)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="images", help_text="Formulaire associé à l'image.")
    image_blob = models.BinaryField(help_text="Données binaires de l'image.")
    file_name = models.CharField(max_length=255, help_text="Nom du fichier d'image.")
    content_type = models.CharField(max_length=50, help_text="Type MIME de l'image (ex : image/png).")
    created_at = models.DateTimeField(default=now, help_text="Date de création de l'image.")

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
        ordering = ['-created_at']

    def __str__(self):
        return f"Image {self.id} for Form {self.form.id} ({self.file_name})"
