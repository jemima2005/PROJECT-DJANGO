# accounts/views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.models import User
from .models import Utilisateur, Etudiant, Enseignant, Administrateur, Role, RoleDesUtilisateur

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            # Vérifier si l'utilisateur existe
            utilisateur = Utilisateur.objects.get(email=email)

            # Vérifier le mot de passe avec la méthode sécurisée
            if utilisateur.check_password(password):
                # Récupérer tous les rôles de l'utilisateur
                roles_utilisateur = RoleDesUtilisateur.objects.filter(utilisateur=utilisateur)
                role_types = [ru.role.type_role.lower() for ru in roles_utilisateur]

                # Stocker l'utilisateur en session
                request.session['utilisateur_id'] = utilisateur.id
                request.session['utilisateur_nom'] = utilisateur.nom
                request.session['utilisateur_prenom'] = utilisateur.prenom
                request.session['roles'] = role_types

                # Redirection selon les rôles (priorité si plusieurs rôles)
                if 'admin' in role_types:
                    return redirect('dashboard:admin_dashboard')
                elif 'teacher' in role_types:
                    return redirect('dashboard:teacher_dashboard')
                elif 'academic' in role_types:
                    return redirect('dashboard:academic_dashboard')
                elif 'accounting' in role_types:
                    return redirect('dashboard:accounting_dashboard')
                elif 'student' in role_types:
                    return redirect('etudiant:student_dashboard')
                else:
                    messages.error(request, "Votre rôle n'est pas reconnu.")
            else:
                messages.error(request, 'Mot de passe incorrect.')

        except Utilisateur.DoesNotExist:
            messages.error(request, 'Aucun compte trouvé avec cet email.')

    return render(request, 'accounts/login.html')

def logout_view(request):
    auth_logout(request)
    return redirect('accounts:login')