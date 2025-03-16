# evaluations/models.py
from django.db import models


class Evaluation(models.Model):
    id = models.AutoField(primary_key=True)
    type_evaluation = models.CharField(max_length=50)
    developpement = models.TextField()
    description = models.TextField()
    date_creation = models.DateField()
    bareme = models.FloatField()
    support = models.FileField(upload_to='evaluations/')
    enseignant_id = models.ForeignKey('accounts.Enseignant', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = "Évaluation"
        verbose_name_plural = "Évaluations"





class EtudiantEvaluation(models.Model):
    etudiant = models.ForeignKey('accounts.Etudiant', on_delete=models.CASCADE)
    evaluation = models.ForeignKey('Evaluation', on_delete=models.CASCADE)
    note = models.FloatField()
    
    class Meta:
        verbose_name = "Étudiant évaluation"
        verbose_name_plural = "Étudiants évaluations"
