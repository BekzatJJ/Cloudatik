from django.shortcuts import render
from django.http import HttpResponse
from .models import Post
from django.core import serializers
from django.forms.models import model_to_dict

from django.contrib.auth.decorators import login_required

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
    r = requests.get('https://api.cl-ds.com/getUserNode/bekzat/', headers= {'Authorization': 'Token 62990ac3b609e5601a678c1e133416e6da7f10db'})
    if r.status_code == 200:
        context={"nodes": r.json()}
    else:
        context={"nodes":''}

    return render(request, 'blog/dashboard.html', convert(context))

def config(request, device_id):
    r = requests.get('https://api.cl-ds.com/getNodeInfo/'+ device_id + '/?format=json', headers= {'Authorization': 'Token 62990ac3b609e5601a678c1e133416e6da7f10db'})
    if r.status_code == 200:
        context={"info": r.json()}
    else:
        context={"info":''}

    return render(request, 'blog/config.html', convert(context))

def rawdata(request):
    return render(request, 'blog/rawdata.html')
def home(request):
    context={
        'posts': Post.objects.all()
    }
    return render(request, 'blog/home.html', context)

def about(request):
    return render(request, 'blog/about.html', {'title':'About'})

