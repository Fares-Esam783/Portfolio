from django.contrib import admin
from .models import Skill, Education, Project, ContactMessage, CV

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('title', 'institution', 'year')
    search_fields = ('title', 'institution', 'year')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'technologies', 'created_at')
    search_fields = ('title', 'technologies')
    list_filter = ('created_at',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    search_fields = ('name', 'email', 'subject')
    list_filter = ('created_at',)

@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = ('uploaded_at', 'is_active')
    list_filter = ('is_active', 'uploaded_at')
    readonly_fields = ('uploaded_at',)
