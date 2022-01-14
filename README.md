# Django学习项目
 通过本项目来学习Django框架,项目将实现一个游戏
## 项目结构
为本游戏的主要实现在`game`目录下
 * `templates/`:管理html文件
 * `urls/`:管理路由,即链接与函数的对应关系
 * `views/`：管理`http`函数
 * `models/`：管理数据库数据
 * `static/`：管理静态文件
    * `css`
    * `js`
    * `image`
    * `audio`
    * ...
 * `consumers/`:管理`websocket`函数

#### 项目初始化
 全局`acapp/setting`文件更改
 * 时区更改：`TIME_ZONE = 'Asia/Shanghai'`
 * INSTALLED_APPS修改:增加`'game.apps.GameConfig'`
 * 配置静态文件相关目录
   ```
   import os
   ···
   STATIC_ROOT = os.path.join(BASE_DIR,'static')
   STATIC_URL = '/static/'

   MEDIA_ROOT = os.path.join(BASE_DIR,'media')
   MEDIA_URL = '/media/'
   ```
 * 
