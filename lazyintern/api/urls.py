from django.urls import path
from . import views  # api app'in views.py'si

urlpatterns = [
    # Auth
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),

    # Student profile
    path('student/profile/<int:user_id>/', views.get_student_profile, name='get_student_profile'),
    path('student/profile/', views.save_student_profile, name='save_student_profile'),

    # Projects
    path('student/projects/<int:user_id>/', views.get_student_projects, name='get_student_projects'),
    path('student/projects/', views.save_student_projects, name='save_student_projects'),

    # Certifications
    path('student/certifications/<int:user_id>/', views.get_student_certifications, name='get_student_certifications'),
    path('student/certifications/', views.save_student_certifications, name='save_student_certifications'),

    # OTP endpoints
    path('auth/verify-otp', views.verify_otp, name='verify_otp'),
    path('auth/resend-otp', views.resend_otp, name='resend_otp'),
    

    # File upload endpoints
    path('upload/certificate', views.upload_certificate, name='upload_certificate'),
    path('upload/resume', views.upload_resume, name='upload_resume'),
    path('delete/resume', views.delete_resume, name='delete_resume'),
    
     path('bookmarks/check/<int:student_id>/', views.check_bookmark_status, name='check_bookmark_status'),
    path('bookmarks/', views.add_bookmark, name='add_bookmark'),
    path('bookmarks/<int:student_id>/', views.remove_bookmark, name='remove_bookmark'),
    
     path('project-video/upload', views.upload_project_video, name='upload_project_video'),
    path('project-video/delete', views.delete_project_video, name='delete_project_video'),
   


]

