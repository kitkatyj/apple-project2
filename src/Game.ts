import {Level} from './Level';
import {Player} from './Player';

export class Game {
    ctx : CanvasRenderingContext2D;
    frameCount : number = 0;

    level : Level;

    constructor(ctx:CanvasRenderingContext2D,player:Player){
        this.ctx = ctx;

        this.loadLevel(player);
    }

    loadLevel(player:Player){
        let xhr = new XMLHttpRequest();
        xhr.open('GET',"levels/a1.json",true);
        xhr.send();

        let thisGame = this;

        xhr.addEventListener("readystatechange",function(e){
            if (xhr.readyState == 4 && xhr.status == 200) {
                let levelTemp = JSON.parse(xhr.responseText);
                
                thisGame.level = new Level(
                    levelTemp.width,
                    levelTemp.height,
                    levelTemp.floor,
                    levelTemp.entities
                );

                thisGame.level.setPlayer(player);
            }
        });
    }
}