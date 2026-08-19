from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('TEACHER', 'Teacher'),
        ('STUDENT', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def is_admin_role(self):
        return self.role == 'ADMIN' or self.is_superuser

    def is_teacher_role(self):
        return self.role == 'TEACHER'

    def is_student_role(self):
        return self.role == 'STUDENT'
