from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, TeacherProfileViewSet, StudentProfileViewSet,
    CourseViewSet, EnrollmentViewSet, AttendanceViewSet, MarkViewSet,
    DashboardStatsView
)

router = DefaultRouter()
router.register('departments', DepartmentViewSet, basename='department')
router.register('teachers', TeacherProfileViewSet, basename='teacher')
router.register('students', StudentProfileViewSet, basename='student')
router.register('courses', CourseViewSet, basename='course')
router.register('enrollments', EnrollmentViewSet, basename='enrollment')
router.register('attendance', AttendanceViewSet, basename='attendance')
router.register('marks', MarkViewSet, basename='mark')

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]
