from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status
from .models import Form, ImageBlob
import base64
from django.utils.timezone import now
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
import qrcode
from django.http import HttpResponse
from io import BytesIO
from django.urls import reverse


class FormView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request, *args, **kwargs):
        id_client = request.data.get("id_client")
        form_data = request.data.get("data")
        model_id = request.data.get("model")
        author = request.data.get("author")
        created_at = request.data.get("created_at")

        if not id_client or not form_data or not model_id:
            return Response(
                {"error": "Les champs 'id_client', 'data' et 'model' sont obligatoires."},
                status=status.HTTP_400_BAD_REQUEST
            )

        form = Form.objects.create(
            id_client=id_client,
            data=form_data,
            model=model_id,
            author=author,
            created_at=created_at,
            sent_at=now(),

        )

        return Response(
            {"message": "Formulaire créé avec succès.", "form_id": form.id},
            status=status.HTTP_201_CREATED
        )


class ImageBlobView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request, *args, **kwargs):
        form_id = request.data.get("form_id")
        image_blob = request.data.get("image_blob")  # Base64 encoded image
        file_name = request.data.get("file_name")
        content_type = request.data.get("content_type")

        if not form_id or not image_blob or not file_name or not content_type:
            return Response(
                {"error": "Les champs 'form_id', 'image_blob', 'file_name' et 'content_type' sont obligatoires."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Décoder les données Base64
        try:
            image_data = base64.b64decode(image_blob)
        except base64.binascii.Error:
            return Response(
                {"error": "Les données de l'image sont invalides."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Récupérer le formulaire associé
        form = get_object_or_404(Form, id=form_id)

        # Créer l'entrée de l'image
        ImageBlob.objects.create(
            form=form,
            image_blob=image_data,
            file_name=file_name,
            content_type=content_type
        )

        return Response(
            {"message": "Image ajoutée avec succès au formulaire.", "form_id": form.id},
            status=status.HTTP_201_CREATED
        )

def CreateQrCode(request):
    # Récupérer la route spécifique depuis les paramètres GET
    specific_route = request.GET.get('route', '/ma-route/')  # Par défaut, '/ma-route/'
    
    # Générer l'URL absolue de la route spécifique
    specific_route_url = request.build_absolute_uri(specific_route)
    
    # Créer un objet QRCode
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Ajouter l'URL spécifique au QR code
    qr.add_data(specific_route_url)
    qr.make(fit=True)
    
    # Créer une image du QR code
    img = qr.make_image(fill='black', back_color='white')
    
    # Sauvegarder l'image dans un buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    
    # Retourner l'image en tant que réponse HTTP
    return HttpResponse(buffer.getvalue(), content_type="image/png")