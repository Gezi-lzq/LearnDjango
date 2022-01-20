from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.http import JsonResponse

def register(request):
    data = request.GET
    username = data.get("username","").split() #如果不存在返回”“  split去除前后空格
    password = data.get("password","").split()
    password_confirm = data.get("password_confirm","").split()
    if not username or not password:
        return JsonResponse({
            'result':"用户名与密码不能为空"
        })
    if password != password_confirm:
        return JsonResponse({
            'result':"两个密码不一致"
        })
    if User.object.filter(username=username).exists():
        return JsonResponse({
            'result':"用户名已经存在"
        })
    user = User(username=username)
    user.set_password(password)
    user.save()
    Player.object.create(user = user, photo="https://tupian.qqw21.com/article/UploadPic/2015-5/20155317182427630.jpg")
    login(request,user)
    return JsonResponse({
        'result':"success",
    })