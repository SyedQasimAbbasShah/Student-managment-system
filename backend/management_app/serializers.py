from rest_framework import serializers
from .models import Department, TeacherProfile, StudentProfile, Course, Enrollment, Attendance, Mark
from accounts.serializers import UserSerializer

class DepartmentSerializer(serializers.ModelSerializer):
    student_count = serializers.SerializerMethodField()
    teacher_count = serializers.SerializerMethodField()
    course_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ('id', 'name', 'code', 'description', 'student_count', 'teacher_count', 'course_count')

    def get_student_count(self, obj):
        return obj.students.count()

    def get_teacher_count(self, obj):
        return obj.teachers.count()

    def get_course_count(self, obj):
        return obj.courses.count()

class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    department_name = serializers.CharField(source='department.name', read_only=True)
    courses_count = serializers.SerializerMethodField()

    class Meta:
        model = TeacherProfile
        fields = ('id', 'user', 'user_id', 'employee_id', 'department', 'department_name', 'qualification', 'joining_date', 'courses_count')

    def get_courses_count(self, obj):
        return obj.courses.count()

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    department_name = serializers.CharField(source='department.name', read_only=True)
    attendance_percentage = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ('id', 'user', 'user_id', 'roll_number', 'department', 'department_name', 'date_of_birth', 'admission_date', 'academic_year', 'attendance_percentage')

    def get_attendance_percentage(self, obj):
        total = obj.attendance_records.count()
        if total == 0:
            return 100.0
        present = obj.attendance_records.filter(status='PRESENT').count()
        return round((present / total) * 100, 1)

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    teacher_name = serializers.SerializerMethodField()
    enrolled_students_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'code', 'title', 'credits', 'department', 'department_name', 'teacher', 'teacher_name', 'enrolled_students_count')

    def get_teacher_name(self, obj):
        if obj.teacher:
            return obj.teacher.user.get_full_name() or obj.teacher.user.username
        return "Unassigned"

    def get_enrolled_students_count(self, obj):
        return obj.enrollments.count()

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Enrollment
        fields = ('id', 'student', 'student_name', 'student_roll', 'course', 'course_code', 'course_title', 'enrolled_at')

    def get_student_name(self, obj):
        return obj.student.user.get_full_name() or obj.student.user.username

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)

    class Meta:
        model = Attendance
        fields = ('id', 'student', 'student_name', 'student_roll', 'course', 'course_code', 'date', 'status')

    def get_student_name(self, obj):
        return obj.student.user.get_full_name() or obj.student.user.username

class MarkSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Mark
        fields = ('id', 'student', 'student_name', 'student_roll', 'course', 'course_code', 'course_title', 'exam_name', 'marks_obtained', 'total_marks', 'grade', 'remarks')
        read_only_fields = ('grade',)

    def get_student_name(self, obj):
        return obj.student.user.get_full_name() or obj.student.user.username
