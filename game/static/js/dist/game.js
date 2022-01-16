class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
        <div class="ac-game-menu">
            <div class="ac-game-menu-field">
                <div class="ac-game-menu-field-item ac-game-menu-field-item-single">单人模式</div>
                <div class="ac-game-menu-field-item ac-game-menu-field-item-multi">多人模式</div>
                <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">设置</div>
            </div>
        </div>
    `);
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-menu-field-item-single');
        this.$multi = this.$menu.find('.ac-game-menu-field-item-multi');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.start();
    }

    start () {
        this.add_listening_events();
    }
    add_listening_events () {
        let outer = this;
        this.$single.click(function() {
            // console.log("click single");
            outer.hide();
            outer.root.playground.show();
        })
        this.$multi.click(function() {
            console.log("click multi");
        })
        this.$settings.click(function() {
            console.log("click setting");
        })
    }
    show() {    //显示menu界面
        this.$menu.show();
    }
    hide() {    //关闭menu界面
        this.$menu.hide();
    }
}
let GAME_OBJECTS = [];

class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);

        this.has_called_start = false; // 是否执行过start函数
        this.timedelta = 0; // 当前帧距离上一帧的时间间隔
    }

    start() {   // 只会在第一帧执行一次
        this.has_called_start = true;

    }
    update() {  // 每一帧均会执行一次
        
    }

    on_destory() {  // 在被销毁前执行一次

    }

    destory() {  // 删掉该物体
        this.on_destory();
        for (let i = 0;i < GAME_OBJECTS.length; i++ ) {
            if (GAME_OBJECT[i] === this) {
                GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }

}
let last_timestamp;

let GAME_ANIMATION = function(timestamp) {
    for (let i=0;i<GAME_OBJECTS.length;i++) {
        let obj = GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(GAME_ANIMATION);
}

requestAnimationFrame(GAME_ANIMATION);


class GameMap extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $('<canvas></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

    }
    start() {
        
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }

}
class Player extends GameObject {
    constructor(playground, X, Y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = X;
        this.y = Y;
        this.radius = radius;
        this.color = color;
        this.is_me = is_me;
        this.eps = 0.1;
        this.speed = speed;
        this.vx = 0;    // 移动方位
        this.vy = 0;    // 移动方位
        this.move_length = 0;  //玩家所控制的移动距离
        
    }
    start() {
        if(this.is_me) {
            this.add_listening_events();
        }else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu",function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if(e.which === 3){
                outer.move_to(e.clientX,e.clientY);
            }
        })
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx*dx+dy*dy);
    }

    move_to(tx,ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty-this.y, tx-this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    render() {
        this.ctx.beginPath();
        console.log(this.x,this.y);
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    update() {
        if(this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
            if(!this.is_me) {
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx,ty);
            }
        } else {
            let moved = Math.min(this.move_length, this.speed * this.timedelta/1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved; 
        }
        this.render();
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root=root;
        this.$playground = $(`
        <div class="ac-game-playground"> </div>`);
        // this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.players = [];
        this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, "white", this.height * 0.15, true));


        this.start();
    }
    start() {

    }

    show() {    //显示界面 
        this.$playground.show();i
    }
    hide() {    //关闭界面
        this.$playground.hide();
    }
}
export class AcGame {
    constructor (id) {
        this.id = id;
        this.$ac_game = $('#'+id);
        // this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        
        this.start();
    }

    start() {

    }

}
