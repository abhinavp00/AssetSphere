from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import AbstractUser
from django.conf import settings


# Create your models here.

class User(AbstractUser):
    Role = (('ADMIN','Admin'),
            ('EMPLOYEE','Employee'),
            ('TECHNICIAN','Technicion'))
    role = models.CharField(max_length=20,choices=Role,default='EMPLOYEE')

    def __str__(self):
        return self.username


class Asset(models.Model):
    name = models.CharField(max_length=150)
    asset_type = models.CharField(max_length=60)
    serial_number = models.CharField(max_length=100,unique=True)
    STATUS = [('available','Available'),
              ('in_use','In_Use'),
              ('under_maintenance','Under_Maintenance'),
              ("disposed","Disposed"),]
    status = models.CharField(max_length=90,choices=STATUS,default='available')
    purchase_date = models.DateField(default=now)
    
    def __str__(self):
        return self.name


class Inventory(models.Model):
    item_type = models.CharField(max_length=190)
    quantity = models.PositiveIntegerField()
    threshold  = models.PositiveIntegerField()

    def __str__(self):
        return self.item_type
    

class Assignment(models.Model):
    asset = models.ForeignKey(Asset,on_delete=models.CASCADE)
    employee = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    date_assigned = models.DateField(default=now)
    date_return = models.DateField(null=True,blank=True)

    def __str__(self):
        return f"{self.asset}-{self.employee}"
    

class RepairTicket(models.Model):
    asset = models.ForeignKey(Asset,on_delete=models.CASCADE)
    issue = models.CharField(max_length=120)
    STATUS_R = [('received','Received'),
                ('in progress','In Progress'),
                ('resolved','Resovled'),]
    status = models.CharField(max_length=100,choices=STATUS_R,default='received')
    assigned_technician = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True,limit_choices_to={'role':'TECHNICIAN'})


    def __str__(self):
        return f"{self.asset} - {self.status}"

