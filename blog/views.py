from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Post
from django.core import serializers
from django.forms.models import model_to_dict

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as user_login

from django.utils import timezone
import datetime

import requests
import json

def convert(obj):
    if isinstance(obj, bool):
        return str(obj).lower()
    if isinstance(obj, (list, tuple)):
        return [convert(item) for item in obj]
    if isinstance(obj, dict):
        return {convert(key):convert(value) for key, value in obj.items()}
    return obj

def trying(request):
    r = requests.get('https://api.cl-ds.com/getUserNode/bekzat/')
    now = timezone.now()
    if r.status_code == 200:
        context={r.json()['node'][0]['last_update'] , now}
        return HttpResponse(context, content_type="application/json")
    return HttpResponse('Could not save data')


@login_required
def main(request):
    return render(request, 'blog/dashboard.html')

@login_required
def config(request, device_id):
    context = {'device_id':device_id}
    return render(request, 'blog/config.html', context)

@login_required
def profile(request):
    return render(request, 'blog/profile.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            user_login(request, user)
            return redirect('/')
    return render(request, 'blog/login_user.html')

def register(request):
    return render(request, 'blog/register_user.html')

def reg(request, device_id):
    r = requests.get('https://api.cl-ds.com/checkSerial/'+ device_id + '/')
    if r.status_code == 200:
        context={"serial" : r.json()['serial']}
        return render(request, 'blog/register_node.html', context)

def range(request):
    return render(request, 'blog/chart_range.html')

