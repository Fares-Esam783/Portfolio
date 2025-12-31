# 🚀 Fares Essam - Portfolio Website

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=for-the-badge&logo=framer)

**A modern, ultra-premium portfolio website with stunning animations and a powerful CMS backend.**

[Live Demo](#) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation)

</div>

---

## ✨ Features

### 🎨 **Frontend (Next.js)**

- **Ultra-Premium Design** - Glassmorphism, gradient effects, and dark/light theme toggle
- **Animated Background** - Interactive particle canvas with mouse glow effects
- **TypeWriter Effect** - Dynamic text cycling in the hero section
- **Custom Cursor** - Premium cursor with trailing effect (desktop)
- **Smooth Animations** - Page transitions and scroll animations with Framer Motion
- **Responsive Design** - Fully responsive across all devices
- **Education & Certifications Sliders** - Interactive carousels with navigation
- **Download CV** - One-click CV download from hero section
- **Scroll to Top** - Animated button for easy navigation
- **SEO Optimized** - Meta tags and semantic HTML

### ⚙️ **Backend (Django)**

- **REST API** - Full API for all portfolio data
- **Admin CMS** - Easy content management through Django Admin
- **Models Include:**
  - Personal Information (name, bio, photo, favicon)
  - Social Links (GitHub, LinkedIn, Twitter, etc.)
  - Skills with Categories
  - Projects with Technologies
  - Education History
  - Certifications
  - CV/Resume Upload
  - Contact Form Messages

---

## 🛠 Tech Stack

### Frontend

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **Next.js 15**     | React Framework with App Router |
| **TypeScript**     | Type Safety                     |
| **Tailwind CSS 4** | Utility-first styling           |
| **Framer Motion**  | Animations & transitions        |
| **Axios**          | API communication               |

### Backend

| Technology                | Purpose                |
| ------------------------- | ---------------------- |
| **Django 5.0**            | Python web framework   |
| **Django REST Framework** | API development        |
| **SQLite**                | Database (development) |
| **Pillow**                | Image processing       |
| **django-cors-headers**   | CORS handling          |

---

## 📁 Project Structure

```
PortFolio/
├── backend/                    # Django Backend
│   ├── backend/               # Django settings
│   ├── portfolio/             # Main app with models & views
│   ├── media/                 # Uploaded files
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # Reusable components
│   │   │   ├── animations/   # Animation components
│   │   │   └── ui/           # UI components
│   │   ├── context/          # React context (Theme)
│   │   ├── lib/              # API client & utilities
│   │   └── types/            # TypeScript types
│   ├── public/
│   ├── package.json
│   └── tailwind.config.ts
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 📝 Usage

### Adding Content

1. Start the backend server: `python manage.py runserver`
2. Navigate to `http://localhost:8000/admin/`
3. Login with your superuser credentials
4. Add your:
   - Personal Information
   - Social Links
   - Skills & Categories
   - Projects
   - Education
   - Certifications
   - Upload your CV

### Viewing the Portfolio

1. Start both servers (backend & frontend)
2. Navigate to `http://localhost:3000`
3. Enjoy your beautiful portfolio! 🎉

---

## 🎨 Customization

### Theme Colors

Edit `frontend/src/app/globals.css` to customize theme colors:

```css
:root {
  --accent-primary: #8b5cf6; /* Main accent */
  --accent-secondary: #6366f1; /* Secondary accent */
  --bg-primary: #050510; /* Background (dark) */
}

[data-theme="light"] {
  --accent-primary: #7c3aed;
  --bg-primary: #f8fafc;
}
```

### TypeWriter Text

Edit the texts array in `frontend/src/app/page.tsx`:

```tsx
<TypeWriter
  texts={[
    "Full Stack React & Django Developer",
    "Full Stack PHP & Laravel Developer",
    // Add your own titles...
  ]}
/>
```

---

## 📱 Screenshots

| Dark Mode                     | Light Mode                      |
| ----------------------------- | ------------------------------- |
| ![Dark](screenshots/dark.png) | ![Light](screenshots/light.png) |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Fares Essam**

- GitHub: [@Fares-Esam783](https://github.com/Fares-Esam783)
- Portfolio: [Your Portfolio URL](#)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and lots of ☕

</div>
