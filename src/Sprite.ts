import {Game} from './Game';

export class Sprite {
    xPos : number = 0;
    yPos : number = 0;
    xPosDraw : number = 0;
    yPosDraw : number = 0;
    width : number;
    height : number;
    src : string;
    totalFrames : number;
    framesPerRow : number;
    animateSpeed : number = 1/12;
    
    // derived attributes
    img : HTMLImageElement;
    rows : number = 0;
    frameIndex : number = 0;
    frameStartX : number = 0;
    frameStartY : number = 0;

    constructor(xPos:number,yPos:number,width:number,height:number,src:string,totalFrames:number,framesPerRow:number,animateSpeed:number){
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.src = src;
        this.totalFrames = totalFrames;
        this.framesPerRow = framesPerRow;
        this.animateSpeed = animateSpeed;
        this.rows = Math.floor(this.totalFrames / this.framesPerRow);

        if(this.src){
            this.img = new Image();
            this.img.src = this.src;
        }
    }

    draw(game:Game){
        this.frameIndex = Math.floor(game.frameCount * this.animateSpeed) % this.totalFrames;
        this.frameStartX = (this.frameIndex % this.framesPerRow) * this.width;
        this.frameStartY = (Math.floor(this.frameIndex / this.framesPerRow) % this.rows) * this.height;

        this.xPosDraw = game.level.topLeftCornerPosX + this.xPos * game.blockLength;
        this.yPosDraw = game.level.topLeftCornerPosY + this.yPos * game.blockLength;

        game.ctx.drawImage(this.img,this.frameStartX,this.frameStartY,this.width,this.height,this.xPosDraw,this.yPosDraw,this.width,this.height);
    }
}