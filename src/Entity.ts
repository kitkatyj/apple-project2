import {Game} from './Game';

export interface SpriteProperties {
    xPos : number;
    yPos : number;
    xPosDraw? : number;
    yPosDraw? : number;
    width? : number;
    height? : number;
    src : string;
    totalFrames? : number;
    framesPerRow? : number;
    animateSpeed? : number;
}

export class Entity {
    properties : SpriteProperties;
    
    img : HTMLImageElement;
    rows : number = 0;
    frameIndex : number = 0;
    frameStartX : number = 0;
    frameStartY : number = 0;

    constructor(properties:SpriteProperties){
        this.properties = properties;
        this.properties.xPosDraw = 0;
        this.properties.yPosDraw = 0;

        if(!this.properties.width) {this.properties.width = 32}
        if(!this.properties.height) {this.properties.height = 32}
        if(!this.properties.totalFrames) {this.properties.totalFrames = 1}
        if(!this.properties.framesPerRow) {this.properties.framesPerRow = 1}
        if(!this.properties.animateSpeed) {this.properties.animateSpeed = 0}

        this.rows = Math.floor(this.properties.totalFrames / this.properties.framesPerRow);

        if(this.properties.src){
            this.img = new Image();
            this.img.src = this.properties.src;
        }
    }

    draw(game:Game){
        this.frameIndex = Math.floor(game.frameCount * this.properties.animateSpeed) % this.properties.totalFrames;
        this.frameStartX = (this.frameIndex % this.properties.framesPerRow) * this.properties.width;
        this.frameStartY = (Math.floor(this.frameIndex / this.properties.framesPerRow) % this.rows) * this.properties.height;

        this.properties.xPosDraw = game.level.topLeftCornerPosX + this.properties.xPos * game.blockLength;
        this.properties.yPosDraw = game.level.topLeftCornerPosY + this.properties.yPos * game.blockLength;

        game.ctx.drawImage(this.img,this.frameStartX,this.frameStartY,this.properties.width,this.properties.height,this.properties.xPosDraw,this.properties.yPosDraw,this.properties.width,this.properties.height);
    }
}