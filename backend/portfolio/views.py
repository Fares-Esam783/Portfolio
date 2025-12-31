from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import FileResponse, Http404
from .models import (
    PersonalInfo, SocialLink, SkillCategory, Skill,
    Project, Education, Certification, CV, ContactMessage
)
from .serializers import (
    PersonalInfoSerializer, SocialLinkSerializer, SkillCategorySerializer,
    SkillSerializer, ProjectSerializer, EducationSerializer,
    CertificationSerializer, CVSerializer, ContactMessageSerializer
)


class PersonalInfoView(APIView):
    """Get personal information (singleton)"""
    
    def get(self, request):
        try:
            info = PersonalInfo.objects.first()
            if info:
                serializer = PersonalInfoSerializer(info, context={'request': request})
                return Response(serializer.data)
            return Response({'detail': 'Personal information not configured'}, status=404)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)


class SocialLinkListView(generics.ListAPIView):
    """List all active social links"""
    serializer_class = SocialLinkSerializer
    
    def get_queryset(self):
        return SocialLink.objects.filter(is_active=True)


class SkillCategoryListView(generics.ListAPIView):
    """List all skill categories with their skills"""
    serializer_class = SkillCategorySerializer
    queryset = SkillCategory.objects.prefetch_related('skills')


class SkillListView(generics.ListAPIView):
    """List all skills"""
    serializer_class = SkillSerializer
    queryset = Skill.objects.select_related('category')


class FeaturedSkillsView(generics.ListAPIView):
    """List featured skills only"""
    serializer_class = SkillSerializer
    
    def get_queryset(self):
        return Skill.objects.filter(is_featured=True).select_related('category')


class ProjectListView(generics.ListAPIView):
    """List all active projects"""
    serializer_class = ProjectSerializer
    
    def get_queryset(self):
        queryset = Project.objects.filter(is_active=True)
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        return queryset


class ProjectDetailView(generics.RetrieveAPIView):
    """Get single project by slug"""
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Project.objects.filter(is_active=True)


class EducationListView(generics.ListAPIView):
    """List all education entries"""
    serializer_class = EducationSerializer
    queryset = Education.objects.all()


class CertificationListView(generics.ListAPIView):
    """List all certifications"""
    serializer_class = CertificationSerializer
    queryset = Certification.objects.all()


class CVDownloadView(APIView):
    """Get active CV/Resume"""
    
    def get(self, request):
        cv = CV.objects.filter(is_active=True).first()
        if cv and cv.file:
            serializer = CVSerializer(cv, context={'request': request})
            return Response(serializer.data)
        return Response({'detail': 'No active CV found'}, status=404)


class CVFileDownloadView(APIView):
    """Download active CV file directly"""
    
    def get(self, request):
        cv = CV.objects.filter(is_active=True).first()
        if cv and cv.file:
            return FileResponse(cv.file.open('rb'), as_attachment=True, filename='CV_Fares_Essam.pdf')
        raise Http404("No active CV found")


class ContactMessageCreateView(generics.CreateAPIView):
    """Submit a contact message"""
    serializer_class = ContactMessageSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'message': 'Thank you for your message! I will get back to you soon.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def api_overview(request):
    """API overview and available endpoints"""
    return Response({
        'message': 'Welcome to Fares Essam Portfolio API',
        'endpoints': {
            'personal_info': '/api/personal-info/',
            'social_links': '/api/social-links/',
            'skills': '/api/skills/',
            'skill_categories': '/api/skill-categories/',
            'featured_skills': '/api/skills/featured/',
            'projects': '/api/projects/',
            'project_detail': '/api/projects/<slug>/',
            'education': '/api/education/',
            'certifications': '/api/certifications/',
            'cv': '/api/cv/',
            'cv_download': '/api/cv/download/',
            'contact': '/api/contact/ (POST)',
        }
    })
