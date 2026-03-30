from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer


# 📦 GET PRODUCTS
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# 🔐 REGISTER USER
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username & Password required ❌"})

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists ❌"})

    user = User.objects.create_user(username=username, password=password)

    return Response({
        "message": "User registered successfully ✅"
    })


# 🔐 LOGIN USER
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username & Password required ❌"})

    user = User.objects.filter(username=username).first()

    if user is None:
        return Response({"error": "User not found ❌"})

    if not user.check_password(password):
        return Response({"error": "Wrong password ❌"})

    # ✅ GENERATE TOKEN
    refresh = RefreshToken.for_user(user)

    return Response({
        "token": str(refresh.access_token),   # 🔥 IMPORTANT
        "username": user.username
    })


# 🛒 CREATE ORDER (PROTECTED)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    order = Order.objects.create(
        user=request.user,
        items=str(request.data.get('items')),
        total=request.data.get('total')
    )

    return Response({
        "message": "Order created successfully ✅"
    })


# 📦 GET ORDERS (PROTECTED)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)