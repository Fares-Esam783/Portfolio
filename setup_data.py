import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from portfolio.models import Skill, Education, Project

def populate():
    # Skills
    skills_data = [
        ('HTML', 'Frontend'),
        ('CSS', 'Frontend'),
        ('JavaScript', 'Frontend'),
        ('Bootstrap', 'Frontend'),
        ('React', 'Frontend'),
        ('Tailwind CSS', 'Frontend'),
        ('Next.js', 'Frontend'),
        ('PHP', 'Backend'),
        ('Laravel', 'Backend'),
        ('Python', 'Backend'),
        ('Django', 'Backend'),
        ('C++', 'Programming'),
    ]

    print("Populating Skills...")
    for name, category in skills_data:
        Skill.objects.get_or_create(name=name, category=category)

    # Education
    education_data = [
        ('Diploma Frontend React', 'Route Academy', '2023', 'Focus on React.js ecosystem.'),
        ('Diploma Backend PHP Laravel', 'Route Academy', '2023', 'Mastering PHP and Laravel framework.'),
        ('Diploma Programming Basics C++', 'Route Academy', '2022', 'Fundamentals of programming and algorithms.'),
        ('Diploma Web Development Django', 'Creativa Port Said', '2024', 'Building scalable web apps with Django.'),
        ('Diploma Freelancer', 'Creativa Port Said', '2024', 'Skills for freelancing and project management.'),
    ]

    print("Populating Education...")
    for title, institution, year, desc in education_data:
        Education.objects.get_or_create(
            title=title, 
            institution=institution,
            defaults={'year': year, 'description': desc}
        )

    # Sample Project
    print("Populating Sample Project...")
    Project.objects.get_or_create(
        title="Portfolio Website",
        defaults={
            'description': "A modern, responsive personal portfolio website built with Django and Tailwind CSS. Features dynamic content management, contact form, and project showcase.",
            'technologies': "Django, Python, Tailwind CSS, HTML5",
            'github_link': "https://github.com/faresessam/portfolio",
            'live_link': "#"
        }
    )
    
    print("Data population completed!")

if __name__ == '__main__':
    populate()
