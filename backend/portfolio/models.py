from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class PersonalInfo(models.Model):
    """Singleton model for personal information"""
    name = models.CharField(max_length=100, default="Fares Essam")
    title = models.CharField(max_length=200, default="Full Stack React & PHP, Django Developer")
    email = models.EmailField(default="faresesam7589@gmail.com")
    phone = models.CharField(max_length=50, default="+20 121 080 6085")
    location = models.CharField(max_length=100, default="Egypt")
    bio = models.TextField(blank=True, default="")
    about_text = models.TextField(blank=True, default="")
    profile_photo = models.ImageField(upload_to='profile/', blank=True, null=True)
    favicon = models.ImageField(upload_to='favicon/', blank=True, null=True)
    resume_headline = models.CharField(max_length=300, blank=True, default="")
    
    class Meta:
        verbose_name = "Personal Information"
        verbose_name_plural = "Personal Information"
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and PersonalInfo.objects.exists():
            raise ValueError("Only one PersonalInfo instance allowed")
        super().save(*args, **kwargs)


class SocialLink(models.Model):
    """Social media links"""
    PLATFORM_CHOICES = [
        ('github', 'GitHub'),
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter/X'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('youtube', 'YouTube'),
        ('dribbble', 'Dribbble'),
        ('behance', 'Behance'),
        ('medium', 'Medium'),
        ('dev', 'Dev.to'),
        ('other', 'Other'),
    ]
    
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    url = models.URLField()
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class name (e.g., 'fab fa-github')")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Social Link"
        verbose_name_plural = "Social Links"
    
    def __str__(self):
        return f"{self.get_platform_display()} - {self.url}"


class SkillCategory(models.Model):
    """Categories for skills (e.g., Frontend, Backend, Tools)"""
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    icon = models.CharField(max_length=50, blank=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Skill Category"
        verbose_name_plural = "Skill Categories"
    
    def __str__(self):
        return self.name


class Skill(models.Model):
    """Individual skills with proficiency level"""
    name = models.CharField(max_length=100)
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    proficiency = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=75,
        help_text="Proficiency level from 0 to 100"
    )
    icon = models.CharField(max_length=100, blank=True, help_text="Icon class or URL")
    color = models.CharField(max_length=20, blank=True, default="#6366f1", help_text="Hex color for skill")
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['category', 'order']
    
    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Project(models.Model):
    """Portfolio projects"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    technologies = models.CharField(max_length=500, help_text="Comma-separated list of technologies")
    live_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_featured', 'order', '-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def tech_list(self):
        return [tech.strip() for tech in self.technologies.split(',')]


class Education(models.Model):
    """Education history"""
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='education/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', '-start_date']
        verbose_name_plural = "Education"
    
    def __str__(self):
        return f"{self.degree} at {self.institution}"


class Certification(models.Model):
    """Professional certifications"""
    name = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    credential_id = models.CharField(max_length=200, blank=True)
    credential_url = models.URLField(blank=True)
    image = models.ImageField(upload_to='certifications/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', '-issue_date']
    
    def __str__(self):
        return f"{self.name} - {self.issuer}"


class CV(models.Model):
    """CV/Resume file management"""
    title = models.CharField(max_length=200, default="Resume")
    file = models.FileField(upload_to='cv/')
    is_active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "CV/Resume"
        verbose_name_plural = "CVs/Resumes"
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.title} ({'Active' if self.is_active else 'Inactive'})"
    
    def save(self, *args, **kwargs):
        if self.is_active:
            # Deactivate all other CVs
            CV.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)


class ContactMessage(models.Model):
    """Contact form submissions"""
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
