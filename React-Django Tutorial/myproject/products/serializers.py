from rest_framework import serializers
from .models import Product, Order

# PRODUCT SERIALIZER
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


# ORDER SERIALIZER
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'