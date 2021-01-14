import {Level} from './Level';

export interface ImageMap {
    src: string;
    img: HTMLImageElement;
}

export class Game {
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    fps: number = 0;
    hitboxVisible:boolean = false;
    frameCount : number = 0;
    blockLength : number = 32;
    
    keyState : boolean[] = [];
    keyUpState : boolean[] = [];

    joystickState = {
        down:false,
        moveX:0,
        moveY:0
    }

    seedFunction : Function;
    createjs : any;

    level : Level;
    private images : ImageMap[] = [];

    constructor(canvas:HTMLCanvasElement,seedFunction:Function,createjs:any){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.seedFunction = seedFunction;
        this.createjs = createjs;

        let thisGame = this;

        createjs.Sound.alternateExtensions = ["mp3"];

        setInterval(function(){
            thisGame.fps = thisGame.frameCount;
            thisGame.frameCount = 0;
        },1000);

        document.addEventListener("keydown",function(e){
            if(e.ctrlKey || e.altKey || e.metaKey || document.activeElement === document.getElementById("seedInput")){
                return false;
            }

            thisGame.keyState[e.keyCode || e.which] = true;
        });

        document.addEventListener("keyup",function(e){
            thisGame.keyUpState[e.keyCode || e.which] = true;
            thisGame.keyState[e.keyCode || e.which] = false;
        });
        
        this.loadCommonImages();
    }

    loadLevel(seed:string){
        let xhr = new XMLHttpRequest();
        xhr.open('GET',"levels/a1.json",true);
        xhr.send();

        let thisGame = this;

        xhr.addEventListener("readystatechange",function(e){
            if (xhr.readyState == 4 && xhr.status == 200) {
                let lvl = JSON.parse(xhr.responseText);
                
                thisGame.level = new Level(
                    thisGame,
                    lvl.width,
                    lvl.height,
                    lvl.floor,
                    lvl.playerPos,
                    lvl.characters,
                    lvl.entities,
                    seed
                );
            }
        });
    }

    loadCommonImages(){
        let bubbleImg = new Image();
        bubbleImg.src = 'res/speech.png';

        this.images.push({src:'speech.png',img:bubbleImg});
    }

    loadImageMap(){
        return this.images;
    }
}