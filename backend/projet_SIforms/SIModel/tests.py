from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import SIModel

class SIModelViewSetTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.model1 = SIModel.objects.create(
            name="Test Model 1", version=1, data={"key": "value1"}
        )
        cls.model2 = SIModel.objects.create(
            name="Test Model 2", version=1, data={"key": "value2"}
        )
        cls.list_url = reverse('model-list')  # Nom de l'endpoint pour `list`
        cls.retrieve_url = lambda pk: reverse('model-detail', args=[pk])  # Endpoint pour `retrieve`

    def test_list_simodels(self):
        """
        Tester la récupération de tous les modèles.
        """
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Test Model 1")
        self.assertEqual(response.data[1]["name"], "Test Model 2")

    def test_retrieve_simodel_valid(self):
        """
        Tester la récupération d'un modèle spécifique (valide).
        """
        response = self.client.get(self.retrieve_url(self.model1.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test Model 1")
        self.assertEqual(response.data["data"], {"key": "value1"})

    def test_retrieve_simodel_invalid(self):
        """
        Tester la récupération d'un modèle spécifique (invalide).
        """
        response = self.client.get(self.retrieve_url(999))  # ID inexistant
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
