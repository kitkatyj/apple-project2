import {Level} from './Level';
import {Player} from './Player';

export class Game {
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    fps: number = 0;
    frameCount : number = 0;
    blockLength : number = 32;

    level : Level;

    constructor(canvas:HTMLCanvasElement,player:Player){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.loadLevel(player);

        let thisGame = this;

        setInterval(function(){
            thisGame.fps = thisGame.frameCount;
            thisGame.frameCount = 0;
        },1000);
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
                    thisGame,
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