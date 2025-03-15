# forum/models.py
from django.db import models
from accounts.models import Etudiant


class Forum(models.Model):
    id = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=200)
    description = models.TextField()
    
    class Meta:
        verbose_name = "Forum"
        verbose_name_plural = "Forums"


class Message(models.Model):
    id = models.AutoField(primary_key=True)
    contenu = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    forum = models.ForeignKey('Forum', on_delete=models.CASCADE)
    auteur = models.ForeignKey('accounts.Etudiant', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
