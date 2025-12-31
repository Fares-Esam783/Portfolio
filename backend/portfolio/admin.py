from django.contrib import admin
from django.utils.html import format_html
from .models import (
    PersonalInfo, SocialLink, SkillCategory, Skill,
    Project, Education, Certification, CV, ContactMessage
)


@admin.register(PersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'email', 'phone', 'location']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'title', 'email', 'phone', 'location')
        }),
        ('About', {
            'fields': ('bio', 'about_text', 'resume_headline')
        }),
        ('Media', {
            'fields': ('profile_photo', 'favicon')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow adding if no instance exists
        return not PersonalInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ['platform', 'url', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['platform', 'is_active']
    ordering = ['order']


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1
    fields = ['name', 'proficiency', 'icon', 'color', 'order', 'is_featured']


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'skill_count']
    list_editable = ['order']
    inlines = [SkillInline]
    
    def skill_count(self, obj):
        return obj.skills.count()
    skill_count.short_description = 'Skills'


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'is_featured', 'order']
    list_editable = ['proficiency', 'is_featured', 'order']
    list_filter = ['category', 'is_featured']
    search_fields = ['name']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'thumbnail', 'is_featured', 'is_active', 'order']
    list_editable = ['is_featured', 'is_active', 'order']
    list_filter = ['is_featured', 'is_active']
    search_fields = ['title', 'description', 'technologies']
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'short_description', 'description')
        }),
        ('Media & Links', {
            'fields': ('image', 'technologies', 'live_url', 'github_url')
        }),
        ('Display Options', {
            'fields': ('is_featured', 'is_active', 'order')
        }),
    )
    
    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 8px;" />', obj.image.url)
        return "-"
    thumbnail.short_description = 'Image'


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'is_current']
    list_filter = ['is_current']
    ordering = ['order', '-start_date']


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['name', 'issuer', 'issue_date', 'order']
    list_editable = ['order']
    ordering = ['order', '-issue_date']


@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'uploaded_at', 'download_link']
    list_filter = ['is_active']
    
    def download_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">Download</a>', obj.file.url)
        return "-"
    download_link.short_description = 'File'


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']
    
    def has_add_permission(self, request):
        return False
