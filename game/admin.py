from django.contrib import admin
from game.models.player.player import Player

# Register your models here.
admin.site.register(Player)


# 注册完后使用python3 manage.py makemigrations命令 python3 manage.py migrate命令
# 此时自定义的表会被加入数据库内
