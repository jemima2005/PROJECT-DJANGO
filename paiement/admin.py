from django.contrib import admin
from .models import Comptable, RapportFinancier

# Register your models here.
admin.site.register(Comptable)
admin.site.register(RapportFinancier)