import {Game} from './Game';
import {Entity,SpriteProperties} from './Entity';

interface OrientationFrames {
    front : number[];
    left : number[];
    right : number[];
    back : number[];
    frontStill : number;
    leftStill : number;
    rightStill : number;
    backStill : number;
}

export class Player extends Entity {
    orientation : string = 'front';
    action : string = 'normal';
    frameCount : number;
    orientationFrames : OrientationFrames;

    constructor(properties:SpriteProperties,orientation:string,action:string,frameCount:number,orientationFrames:OrientationFrames,game:Game){
        super(properties);

        this.orientation = orientation;
        this.action = action;
        this.frameCount = frameCount;
        this.orientationFrames = orientationFrames;

        let thisPlayer = this;

        
        
    }

    draw(game:Game){
        this.action = 'normal';
        
        if(game.keyState[37] || game.keyState[65]){
            this.orientation = 'left'; this.action = 'walking';
        }
        else if(game.keyState[38] || game.keyState[87]){
            this.orientation = 'back'; this.action = 'walking';
        }
        else if(game.keyState[39] || game.keyState[68]){
            this.orientation = 'right'; this.action = 'walking';
        }
        else if(game.keyState[40] || game.keyState[83]){
            this.orientation = 'front'; this.action = 'walking';
        }

        switch(this.action){
            case 'normal':
                this.frameIndex = eval('this.orientationFrames.'+this.orientation+'Still');
                this.frameCount = 0;
                break;
            case 'walking':
                this.frameIndex = Math.floor(this.frameCount * this.properties.animateSpeed) % this.properties.totalFrames;
                let totalFramesTemp = eval('this.orientationFrames.'+this.orientation+'[1] - this.orientationFrames.'+this.orientation+'[0] + 1');
                let startingFrame = eval('this.orientationFrames.'+this.orientation+'[0]');
                this.frameIndex = startingFrame + this.frameIndex % totalFramesTemp;
                this.frameCount++;

                switch(this.orientation){
                    case 'left':
                        if(this.properties.xPos > 0){
                            this.properties.xPos = Math.floor((this.properties.xPos*100) - 2)/100; 
                        }
                        break;
                    case 'right':
                        if(this.properties.xPos < game.level?.blockWidth - 1){
                            this.properties.xPos = Math.floor((this.properties.xPos*100) + 2)/100; 
                        }
                        break;
                    case 'back': 
                        if(this.properties.yPos > 0){
                            this.properties.yPos = Math.floor((this.properties.yPos*100) - 2)/100; 
                        }
                        break;
                    case 'front':
                        if(this.properties.yPos < game.level?.blockHeight - 1){
                            this.properties.yPos = Math.floor((this.properties.yPos*100) + 2)/100; 
                        }
                        break;
                }

                break;
        }
        
        this.frameStartX = (this.frameIndex % this.properties.framesPerRow) * this.properties.width;
        this.frameStartY = (Math.floor(this.frameIndex / this.properties.framesPerRow) % this.rows) * this.properties.height;

        this.properties.xPosDraw = Math.floor(game.level.topLeftCornerPosX + this.properties.xPos * game.blockLength);
        this.properties.yPosDraw = Math.floor(game.level.topLeftCornerPosY + this.properties.yPos * game.blockLength);

        game.ctx.drawImage(this.img,this.frameStartX,this.frameStartY,this.properties.width,this.properties.height,this.properties.xPosDraw,this.properties.yPosDraw,this.properties.width,this.properties.height);
    }
}