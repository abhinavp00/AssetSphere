from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    Userviewset,
    AssetViewSet,
    InventoryViewSet,
    AssignmentViewSet,
    RepairViewSet,
)

router = DefaultRouter()
router.register(r"asset", AssetViewSet)
router.register(r"inventory", InventoryViewSet)
router.register(r"assignment", AssignmentViewSet)
router.register(r"tickets", RepairViewSet)
router.register(r"users",Userviewset)

urlpatterns = router.urls
