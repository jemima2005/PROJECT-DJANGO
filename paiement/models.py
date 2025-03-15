# paiement/models.py
from django.db import models
from accounts.models import Etudiant


class RapportFinancier(models.Model):
    id = models.AutoField(primary_key=True)
    id_rapport = models.CharField(max_length=50)
    annee = models.CharField(max_length=20)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    beneficiaires = models.TextField()
    
    class Meta:
        verbose_name = "Rapport financier"
        verbose_name_plural = "Rapports financiers"


class Comptable(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    rapport_financier = models.ForeignKey('RapportFinancier', on_delete=models.CASCADE)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    
    def genererRapportFinancier(self):
        pass
    
    class Meta:
        verbose_name = "Comptable"
        verbose_name_plural = "Comptables"
