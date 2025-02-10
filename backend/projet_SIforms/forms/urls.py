from django.urls import path
from .views import FormView, ImageBlobView, CreateQrCode

urlpatterns = [
    path('', FormView.as_view(), name='form-create'),
    path('images/', ImageBlobView.as_view(), name='imageblob-create'),

    path('qr-code/', CreateQrCode, name='generate_qr_code'),
]
