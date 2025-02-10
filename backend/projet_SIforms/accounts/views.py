from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Account
from rest_framework.exceptions import ValidationError 
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

class CreateAccountView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        data = request.data

        # Vérifier que les champs obligatoires sont présents
        REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'password']
        for field in REQUIRED_FIELDS:
            if field not in data:
                raise ValidationError({field: 'This field is required.'})

        # Récupérer les valeurs des champs
        email = data.get('email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        password = data.get('password')
        phone = data.get('phone', None)
        lang = data.get('lang', 'en')

        # Créer un nouvel utilisateur
        try:
            account = Account(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            lang=lang
            )
            account.set_password(password)
            account.save()
            return Response({
                'message': 'Account created successfully.',
                'user': {
                    'email': account.email,
                    'first_name': account.first_name,
                    'last_name': account.last_name,
                    'phone': account.phone,
                    'lang': account.lang,
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        data = request.data


        REQUIRED_FIELDS = ['old_password', 'new_password']
        for field in REQUIRED_FIELDS:
            if field not in data:
                return Response({'error': f'{field} is required.'}, status=status.HTTP_400_BAD_REQUEST)

        old_password = data.get('old_password')
        new_password = data.get('new_password')

        # Vérifier que l'ancien mot de passe est correct
        user = request.user
        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        # Modifier le mot de passe
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
    
class ChangeLanguageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        # Vérifier que le champ 'lang' est présent
        if 'lang' not in data:
            return Response({'error': 'lang is required.'}, status=status.HTTP_400_BAD_REQUEST)

        lang = data.get('lang')

        # Modifier la langue de l'utilisateur
        user = request.user
        user.lang = lang
        user.save()

        return Response({'message': 'Language updated successfully.', 'lang': user.lang}, status=status.HTTP_200_OK)
    
class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user

        #verfie s'y a un champ manquant et modifie les champs remplis
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
        if 'phone' in data:
            user.phone = data['phone']

        try:
            user.save()
            return Response({
                'message': 'Profile updated successfully.',
                'user': {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'phone': user.phone,
                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)