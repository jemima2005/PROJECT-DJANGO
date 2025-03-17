from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page_enseigant, name='home_page_enseignant'),
    path('cours/', views.cours_enseignant, name='cours_enseignant'),
    path('cours_detail/', views.cours_detail, name='cours_enseignant_detail'),
    path('evaluation/', views.evaluation, name='evaluation_enseignant'),
]