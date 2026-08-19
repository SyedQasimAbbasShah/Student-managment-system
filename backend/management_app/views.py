from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db.models import Avg, Count, Q
from .models import Department, TeacherProfile, StudentProfile, Course, Enrollment, Attendance, Mark
from .serializers import (
    DepartmentSerializer, TeacherProfileSerializer, StudentProfileSerializer,
    CourseSerializer, EnrollmentSerializer, AttendanceSerializer, MarkSerializer
)

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'STUDENT' and hasattr(user, 'student_profile'):
            return StudentProfile.objects.filter(id=user.student_profile.id)
        return StudentProfile.objects.all()

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'TEACHER' and hasattr(user, 'teacher_profile'):
            return Course.objects.filter(teacher=user.teacher_profile)
        elif user.role == 'STUDENT' and hasattr(user, 'student_profile'):
            course_ids = Enrollment.objects.filter(student=user.student_profile).values_list('course_id', flat=True)
            return Course.objects.filter(id__in=course_ids)
        return Course.objects.all()

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'STUDENT' and hasattr(user, 'student_profile'):
            return Enrollment.objects.filter(student=user.student_profile)
        elif user.role == 'TEACHER' and hasattr(user, 'teacher_profile'):
            return Enrollment.objects.filter(course__teacher=user.teacher_profile)
        return Enrollment.objects.all()

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'STUDENT' and hasattr(user, 'student_profile'):
            return Attendance.objects.filter(student=user.student_profile)
        elif user.role == 'TEACHER' and hasattr(user, 'teacher_profile'):
            return Attendance.objects.filter(course__teacher=user.teacher_profile)
        return Attendance.objects.all()

    @action(detail=False, methods=['post'], url_path='bulk-mark')
    def bulk_mark(self, request):
        records = request.data.get('records', [])
        course_id = request.data.get('course_id')
        date = request.data.get('date')
        
        if not course_id or not date or not isinstance(records, list):
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)

        updated_count = 0
        for item in records:
            student_id = item.get('student_id')
            att_status = item.get('status', 'PRESENT')
            if student_id:
                Attendance.objects.update_or_create(
                    student_id=student_id,
                    course_id=course_id,
                    date=date,
                    defaults={'status': att_status}
                )
                updated_count += 1

        return Response({'message': f'Successfully updated attendance for {updated_count} students.'})

class MarkViewSet(viewsets.ModelViewSet):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'STUDENT' and hasattr(user, 'student_profile'):
            return Mark.objects.filter(student=user.student_profile)
        elif user.role == 'TEACHER' and hasattr(user, 'teacher_profile'):
            return Mark.objects.filter(course__teacher=user.teacher_profile)
        return Mark.objects.all()

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if user.role == 'STUDENT' and hasattr(user, 'student_profile'):
            sp = user.student_profile
            enrolled_courses = Enrollment.objects.filter(student=sp).count()
            attendance_records = Attendance.objects.filter(student=sp)
            total_att = attendance_records.count()
            present_att = attendance_records.filter(status='PRESENT').count()
            att_pct = round((present_att / total_att * 100), 1) if total_att > 0 else 100.0
            recent_marks = MarkSerializer(Mark.objects.filter(student=sp).order_by('-id')[:5], many=True).data

            return Response({
                'role': 'STUDENT',
                'enrolled_courses': enrolled_courses,
                'attendance_percentage': att_pct,
                'total_attendance_sessions': total_att,
                'recent_marks': recent_marks
            })

        elif user.role == 'TEACHER' and hasattr(user, 'teacher_profile'):
            tp = user.teacher_profile
            assigned_courses = Course.objects.filter(teacher=tp)
            course_count = assigned_courses.count()
            enrolled_count = Enrollment.objects.filter(course__in=assigned_courses).values('student').distinct().count()
            marks_entered = Mark.objects.filter(course__in=assigned_courses).count()

            return Response({
                'role': 'TEACHER',
                'assigned_courses_count': course_count,
                'total_students_taught': enrolled_count,
                'marks_entered_count': marks_entered
            })

        total_students = StudentProfile.objects.count()
        total_teachers = TeacherProfile.objects.count()
        total_courses = Course.objects.count()
        total_departments = Department.objects.count()

        total_att = Attendance.objects.count()
        present_att = Attendance.objects.filter(status='PRESENT').count()
        avg_att = round((present_att / total_att * 100), 1) if total_att > 0 else 100.0

        recent_students = StudentProfileSerializer(StudentProfile.objects.select_related('user', 'department').order_by('-id')[:5], many=True).data

        return Response({
            'role': 'ADMIN',
            'total_students': total_students,
            'total_teachers': total_teachers,
            'total_courses': total_courses,
            'total_departments': total_departments,
            'average_attendance': avg_att,
            'recent_students': recent_students
        })
