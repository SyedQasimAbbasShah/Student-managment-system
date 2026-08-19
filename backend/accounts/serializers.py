from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'address')
        read_only_fields = ('id',)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['email'] = user.email
        token['full_name'] = user.get_full_name() or user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'full_name': self.user.get_full_name() or self.user.username,
        }
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    roll_number = serializers.CharField(required=False, write_only=True, allow_blank=True)
    employee_id = serializers.CharField(required=False, write_only=True, allow_blank=True)
    department_id = serializers.IntegerField(required=False, write_only=True, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'role', 'phone', 'address', 'roll_number', 'employee_id', 'department_id')

    def create(self, validated_data):
        roll_number = validated_data.pop('roll_number', None)
        employee_id = validated_data.pop('employee_id', None)
        department_id = validated_data.pop('department_id', None)
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        from management_app.models import StudentProfile, TeacherProfile, Department
        dept = Department.objects.filter(id=department_id).first() if department_id else None

        if user.role == 'STUDENT':
            r_num = roll_number or f"STU-{user.id:04d}"
            StudentProfile.objects.create(user=user, roll_number=r_num, department=dept)
        elif user.role == 'TEACHER':
            e_id = employee_id or f"TCH-{user.id:04d}"
            TeacherProfile.objects.create(user=user, employee_id=e_id, department=dept)

        return user
