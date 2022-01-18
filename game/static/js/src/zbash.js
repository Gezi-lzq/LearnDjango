export class AcGame {
    constructor (id, AcWingOS) {
        this.id = id;
        this.AcWingOS = AcWingOS;
        this.$ac_game = $('#'+id);

        this.menu = new AcGameMenu(this);
        this.settings = new Settings(this);
        this.playground = new AcGamePlayground(this);
        
        this.start();
    }

    start() {

    }

}
