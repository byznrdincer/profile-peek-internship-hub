from django.urls import path
from . import views

urlpatterns = [
    path('students/', views.get_all_students, name='get_all_students'),
    path('bookmarks/', views.get_bookmarked_students, name='get_bookmarked_students'),

    path('profile/me/', views.get_recruiter_profile, name='get_my_profile'),  # Giriş yapmış kullanıcının profili
    path('profile/', views.create_recruiter_profile, name='create_recruiter_profile'),  # Yeni profil oluştur
    path('profile/<int:user_id>/', views.recruiter_profile_detail, name='recruiter_profile_detail'),  # GET & PUT için tek view

    path('bookmark/add/', views.add_bookmark, name='add_bookmark'),
    path('bookmark/remove/<int:student_id>/', views.remove_bookmark, name='remove_bookmark'),

]
