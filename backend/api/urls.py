from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register,name='register'),
    path('login/', views.login, name='login'),
    path('forgot-password/', views.forgot_password,name='forgot-password'),
    path('verify-email-via-otp/', views.verify_email_via_otp,name='verify-email-via-otp'),
    path('verify-otp/', views.verify_otp,name='verify-otp'),
    path('reset-password/', views.reset_password,name='reset-password'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('managers/', views.get_managers, name='get_managers'),
    path('employees/', views.get_employees, name='get_employees'),
]