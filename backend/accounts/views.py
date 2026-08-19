from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, RegisterSerializer

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        data = serializer.data
        if user.role == 'STUDENT' and hasattr(user, 'student_profile'):
            data['profile_id'] = user.student_profile.id
            data['roll_number'] = user.student_profile.roll_number
            data['department'] = user.student_profile.department.name if user.student_profile.department else None
            data['academic_year'] = user.student_profile.academic_year
        elif user.role == 'TEACHER' and hasattr(user, 'teacher_profile'):
            data['profile_id'] = user.teacher_profile.id
            data['employee_id'] = user.teacher_profile.employee_id
            data['department'] = user.teacher_profile.department.name if user.teacher_profile.department else None
            data['qualification'] = user.teacher_profile.qualification
        return Response(data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['list', 'destroy', 'update', 'partial_update']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]
