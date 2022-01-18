class AcGamePlayground {
    constructor(root) {
        this.root=root;
        this.$playground = $(`
        <div class="ac-game-playground"> </div>`);
        this.hide();
        
        
        // this.start();
    }

    start() {
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        
        this.players = [];
        this.game_map = new GameMap(this);
        this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, "white", this.height * 0.25, true));
        //生成敌人
        for( let i=1; i<=7; i++) {
            this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, this.get_random_color(), this.height * 0.20, false))
        }

    }

    show() {    //显示界面 
        this.start();
        this.$playground.show();
    }
    hide() {    //关闭界面
        this.$playground.hide();
    }

    get_random_color() {
        let colors = ["#FFF89A","#FFC900","#086E7D","#F14A16","#D3E4CD"];
        return colors[Math.floor(Math.random()*5)];
    }

}
