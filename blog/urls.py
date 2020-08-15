from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='blog-main'),
    path('about/', views.about, name='blog-about'),
    path('rawdata/', views.rawdata, name='blog-rawdata'),
    path('accounts/profile/', views.trying, name='blog-trying'),
    path('configurations/<device_id>', views.config, name='blog-config')


]
