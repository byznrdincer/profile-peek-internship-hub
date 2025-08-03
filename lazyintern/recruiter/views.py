from rest_framework.decorators import api_view
from rest_framework.response import Response
from recruiter.models import RecruiterProfile, Bookmark
from api.models import StudentProfile, User
from rest_framework import status
from django.contrib.auth.models import AnonymousUser
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from recruiter.models import RecruiterProfile

# Tüm öğrenci profillerini getirir
@api_view(['GET'])
def get_all_students(request):
    students = StudentProfile.objects.select_related('user').all()
    data = []
    for s in students:
        data.append({
            "id": s.id,
            "user_id": s.user.id,
            "name": s.user.name,
            "email": s.user.email,
            "university": s.university,
            "major": s.major,
            "graduation_year": s.graduation_year,
            "location": s.location,
            "skills": s.skills,
            "profile_views": s.profile_views,
            "internship_type_preference": s.internship_type_preference
        })
    return Response(data)

@api_view(['GET'])
def get_recruiter_profile(request):
    user = request.user

    # ❗ Kullanıcı giriş yapmamışsa 401 hatası döndür
    if not user or not user.is_authenticated:
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        # ❗ user yerine user_id ile filtreleme daha güvenli
        recruiter = RecruiterProfile.objects.select_related('user').get(user_id=user.id)
    except RecruiterProfile.DoesNotExist:
        return Response({"error": "Recruiter profile not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        "user_id": recruiter.user.id,
        "name": recruiter.name,
        "phone": recruiter.phone,
        "company_name": recruiter.company_name,
        "position": recruiter.position,
        "location": recruiter.location,
        "email": recruiter.user.email,
        "role": "recruiter"
    })
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

# Recruiter profil detayları (GET ve PUT aynı fonksiyonda)
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

# Yeni recruiter profil oluşturur
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

# Bookmark ekleme
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

# Bookmark silme
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
