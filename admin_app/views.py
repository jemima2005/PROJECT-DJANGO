# dashboard/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

# Admin views

def admin_dashboard(request):
    context = {}
    return render(request, 'dashboard/admin/index.html', context)


def admin_users(request):
    context = {}
    return render(request, 'dashboard/admin/users.html', context)

# Teacher views

def teacher_dashboard(request):
    context = {}
    return render(request, 'dashboard/teacher/index.html', context)


def teacher_courses(request):
    context = {}
    return render(request, 'dashboard/teacher/courses.html', context)


def teacher_evaluations(request):
    context = {}
    return render(request, 'dashboard/teacher/evaluations.html', context)


def teacher_course_detail(request, course_id):
    context = {'course_id': course_id}
    return render(request, 'dashboard/teacher/course_detail.html', context)

# Academic views

def academic_dashboard(request):
    context = {}
    return render(request, 'dashboard/academic/index.html', context)


def academic_students(request):
    context = {}
    return render(request, 'dashboard/academic/students.html', context)


def academic_classes(request):
    context = {}
    return render(request, 'dashboard/academic/classes.html', context)

# Accounting views

def accounting_dashboard(request):
    context = {}
    return render(request, 'dashboard/accounting/index.html', context)


def accounting_reports(request):
    context = {}
    return render(request, 'dashboard/accounting/reports.html', context)