from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter
from .serializers import UserSerializer,AssetSerializer,InventorySerializer,AssignmentSerializer,RepairSerializer
from .models import User,Asset,Inventory,Assignment,RepairTicket



class Userviewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    filter_backends =[SearchFilter]
    search_fields = ['name','serial_number']

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

class RepairViewSet(viewsets.ModelViewSet):
    queryset = RepairTicket.objects.all()
    serializer_class = RepairSerializer
