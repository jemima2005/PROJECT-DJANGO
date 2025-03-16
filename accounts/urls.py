from django.urls import path
from . import views  # Assurez-vous que vous importez les vues depuis le bon fichier

urlpatterns = [
    path('', views.home_page, name='index'),  # Associe la vue 'home_page' à l'URL racine
]
