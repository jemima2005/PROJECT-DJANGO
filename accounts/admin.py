from django.contrib import admin
from .models import Utilisateur, Role, RoleDesUtilisateur, Etudiant, Enseignant, ResponsableDeScolarite, Administrateur

# Register your models here.
admin.site.register(Utilisateur)
admin.site.register(Role)
admin.site.register(RoleDesUtilisateur)
admin.site.register(Etudiant)
admin.site.register(Enseignant)
admin.site.register(ResponsableDeScolarite)
admin.site.register(Administrateur)