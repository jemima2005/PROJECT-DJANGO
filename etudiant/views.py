# student/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required


def student_dashboard(request):
    if 'utilisateur_id' not in request.session:
        # Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
        return redirect('accounts:login')  # Remplacez 'login' par le nom de votre URL de connexion
    context = {}
    return render(request, 'student/index.html', context)


def student_courses(request):
    if 'utilisateur_id' not in request.session:
        # Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
        return redirect('accounts:login')  # Remplacez 'login' par le nom de votre URL de connexion
    context = {}
    return render(request, 'student/courses.html', context)


def student_course_detail(request, course_id):
    if 'utilisateur_id' not in request.session:
        # Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
        return redirect('accounts:login')  # Remplacez 'login' par le nom de votre URL de connexion
    context = {'course_id': course_id}
    return render(request, 'student/course_detail.html', context)


def student_forum(request):
    if 'utilisateur_id' not in request.session:
        # Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
        return redirect('accounts:login')  # Remplacez 'login' par le nom de votre URL de connexion
    context = {}
    return render(request, 'student/forum.html', context)


def student_evaluations(request):
    if 'utilisateur_id' not in request.session:
        # Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
        return redirect('accounts:login')  # Remplacez 'login' par le nom de votre URL de connexion
    context = {}
    return render(request, 'student/evaluations.html', context)