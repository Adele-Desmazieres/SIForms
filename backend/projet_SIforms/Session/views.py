from django.shortcuts import render
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.utils.timezone import now
from accounts.models import Account 
from django.contrib.auth import login
from accounts.serializers import AccountSerializer
# Durée de vie des tokens en jours
TOKEN_EXPIRY_DAYS = 10



class LoginView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        data = request.data

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)
        if user is None:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)
        print("user", user)
        
        # Créer ou récupérer un token existant
        token, created = Token.objects.get_or_create(user=user)

        # Vérifier l'expiration du token
        if not created:
            token_age = now() - token.created
            if token_age > datetime.timedelta(days=TOKEN_EXPIRY_DAYS):
                # Supprimer l'ancien token et en générer un nouveau
                token.delete()
                token = Token.objects.create(user=user)

        user_serializer = AccountSerializer(user)

        return Response({
            'token': token.key,
            'expires_in_days': TOKEN_EXPIRY_DAYS,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.auth
        if token:
            token.delete()
            logout(request) 
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)
