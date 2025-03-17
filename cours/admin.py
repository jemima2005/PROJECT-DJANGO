from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Classe)
admin.site.register(models.Cours)
admin.site.register(models.CoursEnseignant)
admin.site.register(models.CoursEtudiant)
admin.site.register(models.EnseignantMatiere)
admin.site.register(models.Matiere)
admin.site.register(models.Planifier)
admin.site.register(models.EtudiantClasse)