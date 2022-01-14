class AcGamePlayground {
    constructor(root) {
        this.root=root;
        this.$playground = $(`
        <h2>游戏界面</h2>
        `);
        this.hide();
        this.root.$ac_game.append(this.$playground);

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
