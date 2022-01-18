from django.db import models
from django.contrib.auth.models import User

# 定义Player数据表
class Player(models.Model):
    # 当User删除时 所关联的Player会一同删除
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    photo = models.URLField(max_length=256,blank=True)

    def __str__(self):
        return str(self.user)

