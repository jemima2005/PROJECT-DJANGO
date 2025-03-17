from django.shortcuts import render

# Create your views here.
def home_page_enseigant(request):
    return render( request, 'teacher/index.html')

def cours_enseignant(request):
    return render (request,'teacher/courses.html')

def cours_detail (request):
    return render (request,'teacher/course-detail.html')

def evaluation (request):
    return render (request,'teacher/evaluations.html')