# student/urls.py
from django.urls import path
from . import views

app_name = 'etudiant'

urlpatterns = [
    path('', views.student_dashboard, name='student_dashboard'),
    path('courses/', views.student_courses, name='student_courses'),
    path('course/<int:course_id>/', views.student_course_detail, name='student_course_detail'),
    path('forum/', views.student_forum, name='student_forum'),
    path('evaluations/', views.student_evaluations, name='student_evaluations'),
]