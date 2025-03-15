# accounts/models.py
from django.db import models


class Utilisateur(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    mot_de_passe = models.CharField(max_length=255)
    adresse = models.TextField(null=True, blank=True)
    telephone = models.CharField(max_length=20, null=True, blank=True)
    date_inscription = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"


class Role(models.Model):
    id = models.AutoField(primary_key=True)
    type_role = models.CharField(max_length=50)
    description = models.TextField()
    
    class Meta:
        verbose_name = "Rôle"
        verbose_name_plural = "Rôles"


class RoleDesUtilisateur(models.Model):
    id = models.AutoField(primary_key=True)
    utilisateur = models.ForeignKey('Utilisateur', on_delete=models.CASCADE, related_name='roles')
    role = models.ForeignKey('Role', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Rôle des utilisateurs"
        verbose_name_plural = "Rôles des utilisateurs"


class Administrateur(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    
    def creerUtilisateur(self):
        pass
    
    def supprimerUtilisateur(self):
        pass
    
    class Meta:
        verbose_name = "Administrateur"
        verbose_name_plural = "Administrateurs"


class Etudiant(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    adresse = models.TextField()
    date_naissance = models.DateField()
    niveau_etude = models.CharField(max_length=50)
    departement = models.CharField(max_length=100)
    statut_etudiant = models.CharField(max_length=50)
    
    def suivrePasserent(self):
        pass
    
    def suivreAbsence(self):
        pass
    
    class Meta:
        verbose_name = "Étudiant"
        verbose_name_plural = "Étudiants"


class ResponsableDeScolarite(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    adresse = models.TextField()
    telephone = models.CharField(max_length=20)
    niveau_etude = models.CharField(max_length=50)
    departement = models.CharField(max_length=100)
    
    def gererInscriptionEtudiant(self, etudiant_id):
        pass
    
    def creerResume(self):
        pass
    
    class Meta:
        verbose_name = "Responsable de scolarité"
        verbose_name_plural = "Responsables de scolarité"


class Enseignant(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    adresse = models.TextField()
    specialisation = models.CharField(max_length=100)
    niveau_etude = models.CharField(max_length=50)
    matiere_partie = models.CharField(max_length=100)
    statut = models.CharField(max_length=50)
    
    def organiser_des_cours(self):
        pass
    
    def corriger(self):
        pass
    
    class Meta:
        verbose_name = "Enseignant"
        verbose_name_plural = "Enseignants"





