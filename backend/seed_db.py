import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sms_backend.settings')
django.setup()

from accounts.models import User
from management_app.models import Department, TeacherProfile, StudentProfile, Course, Enrollment, Attendance, Mark
from datetime import date, timedelta

def seed():
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@school.com',
            password='adminpassword',
            first_name='System',
            last_name='Administrator',
            role='ADMIN'
        )

    cs_dept, _ = Department.objects.get_or_create(code='CS', defaults={'name': 'Computer Science', 'description': 'Department of Computer Science & IT'})
    ee_dept, _ = Department.objects.get_or_create(code='EE', defaults={'name': 'Electrical Engineering', 'description': 'Department of Electrical Engineering'})
    ba_dept, _ = Department.objects.get_or_create(code='BA', defaults={'name': 'Business Administration', 'description': 'Department of Business Administration'})

    if not User.objects.filter(username='teacher1').exists():
        t1_user = User.objects.create_user(
            username='teacher1',
            email='john.smith@school.com',
            password='teacherpassword',
            first_name='John',
            last_name='Smith',
            role='TEACHER'
        )
        TeacherProfile.objects.get_or_create(
            user=t1_user,
            defaults={'employee_id': 'EMP-1001', 'department': cs_dept, 'qualification': 'Ph.D in Computer Science', 'joining_date': date(2020, 1, 15)}
        )

    if not User.objects.filter(username='teacher2').exists():
        t2_user = User.objects.create_user(
            username='teacher2',
            email='sarah.connor@school.com',
            password='teacherpassword',
            first_name='Sarah',
            last_name='Connor',
            role='TEACHER'
        )
        TeacherProfile.objects.get_or_create(
            user=t2_user,
            defaults={'employee_id': 'EMP-1002', 'department': ee_dept, 'qualification': 'M.Tech Electrical', 'joining_date': date(2021, 3, 10)}
        )

    t1_profile = TeacherProfile.objects.get(employee_id='EMP-1001')
    t2_profile = TeacherProfile.objects.get(employee_id='EMP-1002')

    c1, _ = Course.objects.get_or_create(code='CS101', defaults={'title': 'Introduction to Programming', 'credits': 4, 'department': cs_dept, 'teacher': t1_profile})
    c2, _ = Course.objects.get_or_create(code='CS202', defaults={'title': 'Database Management Systems', 'credits': 3, 'department': cs_dept, 'teacher': t1_profile})
    c3, _ = Course.objects.get_or_create(code='EE101', defaults={'title': 'Basic Circuit Theory', 'credits': 3, 'department': ee_dept, 'teacher': t2_profile})

    students_data = [
        ('student1', 'alice.johnson@school.com', 'Alice', 'Johnson', 'STU-2024-001', cs_dept, '1st Year'),
        ('student2', 'bob.williams@school.com', 'Bob', 'Williams', 'STU-2024-002', cs_dept, '2nd Year'),
        ('student3', 'charlie.brown@school.com', 'Charlie', 'Brown', 'STU-2024-003', ee_dept, '1st Year'),
        ('student4', 'diana.prince@school.com', 'Diana', 'Prince', 'STU-2024-004', ba_dept, '3rd Year'),
    ]

    for uname, email, fname, lname, roll, dept, year in students_data:
        if not User.objects.filter(username=uname).exists():
            u = User.objects.create_user(
                username=uname,
                email=email,
                password='studentpassword',
                first_name=fname,
                last_name=lname,
                role='STUDENT'
            )
            StudentProfile.objects.get_or_create(
                user=u,
                defaults={'roll_number': roll, 'department': dept, 'academic_year': year, 'date_of_birth': date(2002, 5, 12)}
            )

    s1 = StudentProfile.objects.get(roll_number='STU-2024-001')
    s2 = StudentProfile.objects.get(roll_number='STU-2024-002')
    s3 = StudentProfile.objects.get(roll_number='STU-2024-003')

    Enrollment.objects.get_or_create(student=s1, course=c1)
    Enrollment.objects.get_or_create(student=s1, course=c2)
    Enrollment.objects.get_or_create(student=s2, course=c1)
    Enrollment.objects.get_or_create(student=s3, course=c3)

    today = date.today()
    for i in range(5):
        d = today - timedelta(days=i)
        Attendance.objects.get_or_create(student=s1, course=c1, date=d, defaults={'status': 'PRESENT'})
        Attendance.objects.get_or_create(student=s1, course=c2, date=d, defaults={'status': 'PRESENT' if i % 2 == 0 else 'ABSENT'})
        Attendance.objects.get_or_create(student=s2, course=c1, date=d, defaults={'status': 'PRESENT'})
        Attendance.objects.get_or_create(student=s3, course=c3, date=d, defaults={'status': 'PRESENT' if i != 3 else 'LATE'})

    Mark.objects.get_or_create(student=s1, course=c1, exam_name='Midterm Exam', defaults={'marks_obtained': 92.5, 'total_marks': 100, 'remarks': 'Excellent'})
    Mark.objects.get_or_create(student=s1, course=c2, exam_name='Quiz 1', defaults={'marks_obtained': 85.0, 'total_marks': 100, 'remarks': 'Good job'})
    Mark.objects.get_or_create(student=s2, course=c1, exam_name='Midterm Exam', defaults={'marks_obtained': 78.0, 'total_marks': 100, 'remarks': 'Satisfactory'})
    Mark.objects.get_or_create(student=s3, course=c3, exam_name='Midterm Exam', defaults={'marks_obtained': 88.0, 'total_marks': 100, 'remarks': 'Great effort'})

if __name__ == '__main__':
    seed()
