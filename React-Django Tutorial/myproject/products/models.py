from django.db import models
from django.contrib.auth.models import User


# 🛍️ PRODUCT MODEL
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField()
    image = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


# 🧾 ORDER MODEL
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - ₹{self.total}"


# 📦 ORDER ITEM MODEL (IMPORTANT)
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product_name = models.CharField(max_length=200)
    price = models.FloatField()
    qty = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.product_name} ({self.qty})"