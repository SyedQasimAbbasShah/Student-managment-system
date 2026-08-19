# 🎓 Student Management System

A full-stack **Student Management System** built to simplify academic administration — managing departments, teachers, students, courses, enrollments, and attendance, all in one place.

The project is split into a **Django REST Framework** backend and a **React (Vite)** frontend, connected via a secure JWT-based API.

---

## ✨ Features

- 🔐 **Authentication & Authorization** — Secure login system using JWT (JSON Web Tokens)
- 🏫 **Department Management** — Create and organize academic departments
- 👨‍🏫 **Teacher Profiles** — Manage teacher records, qualifications, and department assignments
- 🎓 **Student Profiles** — Track roll numbers, academic year, and admission details
- 📚 **Course Management** — Assign courses to departments and teachers
- 📝 **Enrollment System** — Enroll students into courses with unique enrollment tracking
- 📅 **Attendance Tracking** — Record and monitor student attendance (Present / Absent / Late)
- 🌐 **RESTful API** — Clean, well-structured endpoints powering the frontend

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django & Django REST Framework
- **Authentication:** Simple JWT (`rest_framework_simplejwt`)
- **CORS Handling:** django-cors-headers
- **Database:** SQLite (default, easily swappable for PostgreSQL/MySQL)

### Frontend
- **Library:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **UI:** Bootstrap 5 + Lucide Icons

---

## 📁 Project Structure

```
Student-managment-system/
├── backend/
│   ├── sms_backend/          # Django project settings
│   ├── accounts/             # User authentication app
│   ├── management_app/       # Core app (departments, students, teachers, courses, attendance)
│   ├── manage.py
│   └── db.sqlite3
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/             # Page-level views
    │   ├── context/           # React context providers
    │   ├── services/          # API service layer (Axios)
    │   └── App.jsx
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/SyedQasimAbbasShah/Student-managment-system.git
cd Student-managment-system
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # On Windows
# source venv/bin/activate   # On macOS/Linux

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend will run at `http://127.0.0.1:8000/`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173/`

---

## 📌 API Overview

| Module | Description |
|---|---|
| `accounts/` | User registration, login, and JWT token management |
| `management_app/` | Departments, teachers, students, courses, enrollments, and attendance |

> Detailed endpoint documentation can be added here as the API evolves.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository, open an issue, or submit a pull request to improve the project.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project currently has no license specified. Feel free to reach out to the repository owner regarding usage terms.

---

## 👤 Author

**Syed Qasim Abbas Shah**
[GitHub Profile](https://github.com/SyedQasimAbbasShah)

---

⭐ If you found this project useful, consider giving it a star on GitHub!
