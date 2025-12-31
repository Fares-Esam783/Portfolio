from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_overview, name='api-overview'),
    path('personal-info/', views.PersonalInfoView.as_view(), name='personal-info'),
    path('social-links/', views.SocialLinkListView.as_view(), name='social-links'),
    path('skill-categories/', views.SkillCategoryListView.as_view(), name='skill-categories'),
    path('skills/', views.SkillListView.as_view(), name='skills'),
    path('skills/featured/', views.FeaturedSkillsView.as_view(), name='featured-skills'),
    path('projects/', views.ProjectListView.as_view(), name='projects'),
    path('projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('education/', views.EducationListView.as_view(), name='education'),
    path('certifications/', views.CertificationListView.as_view(), name='certifications'),
    path('cv/', views.CVDownloadView.as_view(), name='cv'),
    path('cv/download/', views.CVFileDownloadView.as_view(), name='cv-download'),
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact'),
]
