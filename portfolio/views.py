from django.shortcuts import render, redirect
from django.contrib import messages
from django.conf import settings
from pathlib import Path
from .models import Project, Skill, Education, CV
from django.http import FileResponse, Http404
from .forms import ContactForm

def home(request):
    candidates = ['profile/profile.png', 'profile/profile.jpg', 'profile/profile.jpeg']
    profile_url = None
    for rel in candidates:
        if (Path(settings.MEDIA_ROOT) / rel).exists():
            profile_url = settings.MEDIA_URL + rel
            break
    skills = Skill.objects.all()
    frontend_skills = list(skills.filter(category='Frontend')[:6])
    backend_skills = list(skills.filter(category='Backend')[:6])
    programming_skills = list(skills.filter(category='Programming')[:6])
    projects_preview = list(Project.objects.all().order_by('-created_at')[:4])
    education_preview = list(Education.objects.all()[:3])
    context = {
        'profile_url': profile_url,
        'frontend_skills': frontend_skills,
        'backend_skills': backend_skills,
        'programming_skills': programming_skills,
        'projects_preview': projects_preview,
        'education_preview': education_preview,
    }
    return render(request, 'portfolio/home.html', context)

def about(request):
    skills = Skill.objects.all()
    # Group skills by category
    frontend_skills = skills.filter(category='Frontend')
    backend_skills = skills.filter(category='Backend')
    programming_skills = skills.filter(category='Programming')
    
    education = Education.objects.all()
    
    context = {
        'frontend_skills': frontend_skills,
        'backend_skills': backend_skills,
        'programming_skills': programming_skills,
        'education': education,
    }
    return render(request, 'portfolio/about.html', context)

def projects(request):
    projects = Project.objects.all().order_by('-created_at')
    return render(request, 'portfolio/projects.html', {'projects': projects})

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your message has been sent successfully!')
            return redirect('contact')
    else:
        form = ContactForm()
    return render(request, 'portfolio/contact.html', {'form': form})

def cv_download(request):
    cv = CV.objects.filter(is_active=True).order_by('-uploaded_at').first()
    if not cv:
        raise Http404("CV not available")
    return FileResponse(cv.file.open('rb'), as_attachment=True, filename='Fares_Essam_CV.pdf')
