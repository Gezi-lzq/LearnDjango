from django.http import JsonResponse
from game.models.player.player import Player

def getinfo_acapp(request):
    player = Player.objects.all()[0]
    return JsonResponse({
        'result':'success',
        'username':player.user.username,
        'photo': player.photo
    })

def getinfo_web(request):
    print("web")
    player = Player.objects.all()[0]
    return JsonResponse({
        'result': 'success',
        'username': player.user.username,
        'photo': player.photo
    })

 #判断该请求来源平台 由不同的操作函数处理
def getinfo(request):
    print("--")
    platform = request.GET.get('platform')
    if platform == "ACAPP":
        return getinfo_acapp(request)
    else:
        return getinfo_web(request)
    
        

