"""
Management command to populate default portfolio data for Fares Essam
"""
from django.core.management.base import BaseCommand
from django.core.files import File
from portfolio.models import (
    PersonalInfo, SocialLink, SkillCategory, Skill,
    Project, Education, Certification
)
from pathlib import Path


class Command(BaseCommand):
    help = 'Populates the database with default portfolio data'

    def handle(self, *args, **options):
        self.stdout.write('Populating default data...')
        
        # Create Personal Info
        self.create_personal_info()
        
        # Create Social Links
        self.create_social_links()
        
        # Create Skills
        self.create_skills()
        
        # Create Sample Projects
        self.create_projects()
        
        # Create Education
        self.create_education()
        
        self.stdout.write(self.style.SUCCESS('Default data populated successfully!'))

    def create_personal_info(self):
        if not PersonalInfo.objects.exists():
            info = PersonalInfo.objects.create(
                name="Fares Essam",
                title="Full Stack React & PHP, Django Developer",
                email="faresesam7589@gmail.com",
                phone="+20 121 080 6085",
                location="Egypt",
                bio="Passionate full-stack developer with expertise in modern web technologies. I craft elegant, scalable solutions that push the boundaries of what's possible on the web.",
                about_text="""I'm a dedicated Full Stack Developer based in Egypt with a passion for creating exceptional digital experiences. With expertise in React, PHP, and Django, I bring ideas to life through clean, efficient code.

My journey in software development has equipped me with a deep understanding of both frontend and backend technologies. I thrive on tackling complex challenges and transforming them into elegant, user-friendly solutions.

When I'm not coding, I'm exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community. I believe in continuous learning and staying at the forefront of technological innovation.""",
                resume_headline="Building the future of the web, one line of code at a time."
            )
            
            # Try to attach profile photo
            profile_photo_path = Path('d:/TwoProjects/PortFolio/profile_photo.png')
            if profile_photo_path.exists():
                with open(profile_photo_path, 'rb') as f:
                    info.profile_photo.save('fares_essam.png', File(f), save=True)
            
            self.stdout.write(self.style.SUCCESS('✓ Personal Info created'))
        else:
            self.stdout.write('Personal Info already exists')

    def create_social_links(self):
        links = [
            {
                'platform': 'github',
                'url': 'https://github.com/Fares-Esam783',
                'icon': 'fab fa-github',
                'order': 1
            },
            {
                'platform': 'linkedin',
                'url': 'https://www.linkedin.com/in/fares-esam-a38172343/',
                'icon': 'fab fa-linkedin',
                'order': 2
            },
        ]
        
        for link_data in links:
            SocialLink.objects.get_or_create(
                platform=link_data['platform'],
                defaults=link_data
            )
        
        self.stdout.write(self.style.SUCCESS('✓ Social Links created'))

    def create_skills(self):
        categories = [
            {
                'name': 'Frontend',
                'icon': 'code',
                'order': 1,
                'skills': [
                    {'name': 'React', 'proficiency': 95, 'color': '#61DAFB', 'is_featured': True},
                    {'name': 'Next.js', 'proficiency': 90, 'color': '#000000', 'is_featured': True},
                    {'name': 'TypeScript', 'proficiency': 88, 'color': '#3178C6', 'is_featured': True},
                    {'name': 'JavaScript', 'proficiency': 95, 'color': '#F7DF1E', 'is_featured': True},
                    {'name': 'HTML/CSS', 'proficiency': 95, 'color': '#E34F26'},
                    {'name': 'Tailwind CSS', 'proficiency': 92, 'color': '#06B6D4', 'is_featured': True},
                    {'name': 'Redux', 'proficiency': 85, 'color': '#764ABC'},
                ]
            },
            {
                'name': 'Backend',
                'icon': 'server',
                'order': 2,
                'skills': [
                    {'name': 'Django', 'proficiency': 90, 'color': '#092E20', 'is_featured': True},
                    {'name': 'Python', 'proficiency': 90, 'color': '#3776AB', 'is_featured': True},
                    {'name': 'PHP', 'proficiency': 88, 'color': '#777BB4', 'is_featured': True},
                    {'name': 'Laravel', 'proficiency': 85, 'color': '#FF2D20'},
                    {'name': 'Node.js', 'proficiency': 80, 'color': '#339933'},
                    {'name': 'REST APIs', 'proficiency': 92, 'color': '#6366F1'},
                ]
            },
            {
                'name': 'Database',
                'icon': 'database',
                'order': 3,
                'skills': [
                    {'name': 'PostgreSQL', 'proficiency': 85, 'color': '#336791'},
                    {'name': 'MySQL', 'proficiency': 88, 'color': '#4479A1'},
                    {'name': 'MongoDB', 'proficiency': 75, 'color': '#47A248'},
                    {'name': 'Redis', 'proficiency': 70, 'color': '#DC382D'},
                ]
            },
            {
                'name': 'Tools & DevOps',
                'icon': 'tools',
                'order': 4,
                'skills': [
                    {'name': 'Git', 'proficiency': 92, 'color': '#F05032', 'is_featured': True},
                    {'name': 'Docker', 'proficiency': 80, 'color': '#2496ED'},
                    {'name': 'Linux', 'proficiency': 82, 'color': '#FCC624'},
                    {'name': 'VS Code', 'proficiency': 95, 'color': '#007ACC'},
                ]
            },
        ]
        
        for cat_data in categories:
            skills = cat_data.pop('skills')
            category, _ = SkillCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            
            for i, skill_data in enumerate(skills):
                skill_data['order'] = i + 1
                skill_data['category'] = category
                Skill.objects.get_or_create(
                    name=skill_data['name'],
                    category=category,
                    defaults=skill_data
                )
        
        self.stdout.write(self.style.SUCCESS('✓ Skills created'))

    def create_projects(self):
        projects = [
            {
                'title': 'E-Commerce Platform',
                'slug': 'ecommerce-platform',
                'short_description': 'A modern e-commerce solution built with React and Django',
                'description': """A full-featured e-commerce platform with modern UI/UX, secure payment integration, and comprehensive admin dashboard.

Features:
- User authentication and authorization
- Product catalog with advanced filtering
- Shopping cart and wishlist
- Secure checkout with Stripe integration
- Order tracking and history
- Admin dashboard for inventory management
- Responsive design for all devices""",
                'technologies': 'React, Next.js, Django, PostgreSQL, Stripe, Tailwind CSS',
                'is_featured': True,
                'order': 1
            },
            {
                'title': 'Task Management Dashboard',
                'slug': 'task-management-dashboard',
                'short_description': 'Elegant task management with drag-and-drop functionality',
                'description': """A productivity-focused task management application with intuitive drag-and-drop interface.

Features:
- Kanban-style task boards
- Drag and drop task organization
- Priority levels and due dates
- Team collaboration features
- Dark/light mode toggle
- Real-time updates
- Export and reporting""",
                'technologies': 'React, TypeScript, Redux Toolkit, Node.js, MongoDB',
                'is_featured': True,
                'order': 2
            },
            {
                'title': 'Social Media Application',
                'slug': 'social-media-app',
                'short_description': 'Feature-rich social platform with real-time interactions',
                'description': """A modern social media platform with real-time messaging and content sharing.

Features:
- User profiles and feeds
- Real-time messaging
- Post creation with media uploads
- Like, comment, and share functionality
- Follow/unfollow system
- Notification system
- Search and discovery""",
                'technologies': 'React, Next.js, Node.js, Socket.io, MongoDB, Redis',
                'is_featured': True,
                'order': 3
            },
        ]
        
        for project_data in projects:
            Project.objects.get_or_create(
                slug=project_data['slug'],
                defaults=project_data
            )
        
        self.stdout.write(self.style.SUCCESS('✓ Projects created'))

    def create_education(self):
        education_data = [
            {
                'institution': 'Cairo University',
                'degree': "Bachelor's Degree",
                'field_of_study': 'Computer Science',
                'start_date': '2020-09-01',
                'end_date': None,
                'is_current': True,
                'description': 'Studying Computer Science with focus on software engineering and web development.',
                'order': 1
            },
        ]
        
        for edu_data in education_data:
            Education.objects.get_or_create(
                institution=edu_data['institution'],
                degree=edu_data['degree'],
                defaults=edu_data
            )
        
        self.stdout.write(self.style.SUCCESS('✓ Education created'))
