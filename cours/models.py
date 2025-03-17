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

    def __str__(self):
        return f"{self.designation} - {self.niveau} - {self.filiere}"


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

    def __str__(self):
        return f"{self.intitule} - {self.niveau} - {self.matiere.designation}"


class CoursEnseignant(models.Model):
    cours = models.ForeignKey('Cours', on_delete=models.CASCADE)
    enseignant = models.ForeignKey('accounts.Utilisateur', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Cours enseignant"
        verbose_name_plural = "Cours enseignants"

    def __str__(self):
        return f"{self.cours.intitule} - {self.enseignant.nom} - {self.enseignant.prenom}"


class CoursEtudiant(models.Model):
    cours = models.ForeignKey('Cours', on_delete=models.CASCADE)
    etudiant = models.ForeignKey('accounts.Utilisateur', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Cours étudiant"
        verbose_name_plural = "Cours étudiants"

    def __str__(self):
        return f"{self.cours.intitule} - {self.etudiant.nom} - {self.etudiant.prenom}"


class EnseignantMatiere(models.Model):
    enseignant = models.ForeignKey('accounts.Utilisateur', on_delete=models.CASCADE)
    matiere = models.ForeignKey('Matiere', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Enseignant matière"
        verbose_name_plural = "Enseignants matières"

    def __str__(self):
        return f"{self.matiere.designation} - {self.enseignant.nom} - {self.enseignant.prenom}"




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

    def __str__(self):
        return f"{self.designation} - {self.niveau} - {self.filiere} | {self.effectif}"




class EtudiantClasse(models.Model):
    etudiant = models.ForeignKey('accounts.Utilisateur', on_delete=models.CASCADE)
    classe = models.ForeignKey('Classe', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Étudiant classe"
        verbose_name_plural = "Étudiants classes"

    def __str__(self):
        return f"{self.etudiant.nom} - {self.etudiant.prenom} - {self.classe.designation}"


class Planifier(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    salle = models.CharField(max_length=50)
    enseignant = models.ForeignKey('accounts.Utilisateur', on_delete=models.CASCADE)
    
    def ajouterPlanning(self):
        pass
    
    def modifierPlanning(self):
        pass
    
    class Meta:
        verbose_name = "Planification"
        verbose_name_plural = "Planifications"

    def __str__(self):
        return f"{self.salle} - {self.enseignant.nom} - {self.enseignant.prenom}"