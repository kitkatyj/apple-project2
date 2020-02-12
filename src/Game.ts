import {Level} from './Level';

export class Game {
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    fps: number = 0;
    frameCount : number = 0;
    blockLength : number = 32;
    keyState : boolean[] = [];

    level : Level;

    constructor(canvas:HTMLCanvasElement){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        let thisGame = this;

        setInterval(function(){
            thisGame.fps = thisGame.frameCount;
            thisGame.frameCount = 0;
        },1000);

        document.addEventListener("keydown",function(e){
            if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey){
                return false;
            }

            thisGame.keyState[e.keyCode || e.which] = true;
        });

        document.addEventListener("keyup",function(e){
            thisGame.keyState[e.keyCode || e.which] = false;
        });

        this.loadLevel();
    }

    loadLevel(){
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
                    levelTemp.playerPos,
                    levelTemp.entities
                );
            }
        });
    }
}