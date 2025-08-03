import os
import random
from django.conf import settings
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import AnonymousUser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import User, StudentProfile, StudentProject, StudentCertification
from recruiter.models import RecruiterProfile, Bookmark
from django.core.mail import send_mail
from django.conf import settings
import random
from .utils import send_otp_email
from django.http import JsonResponse
# --- Mevcut signup, login, profile, project, certification viewler ---
@csrf_exempt
@api_view(['POST'])
def signup(request):
    data = request.data
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role")

    if not all([email, password, name, role]):
        return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        email=email,
        password=password,
        name=name,
        role=role
    )

    # If the user is a recruiter, generate and send OTP
    if role == "recruiter":
        otp = f"{random.randint(100000, 999999)}"
        otp_storage[email] = otp
        send_otp_email(email, otp)  # This uses your utils.py function

    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
from django.contrib.auth import login as django_login

@csrf_exempt
@api_view(['POST'])
def login(request):
    data = request.data
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return JsonResponse(
            {"error": "Email, password, and role are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, email=email, password=password)

    if user is not None:
        if user.role != role:
            return JsonResponse(
                {"error": "Incorrect role"},
                status=status.HTTP_403_FORBIDDEN
            )

        django_login(request, user)

        return JsonResponse({
            "message": "Login successful",
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "user_id": user.id
        }, status=status.HTTP_200_OK)

    else:
        return JsonResponse(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )
@api_view(['GET'])
def get_student_profile(request, user_id):
    profile = get_object_or_404(StudentProfile, user_id=user_id)
    user = profile.user
    return Response({
        "id": profile.id,
        "name": user.name,
        "email": user.email,
        "phone": profile.phone,
        "university": profile.university,
        "major": profile.major,
        "graduation_year": profile.graduation_year,
        "bio": profile.bio,
        "location": profile.location,
        "github_url": profile.github_url,
        "website_url": profile.website_url,
        "linkedin_url": profile.linkedin_url,
        "internship_type_preference": profile.internship_type_preference,
        "preferred_internship_location": profile.preferred_internship_location,
        "preferred_locations": profile.preferred_locations,
        "open_to_relocate": profile.open_to_relocate,
        "multiple_website_urls": profile.multiple_website_urls,
        "skills": profile.skills,
        "profile_views": profile.profile_views,
        "role": "student"  
    })

@api_view(['POST'])
def save_student_profile(request):
    data = request.data
    profile, _ = StudentProfile.objects.update_or_create(
        user_id=data["user_id"],
        defaults=data
    )
    return Response({
        "message": "Profile saved",
        "id": profile.id
    })


@api_view(['GET'])
def get_student_projects(request, user_id):
    profile = get_object_or_404(StudentProfile, user_id=user_id)
    projects = StudentProject.objects.filter(student=profile)
    data = [{
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "technologies": p.technologies,
        "video_url": p.video_url
    } for p in projects]
    return Response(data)


@api_view(['POST'])
def save_student_projects(request):
    student_id = request.data.get("student_id")
    projects = request.data.get("projects", [])
    StudentProject.objects.filter(student_id=student_id).delete()
    for p in projects:
        StudentProject.objects.create(
            student_id=student_id,
            title=p["title"],
            description=p.get("description", ""),
            technologies=p.get("technologies", []),
            video_url=p.get("video_url", "")
        )
    return Response({"message": "Projects saved"})


@api_view(['GET'])
def get_student_certifications(request, user_id):
    profile = get_object_or_404(StudentProfile, user_id=user_id)
    certs = StudentCertification.objects.filter(student=profile)
    data = [{
        "id": c.id,
        "certification_name": c.certification_name,
        "issuing_organization": c.issuing_organization,
        "issue_date": c.issue_date,
        "expiry_date": c.expiry_date,
        "credential_id": c.credential_id,
        "credential_url": c.credential_url,
        "certificate_file_url": c.certificate_file_url,
        "certificate_filename": c.certificate_filename
    } for c in certs]
    return Response(data)


@api_view(['POST'])
def save_student_certifications(request):
    student_id = request.data.get("student_id")
    certifications = request.data.get("certifications", [])
    StudentCertification.objects.filter(student_id=student_id).delete()
    for c in certifications:
        StudentCertification.objects.create(
            student_id=student_id,
            certification_name=c["certification_name"],
            issuing_organization=c.get("issuing_organization", ""),
            issue_date=c.get("issue_date"),
            expiry_date=c.get("expiry_date"),
            credential_id=c.get("credential_id", ""),
            credential_url=c.get("credential_url", ""),
            certificate_file_url=c.get("certificate_file_url", ""),
            certificate_filename=c.get("certificate_filename", ""),
        )
    return Response({"message": "Certifications saved"})


# --- Yeni eklenen OTP API endpointleri ---


# In-memory OTP storage
otp_storage = {}
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    otp_type = request.data.get('type')

    if not email or not otp or not otp_type:
        return Response({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

    stored_otp = otp_storage.get(email)
    if stored_otp is None:
        return Response({"error": "OTP not found"}, status=status.HTTP_404_NOT_FOUND)

    if otp != stored_otp:
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        user.is_verified = True
        user.save()
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    del otp_storage[email]

    return Response({"success": True})

@api_view(['POST'])
def resend_otp(request):
    email = request.data.get('email')
    otp_type = request.data.get('type')

    if not email or not otp_type:
        return Response({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

    new_otp = f"{random.randint(100000, 999999)}"
    otp_storage[email] = new_otp

    success = send_otp_email(email, new_otp)

    if success:
        return Response({"success": True})
    else:
        return Response({"error": "Failed to send OTP email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_bookmarked_students(request):
    user = request.user
    if isinstance(user, AnonymousUser):
        return Response([])

    try:
        recruiter_profile = RecruiterProfile.objects.get(user=user)
    except RecruiterProfile.DoesNotExist:
        return Response({"detail": "Recruiter profile not found."}, status=status.HTTP_404_NOT_FOUND)

    bookmarks = Bookmark.objects.select_related('student__user').filter(recruiter=recruiter_profile)

    data = []
    for bookmark in bookmarks:
        student = bookmark.student
        data.append({
            "id": student.id,
            "user_id": student.user.id,
            "name": student.user.name,
            "email": student.user.email,
            "university": student.university,
            "major": student.major,
            "graduation_year": student.graduation_year,
            "location": student.location,
            "skills": student.skills,
            "profile_views": student.profile_views,
            "internship_type_preference": student.internship_type_preference
        })

    return Response(data)


@api_view(['GET', 'PUT'])
def recruiter_profile_detail(request, user_id):
    try:
        profile = RecruiterProfile.objects.get(user__id=user_id)
    except RecruiterProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        data = {
            "user_id": profile.user.id,
            "name": profile.name,
            "phone": profile.phone,
            "company_name": profile.company_name,
            "position": profile.position,
            "location": profile.location,
            "email": profile.user.email,
        }
        return Response(data)

    elif request.method == 'PUT':
        data = request.data
        profile.name = data.get("name", profile.name)
        profile.phone = data.get("phone", profile.phone)
        profile.company_name = data.get("company_name", profile.company_name)
        profile.position = data.get("position", profile.position)
        profile.location = data.get("location", profile.location)
        profile.save()
        return Response({"message": "Profile updated"})


@api_view(['POST'])
def create_recruiter_profile(request):
    data = request.data
    user_id = data.get("user_id")
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if RecruiterProfile.objects.filter(user=user).exists():
        return Response({"error": "Profile already exists"}, status=status.HTTP_400_BAD_REQUEST)

    profile = RecruiterProfile.objects.create(
        user=user,
        name=data.get("name", ""),
        phone=data.get("phone", ""),
        company_name=data.get("company_name", ""),
        position=data.get("position", ""),
        location=data.get("location", ""),
    )
    return Response({"message": "Profile created", "id": profile.id}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def add_bookmark(request):
    user = request.user
    if isinstance(user, AnonymousUser):
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    data = request.data
    student_id = data.get("student_id")
    if not student_id:
        return Response({"error": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        recruiter_profile = RecruiterProfile.objects.get(user=user)
    except RecruiterProfile.DoesNotExist:
        return Response({"error": "Recruiter profile not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        student = StudentProfile.objects.get(id=student_id)
    except StudentProfile.DoesNotExist:
        return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)

    bookmark, created = Bookmark.objects.get_or_create(recruiter=recruiter_profile, student=student)
    if created:
        return Response({"message": "Bookmark added"}, status=status.HTTP_201_CREATED)
    else:
        return Response({"message": "Bookmark already exists"})


@api_view(['DELETE'])
def remove_bookmark(request, student_id):
    user = request.user
    if isinstance(user, AnonymousUser):
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        recruiter_profile = RecruiterProfile.objects.get(user=user)
    except RecruiterProfile.DoesNotExist:
        return Response({"error": "Recruiter profile not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        bookmark = Bookmark.objects.get(recruiter=recruiter_profile, student__id=student_id)
        bookmark.delete()
        return Response({"message": "Bookmark removed"})
    except Bookmark.DoesNotExist:
        return Response({"error": "Bookmark not found"}, status=status.HTTP_404_NOT_FOUND)

# --- Dosya upload view'i ---

import os
from django.conf import settings
from django.core.files.storage import default_storage

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_certificate(request):
    if 'file' not in request.FILES:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES['file']

    save_path = os.path.join('certificates', file.name)
    path = default_storage.save(save_path, file)

    public_url = request.build_absolute_uri(settings.MEDIA_URL + path)

    return Response({"public_url": public_url}, status=status.HTTP_201_CREATED)
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    user_id = request.POST.get('user_id')
    if not user_id:
        return Response({"error": "user_id missing"}, status=status.HTTP_400_BAD_REQUEST)

    if 'file' not in request.FILES:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES['file']
    save_dir = os.path.join('resumes', str(user_id))
    save_path = os.path.join(save_dir, file.name)

    # Eğer aynı dosya varsa üstüne yazma yerine farklı isim verilebilir (isteğe bağlı)
    path = default_storage.save(save_path, file)

    public_url = request.build_absolute_uri(settings.MEDIA_URL + path)

    # Burada opsiyonel olarak StudentProfile modelinde resume_url ve resume_filename alanlarını güncelleyebilirsin.

    return Response({"public_url": public_url}, status=status.HTTP_201_CREATED)
import urllib.parse

@api_view(['POST'])
def delete_resume(request):
    user_id = request.data.get('user_id')
    resume_url = request.data.get('resume_url')

    if not user_id or not resume_url:
        return Response({"error": "user_id and resume_url required"}, status=status.HTTP_400_BAD_REQUEST)

    # Resume URL'den dosya yolunu çıkar (örneğin MEDIA_URL sonrası)
    try:
        parsed_url = urllib.parse.urlparse(resume_url)
        file_path = parsed_url.path.lstrip('/')  # /media/resumes/1/filename.pdf -> media/resumes/1/filename.pdf
        if file_path.startswith(settings.MEDIA_URL.lstrip('/')):
            file_path = file_path[len(settings.MEDIA_URL.lstrip('/')):]
    except Exception:
        return Response({"error": "Invalid resume_url"}, status=status.HTTP_400_BAD_REQUEST)

    # Dosyayı sil
    if default_storage.exists(file_path):
        default_storage.delete(file_path)

    # Burada opsiyonel olarak StudentProfile modelinde resume_url ve resume_filename alanlarını temizle

    return Response({"message": "Resume deleted"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def check_bookmark_status(request, student_id):
    user = request.user
    if isinstance(user, AnonymousUser):
        return Response({"isBookmarked": False})

    try:
        recruiter_profile = RecruiterProfile.objects.get(user=user)
    except RecruiterProfile.DoesNotExist:
        return Response({"isBookmarked": False})

    is_bookmarked = Bookmark.objects.filter(recruiter=recruiter_profile, student__user__id=student_id).exists()
    return Response({"isBookmarked": is_bookmarked})


@api_view(['POST'])
def add_bookmark(request):
    user = request.user
    if isinstance(user, AnonymousUser):
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    student_id = request.data.get("student_id")
    if not student_id:
        return Response({"error": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        recruiter_profile = RecruiterProfile.objects.get(user=user)
    except RecruiterProfile.DoesNotExist:
        return Response({"error": "Recruiter profile not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        student = StudentProfile.objects.get(user__id=student_id)
    except StudentProfile.DoesNotExist:
        return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)

    bookmark, created = Bookmark.objects.get_or_create(recruiter=recruiter_profile, student=student)
    if created:
        return Response({"message": "Bookmark added"}, status=status.HTTP_201_CREATED)
    else:
        return Response({"message": "Bookmark already exists"})


@api_view(['DELETE'])
def remove_bookmark(request, student_id):
    user = request.user
    if isinstance(user, AnonymousUser):
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        recruiter_profile = RecruiterProfile.objects.get(user=user)
    except RecruiterProfile.DoesNotExist:
        return Response({"error": "Recruiter profile not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        bookmark = Bookmark.objects.get(recruiter=recruiter_profile, student__user__id=student_id)
        bookmark.delete()
        return Response({"message": "Bookmark removed"})
    except Bookmark.DoesNotExist:
        return Response({"error": "Bookmark not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_project_video(request):
    user_id = request.POST.get('user_id')
    project_id = request.POST.get('project_id')
    if not user_id or not project_id:
        return Response({"error": "user_id and project_id are required"}, status=status.HTTP_400_BAD_REQUEST)

    if 'file' not in request.FILES:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES['file']
    save_dir = os.path.join('project-videos', str(user_id))
    os.makedirs(os.path.join(settings.MEDIA_ROOT, save_dir), exist_ok=True)
    save_path = os.path.join(save_dir, file.name)

    path = default_storage.save(save_path, file)
    public_url = request.build_absolute_uri(settings.MEDIA_URL + path)
    return Response({"public_url": public_url}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def delete_project_video(request):
    user_id = request.data.get('user_id')
    video_url = request.data.get('video_url')

    if not user_id or not video_url:
        return Response({"error": "user_id and video_url are required"}, status=status.HTTP_400_BAD_REQUEST)

    from urllib.parse import urlparse

    try:
        parsed_url = urlparse(video_url)
        file_path = parsed_url.path.lstrip('/')
        if file_path.startswith(settings.MEDIA_URL.lstrip('/')):
            file_path = file_path[len(settings.MEDIA_URL.lstrip('/')):]
    except Exception:
        return Response({"error": "Invalid video_url"}, status=status.HTTP_400_BAD_REQUEST)

    if default_storage.exists(file_path):
        default_storage.delete(file_path)

    return Response({"message": "Video deleted"}, status=status.HTTP_200_OK)
