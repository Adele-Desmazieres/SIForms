from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            username=username,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class Account(AbstractBaseUser):
    first_name = models.CharField(max_length=50, verbose_name="Prénom")
    last_name = models.CharField(max_length=50, verbose_name="Nom de famille")
    email = models.EmailField(unique=True, verbose_name="Adresse email")
    phone = models.CharField(max_length=15, blank=True, null=True, verbose_name="Numéro de téléphone")
    password = models.CharField(max_length=128, verbose_name="Mot de passe")
    lang = models.CharField(max_length=10, default='fr', verbose_name="Langue de préférence")
    
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = MyAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS  = ['first_name', 'last_name']

    class Meta:
        verbose_name = "Compte utilisateur"
        verbose_name_plural = "Comptes utilisateurs"

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    def set_password(self, raw_password):
        """
        Permet de chiffrer le mot de passe.
        """
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """
        Vérifie si le mot de passe correspond.
        """
        return check_password(raw_password, self.password)
    
    
    @property
    def is_anonymous(self):
        return False
