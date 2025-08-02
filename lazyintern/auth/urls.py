from django.urls import path
from .views import logout_view, get_user_profile
# from .views import current_session

urlpatterns = [
    # path('session', current_session, name='current-session'),
    path('logout', logout_view, name='logout'),
    path('user/profile/', get_user_profile, name='get_user_profile'),
]
