from rest_framework import serializers
from .models import User,Asset,Inventory,RepairTicket,Assignment



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email","password","role"]


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'

    def validate_serial_number(self,value):
        qs = Asset.objects.filter(serial_number=value)
        if self.instance:
            qs=qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Serial_nmbers are Already Exists")
        return value

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'
        

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class RepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairTicket
        fields = '__all__'