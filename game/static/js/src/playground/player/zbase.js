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

        this.damage_speed = 0;
        this.cur_skill = null;
        this.speed_time = 0;

        // 玩家头像
        if (this.character !== "robot") {
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
            console.log(this.img.src);
        }

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
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which === 3){  //右键点击事件
                outer.move_to(e.clientX - rect.left ,e.clientY - rect.top);
            } else if(e.which === 1){   //左键点击事件
                if(!outer.playground.players[0].is_me)
                    return false;
                if(outer.cur_skill === "fireball") {    
                    outer.shoot_fireball(e.clientX - rect.left ,e.clientY - rect.top);
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

    machine_attack() {
        let p = Math.random()
        let player;
        if(this.is_me) return ;
        if( p < 0.0025 ) {
            let id = 0;
            id =Math.floor(Math.random()* this.playground.players.length);
            player = this.playground.players[id];
            if(player ==this) return;
        }else if( p < 0.0046 ){
            player = this.playground.players[0];  
        }else return;

        let dx = this.x-player.x-player.vx*1.5 , dy = this.y-player.y-player.vy*1.5;
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
        if(this.is_me) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }else {
            this.ctx.beginPath();
            this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destory() {
        for(let i=0; i<this.playground.players.length;i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i,1);
            }
        }
    }
}
