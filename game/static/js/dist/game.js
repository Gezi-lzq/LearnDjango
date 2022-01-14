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
class AcGame {
    constructor (id) {
        this.id = id;
        this.$ac_game = $('#'+id);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {

    }

}
