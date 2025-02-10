from django.urls import path
from accounts.views import CreateAccountView, ChangePasswordView, ChangeLanguageView, EditProfileView

urlpatterns = [
    path('', CreateAccountView.as_view(), name='Account'), 
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('change-language/', ChangeLanguageView.as_view(), name='change-language'),
    path('edit-profile/', EditProfileView.as_view(), name='edit-profile'),
]
