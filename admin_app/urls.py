# dashboard/urls.py
from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    # Admin URLs
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/users/', views.admin_users, name='admin_users'),
    
    # Teacher URLs
    path('teacher/', views.teacher_dashboard, name='teacher_dashboard'),
    path('teacher/courses/', views.teacher_courses, name='teacher_courses'),
    path('teacher/evaluations/', views.teacher_evaluations, name='teacher_evaluations'),
    path('teacher/course-detail/<int:course_id>/', views.teacher_course_detail, name='teacher_course_detail'),
    
    # Academic URLs
    path('academic/', views.academic_dashboard, name='academic_dashboard'),
    path('academic/students/', views.academic_students, name='academic_students'),
    path('academic/classes/', views.academic_classes, name='academic_classes'),
    
    # Accounting URLs
    path('accounting/', views.accounting_dashboard, name='accounting_dashboard'),
    path('accounting/reports/', views.accounting_reports, name='accounting_reports'),
]