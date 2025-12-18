from django.db import models
from django.db.models import Q
from django.core.validators import FileExtensionValidator

class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('Frontend', 'Frontend'),
        ('Backend', 'Backend'),
        ('Programming', 'Programming Language'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    
    def __str__(self):
        return self.name

class Education(models.Model):
    title = models.CharField(max_length=200)  # e.g., Diploma Frontend React
    institution = models.CharField(max_length=200) # e.g., Route Academy
    year = models.CharField(max_length=50, blank=True) # e.g., 2023
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.title} at {self.institution}"

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    technologies = models.CharField(max_length=200) # e.g., "Django, React"
    github_link = models.URLField(blank=True)
    live_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.name} - {self.subject}"

class CV(models.Model):
    file = models.FileField(upload_to='cv/', validators=[FileExtensionValidator(['pdf'])])
    is_active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['is_active'], condition=Q(is_active=True), name='unique_active_cv')
        ]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_active:
            CV.objects.exclude(pk=self.pk).update(is_active=False)

    def __str__(self):
        return f"CV ({'active' if self.is_active else 'inactive'}) - {self.uploaded_at:%Y-%m-%d}"
