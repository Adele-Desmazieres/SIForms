from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import SIModel
from .serializers import SIModelSerializer
from django.http import Http404, JsonResponse
from rest_framework.permissions import AllowAny
import json
from rest_framework.views import APIView

class SIModelViewSet(viewsets.ModelViewSet):
    lookup_value_regex = r'\d+'
    queryset = SIModel.objects.all() 
    serializer_class = SIModelSerializer  
    permission_classes = [AllowAny] 

    def list(self, request):
        """
        Récupérer tous les modèles.
        """
        queryset = self.get_queryset()  # Use DRF's built-in method
        serializer = self.get_serializer(queryset, many=True)  # Use DRF's built-in serializer
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Récupérer un modèle spécifique.
        """
        try: 
            model = self.get_queryset().get(pk=pk)  # Use `get_queryset()` for flexibility
            serializer = self.get_serializer(model)  # Use DRF's built-in serializer
            return Response(serializer.data)
        except SIModel.DoesNotExist:
            raise Http404("SIModel non trouvé")
    
    @action(detail=False, methods=['get'], url_path='titles')
    def get_titles(self, request):
        """
        Custom endpoint to retrieve titles from models.
        """
        model_titles = []
        for model in self.get_queryset():
            data = model.data  # Déjà un dictionnaire grâce au JSONField
            if isinstance(data, dict) and 'title' in data:  # Vérification de sécurité
                model_titles.append({'id': model.id, 'title': data['title']})
        return Response({'model_titles': model_titles})
        

