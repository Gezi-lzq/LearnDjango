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
            if (GAME_OBJECTS[i] === this) {
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
class Particle extends GameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eqs = 3;        
    }
    start(){}
    update() {
        if(this.move_length < this.eqs || this.speed <this.eqs ){
            this.destory();
            return false;
        }
        let moved = Math.min(this.move_length,this.speed * this.timedelta/1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI *2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Player extends GameObject {
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

        this.damage_speed = 0;
        this.cur_skill = null;

        this.speed_time = 0;
    }
    start() {
        if(this.is_me) {
            this.add_listening_events();
        }else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx,ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu",function() {
            return false;
        });
        // 监听鼠标事件
        this.playground.game_map.$canvas.mousedown(function(e) {
            if(e.which === 3){  //右键点击事件
                outer.move_to(e.clientX,e.clientY);
            } else if(e.which === 1){   //左键点击事件
                if(outer.cur_skill === "fireball") {    
                    outer.shoot_fireball(e.clientX,e.clientY);
                }
                outer.cur_skill = null;
            }
        })

        $(window).keydown(function(e) {
            if (e.which === 81) {
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shoot_fireball(tx,ty) {
        let x=this.x , y=this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx-this.x);
        let vx = Math.cos(angle) , vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        
        new FireBall(this.playground , this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height*0.01);
    }

    is_attacked(angle,damage){

        let num = 15+Math.random()*10 ;
        for(let i=0; i<num; i++){
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length); 
        }

        this.radius -= damage;
        if(this.radius < 10) {
            this.destory();
            return false;
        }
        // 球本身速度矢量 与 球碰撞后带来的速度矢量 进行合成
        this.vx += Math.cos(angle)*damage;
        this.vy += Math.sin(angle)*damage;
        let l = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        this.vx /= l, this.vy/=l;
        //移动距离
        this.move_length = (1/this.radius)*this.playground.height*20;
        this.damage_speed = (1/this.radius)*this.playground.height*34;
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

    machine_attack(){
        let p = Math.random()
        let player;
        if(this.is_me) return ;
        if( p < 0.0025 ) {
            let id = 0;
            id =Math.floor(Math.random()* this.playground.players.length);
            player = this.playground.players[id];
            if(player ==this) return;
        }else if( p < 0.0038 ){
            player = this.playground.players[0];  
        }else return;

        let dx = this.x-player.x-player.vx*2.1 , dy = this.y-player.y-player.vy*2.1;
        let t = Math.sqrt(dx*dx + dy*dy)/(this.playground.height * 0.5);
        let tx = player.x + player.speed * player.vx * t;
        let ty = player.y + player.speed * player.vy * t;
        this.shoot_fireball(tx,ty);
    }

    update() {
        this.speed_time += this.timedelta / 1000;
        if(this.speed_time>1) 
            this.machine_attack();
        let s = this.speed;
        if(this.damage_speed > this.speed * 0.6){
            s = this.damage_speed;
            this.damage_speed *= 0.9;
            this.move_length *= 0.9;
        }

        if(this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
            if(!this.is_me) {
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx,ty);
                console.log(tx+ty);
            }
        } else {
            let moved = Math.min(this.move_length, s * this.timedelta/1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved; 
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destory() {
        for(let i=0; i<this.playground.players.length;i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i,1);
            }
        }
    }
}
class FireBall extends GameObject {
    constructor(playground, player, x, y, radius, vx, vy, color,speed, move_length, damages) {
        super();
        this.playground = playground;
        this.player = player;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.color = color;
        this.move_length = move_length;
        this.damages = damages;

        this.ctx = this.playground.game_map.ctx;
        this.eps = 0.1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destory();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta/1000);
        
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        
        this.move_length -= moved;

        for(let i=0; i < this.playground.players.length;i++) {
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }
        this.render()
    }

    get_dist(x1,y1,x2,y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx*dx + dy*dy);
    }

    attack(player) {
        console.log("攻击到目标")
        let angle = Math.atan2(player.y - this.y , player.x - this.x);
        player.is_attacked(angle,this.damages);
        this.destory();
    }

    is_collision(player) {
        let distance = this.get_dist(this.x,this.y,player.x,player.y);
        if(distance < this.radius +player.radius) 
            return true;
        return false;
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class AcGamePlayground {
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
        this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, "white", this.height * 0.25, true));

        this.start();
    }

    start() {
        //生成敌人
        for( let i=1; i<=9; i++) {
            this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, this.get_random_color(), this.height * 0.20, false))
        }
    }

    get_random_color() {
        let colors = ["#FFF89A","#FFC900","#086E7D","#F14A16","#D3E4CD"];
        return colors[Math.floor(Math.random()*5)];
    }

    show() {    //显示界面 
        this.$playground.show();
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
