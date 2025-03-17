from django.contrib import admin
from .models import Forum, Message

# Register your models here.
admin.site.register(Forum)
admin.site.register(Message)