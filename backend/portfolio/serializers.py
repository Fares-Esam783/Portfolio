from rest_framework import serializers
from .models import (
    PersonalInfo, SocialLink, SkillCategory, Skill,
    Project, Education, Certification, CV, ContactMessage
)


class SocialLinkSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = SocialLink
        fields = ['id', 'platform', 'platform_display', 'url', 'icon', 'order']


class PersonalInfoSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PersonalInfo
        fields = [
            'id', 'name', 'title', 'email', 'phone', 'location',
            'bio', 'about_text', 'resume_headline',
            'profile_photo', 'profile_photo_url', 'favicon', 'favicon_url'
        ]
    
    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None
    
    def get_favicon_url(self, obj):
        if obj.favicon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.favicon.url)
            return obj.favicon.url
        return None


class SkillSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'category_name', 'proficiency', 'icon', 'color', 'is_featured']


class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = SkillCategory
        fields = ['id', 'name', 'icon', 'order', 'skills']


class ProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    tech_list = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'description',
            'image', 'image_url', 'technologies', 'tech_list',
            'live_url', 'github_url', 'is_featured', 'created_at'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class EducationSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field_of_study',
            'start_date', 'end_date', 'is_current', 'description',
            'logo', 'logo_url'
        ]
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None


class CertificationSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Certification
        fields = [
            'id', 'name', 'issuer', 'issue_date', 'expiry_date',
            'credential_id', 'credential_url', 'image', 'image_url'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CVSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CV
        fields = ['id', 'title', 'file', 'file_url', 'uploaded_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class ContactMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message']
        extra_kwargs = {
            'name': {'required': True},
            'email': {'required': True},
            'subject': {'required': True},
            'message': {'required': True},
        }
