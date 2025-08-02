from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404
from api.models import User, StudentProfile
from recruiter.models import RecruiterProfile

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    role = getattr(user, 'role', None)

    name = user.get_full_name() or getattr(user, 'name', None) or ""

    if role and role.lower() == 'student':
        try:
            profile = StudentProfile.objects.get(user=user)
            data = {
                "id": user.id,
                "email": user.email,
                "role": role,
                "name": name,
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
            }
        except StudentProfile.DoesNotExist:
            data = {
                "id": user.id,
                "email": user.email,
                "role": role,
                "name": name,
                "error": "Student profile not found"
            }
    elif role and role.lower() == 'recruiter':
        try:
            profile = RecruiterProfile.objects.get(user=user)
            data = {
                "id": user.id,
                "email": user.email,
                "role": role,
                "name": name,
                "phone": profile.phone,
                "company_name": profile.company_name,
                "position": profile.position,
                "location": profile.location,
            }
        except RecruiterProfile.DoesNotExist:
            data = {
                "id": user.id,
                "email": user.email,
                "role": role,
                "name": name,
                "error": "Recruiter profile not found"
            }
    else:
        data = {
            "id": user.id,
            "email": user.email,
            "role": role,
            "name": name,
        }
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logout successful"})
