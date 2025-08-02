from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Custom user manager (email ile login)
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# Custom User model
class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=[('student', 'Student'), ('recruiter', 'Recruiter')])
    name = models.CharField(max_length=150)
    is_verified = models.BooleanField(default=False)  # ✅ OTP ile doğrulandı mı (Recruiter için)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'role']

    objects = CustomUserManager()

    def __str__(self):
        return self.email


# Student profile
class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)
    university = models.CharField(max_length=255, blank=True)
    major = models.CharField(max_length=255, blank=True)
    graduation_year = models.CharField(max_length=10, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    github_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    internship_type_preference = models.CharField(max_length=255, blank=True)
    preferred_internship_location = models.CharField(max_length=255, blank=True)
    preferred_locations = models.JSONField(blank=True, default=list)
    open_to_relocate = models.BooleanField(default=False)
    multiple_website_urls = models.JSONField(blank=True, default=list)
    skills = models.JSONField(blank=True, default=list)
    profile_views = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.name}'s profile"


# Student project
class StudentProject(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    technologies = models.JSONField(blank=True, default=list)
    video_url = models.URLField(blank=True)

    def __str__(self):
        return self.title


# Student certification
class StudentCertification(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    certification_name = models.CharField(max_length=255)
    issuing_organization = models.CharField(max_length=255, blank=True)
    issue_date = models.CharField(max_length=20, blank=True)
    expiry_date = models.CharField(max_length=20, blank=True)
    credential_id = models.CharField(max_length=255, blank=True)
    credential_url = models.URLField(blank=True)
    certificate_file_url = models.URLField(blank=True)
    certificate_filename = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.certification_name
