from django.urls import path
from .views import get_products, login_user, register_user, create_order, get_orders

urlpatterns = [
    path('products/', get_products),
    path('register/', register_user),
    path('login/', login_user),
    path('orders/create/', create_order),
    path('orders/', get_orders),
]