# cours/models.py
from django.db import models



class Matiere(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=10)
    designation = models.CharField(max_length=100)
    niveau = models.CharField(max_length=50)
    filiere = models.CharField(max_length=50)
    description = models.TextField()
    
    class Meta:
        verbose_name = "Matière"
        verbose_name_plural = "Matières"


class Cours(models.Model):
    id = models.AutoField(primary_key=True)
    intitule = models.CharField(max_length=200)
    niveau = models.CharField(max_length=50)
    volume_horaire = models.IntegerField()
    description = models.TextField()
    objectif = models.TextField()
    support = models.FileField(upload_to='cours/')
    matiere = models.ForeignKey('Matiere', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Cours"
        verbose_name_plural = "Cours"


class CoursEnseignant(models.Model):
    cours = models.ForeignKey('Cours', on_delete=models.CASCADE)
    enseignant = models.ForeignKey('accounts.Enseignant', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Cours enseignant"
        verbose_name_plural = "Cours enseignants"


class CoursEtudiant(models.Model):
    cours = models.ForeignKey('Cours', on_delete=models.CASCADE)
    etudiant = models.ForeignKey('accounts.Etudiant', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Cours étudiant"
        verbose_name_plural = "Cours étudiants"


class EnseignantMatiere(models.Model):
    enseignant = models.ForeignKey('accounts.Enseignant', on_delete=models.CASCADE)
    matiere = models.ForeignKey('Matiere', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Enseignant matière"
        verbose_name_plural = "Enseignants matières"




class Classe(models.Model):
    id = models.AutoField(primary_key=True)
    designation = models.CharField(max_length=100)
    niveau = models.CharField(max_length=50)
    annee_academique = models.CharField(max_length=20)
    description = models.TextField()
    effectif = models.IntegerField()
    filiere = models.CharField(max_length=100)
    specialite = models.CharField(max_length=100)
    
    def ajouterEtudiant(self):
        pass
    
    def supprimerEtudiant(self):
        pass
    
    def voirListeEtudiant(self):
        pass
    
    class Meta:
        verbose_name = "Classe"
        verbose_name_plural = "Classes"




class EtudiantClasse(models.Model):
    etudiant = models.ForeignKey('accounts.Etudiant', on_delete=models.CASCADE)
    classe = models.ForeignKey('Classe', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Étudiant classe"
        verbose_name_plural = "Étudiants classes"


class Planifier(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    salle = models.CharField(max_length=50)
    enseignant = models.ForeignKey('accounts.Enseignant', on_delete=models.CASCADE)
    
    def ajouterPlanning(self):
        pass
    
    def modifierPlanning(self):
        pass
    
    class Meta:
        verbose_name = "Planification"
        verbose_name_plural = "Planifications"