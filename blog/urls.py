from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='blog-main'),
    path('trying/', views.trying, name='blog-trying'),
    path('configurations/<str:device_id>', views.config, name='blog-config'),
    path('login/', views.login, name='blog-login'),
    path('profile/', views.profile, name='blog-profile'),
    path('register/', views.register, name='blog-register'),
    path('reg/<str:device_id>/', views.reg, name="blog-reg"),
    path('chart-range', views.range, name="blog-range"),
    path('admin/dashboard', views.adminDash, name="blog-admin"),
    path('admin/new/node', views.newNode, name="blog-newNode"),
    path('admin/new/sensor', views.newSensor, name="blog-newSensor"),
    path('map/', views.map, name="blog-map"),
    path('rmt/', views.rmt, name="blog-rmt"),
    path('agri-price', views.agri, name="blog-agri")


]
