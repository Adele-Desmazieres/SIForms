from rest_framework import serializers
from .models import SIModel

class SIModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SIModel
        fields = '__all__'

