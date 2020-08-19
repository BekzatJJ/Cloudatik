from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='blog-main'),
    path('trying/', views.trying, name='blog-trying'),
    path('configurations/<str:device_id>', views.config, name='blog-config'),
    path('login/', views.login, name='blog-login')


]
