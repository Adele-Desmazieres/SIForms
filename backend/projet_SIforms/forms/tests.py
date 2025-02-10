from rest_framework.test import APITestCase
from rest_framework import status
from django.utils.timezone import now
from .models import Form, ImageBlob
import base64

class FormViewTests(APITestCase):

    def test_create_form_success(self):
        data = {
            "id_client": 123,
            "data": "Form data",
            "model": 1,
            "author": 42,
            "created_at": str(now())
        }
        response = self.client.post("/forms/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("form_id", response.data)
        self.assertEqual(Form.objects.count(), 1)

    def test_create_form_missing_fields(self):
        data = {
            "id_client": 123,
            "data": "Form data"
            # Missing "model"
        }
        response = self.client.post("/forms/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(Form.objects.count(), 0)


class ImageBlobViewTests(APITestCase):

    def setUp(self):
        self.form = Form.objects.create(
            id_client=123,
            data="Test data",
            model=1,
            author=42,
            created_at=now()
        )
        self.valid_image_blob = base64.b64encode(b"fake image data").decode("utf-8")


    def test_add_image_success(self):

        data = {
            "form_id": self.form.id,
            "image_blob": self.valid_image_blob,
            "file_name": "test_image.png",
            "content_type": "image/png"
        }

        response = self.client.post("/forms/images/", data)  # Utilisez la bonne URL ici
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertEqual(ImageBlob.objects.count(), 1)
        self.assertEqual(ImageBlob.objects.first().form, self.form)


    def test_add_image_missing_fields(self):
        data = {
            "form_id": self.form.id,
            "file_name": "test_image.png",
            "content_type": "image/png"
            # Missing "image_blob"
        }
        response = self.client.post("/forms/images/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(ImageBlob.objects.count(), 0)


    def test_add_image_nonexistent_form(self):
        data = {
            "form_id": 9999,  # Non-existent form ID
            "image_blob": self.valid_image_blob,
            "file_name": "test_image.png",
            "content_type": "image/png"
        }
        response = self.client.post("/forms/images/", data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(ImageBlob.objects.count(), 0)
