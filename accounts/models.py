# accounts/models.py
from django.db import models
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.hashers import make_password, check_password

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

    def __str__(self):
        return f"{self.nom} - {self.prenom}"
    
    # ✅ Méthode pour sécuriser le mot de passe
    def set_password(self, raw_password):
        self.mot_de_passe = make_password(raw_password)

    # ✅ Méthode pour vérifier un mot de passe
    def check_password(self, raw_password):
        return check_password(raw_password, self.mot_de_passe)
    
    # ✅ Surcharge de save pour hacher le mot de passe avant l'enregistrement
    def save(self, *args, **kwargs):
        if not self.pk or not Utilisateur.objects.filter(pk=self.pk, mot_de_passe=self.mot_de_passe).exists():
            self.mot_de_passe = make_password(self.mot_de_passe)
        super().save(*args, **kwargs)


class Role(models.Model):
    id = models.AutoField(primary_key=True)
    type_role = models.CharField(max_length=50)
    description = models.TextField()
    
    class Meta:
        verbose_name = "Rôle"
        verbose_name_plural = "Rôles"

    def __str__(self):
        return f"{self.type_role}"


class RoleDesUtilisateur(models.Model):
    id = models.AutoField(primary_key=True)
    utilisateur = models.ForeignKey('Utilisateur', on_delete=models.CASCADE, related_name='roles')
    role = models.ForeignKey('Role', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Rôle des utilisateurs"
        verbose_name_plural = "Rôles des utilisateurs"

    def __str__(self):
        return f"{self.utilisateur.nom} - {self.role.type_role}"


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




class UserRoleMiddleware(MiddlewareMixin):
    """
    Middleware pour attacher l'utilisateur personnalisé à la requête
    en fonction de l'utilisateur Django authentifié
    """
    
    def process_request(self, request):
        # Si l'utilisateur est authentifié et que l'ID utilisateur est en session
        if request.user.is_authenticated and 'utilisateur_id' in request.session:
            utilisateur_id = request.session.get('utilisateur_id')
            
            try:
                # Récupérer l'utilisateur personnalisé
                utilisateur = Utilisateur.objects.get(id=utilisateur_id)
                request.utilisateur = utilisateur
                
                # Récupérer les rôles potentiels de l'utilisateur
                try:
                    request.etudiant = Etudiant.objects.get(email=utilisateur.email)
                except Etudiant.DoesNotExist:
                    request.etudiant = None
                
                try:
                    request.enseignant = Enseignant.objects.get(email=utilisateur.email)
                except Enseignant.DoesNotExist:
                    request.enseignant = None
                
                try:
                    request.administrateur = Administrateur.objects.get(email=utilisateur.email)
                except Administrateur.DoesNotExist:
                    request.administrateur = None
                
                try:
                    request.resp_scolarite = ResponsableDeScolarite.objects.get(email=utilisateur.email)
                except ResponsableDeScolarite.DoesNotExist:
                    request.resp_scolarite = None
                
                # try:
                #     request.comptable = Comptable.objects.get(email=utilisateur.email)
                # except Comptable.DoesNotExist:
                #     request.comptable = None
                
            except Utilisateur.DoesNotExist:
                # Si l'utilisateur n'existe plus, nettoyer la session
                del request.session['utilisateur_id']
                request.utilisateur = None
        else:
            request.utilisateur = None
            request.etudiant = None
            request.enseignant = None
            request.administrateur = None
            request.resp_scolarite = None
            # request.comptable = None
