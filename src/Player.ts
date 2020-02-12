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

    constructor(properties:SpriteProperties,orientation:string,action:string,frameCount:number,orientationFrames:OrientationFrames){
        super(properties);

        this.orientation = orientation;
        this.action = action;
        this.frameCount = frameCount;
        this.orientationFrames = orientationFrames;

        let thisPlayer = this;

        window.addEventListener("keydown",function(e){
            if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey){
                return false;
            }
            
            // left, up, right, down
            if(e.keyCode === 37 || e.keyCode === 65){
                thisPlayer.orientation = 'left'; thisPlayer.action = 'walking';
            }
            else if(e.keyCode === 38 || e.keyCode === 87){
                thisPlayer.orientation = 'back'; thisPlayer.action = 'walking';
            }
            else if(e.keyCode === 39 || e.keyCode === 68){
                thisPlayer.orientation = 'right'; thisPlayer.action = 'walking';
            }
            else if(e.keyCode === 40 || e.keyCode === 83){
                thisPlayer.orientation = 'front'; thisPlayer.action = 'walking';
            }
        });

        document.addEventListener("keyup",function(e){
            thisPlayer.action = 'normal';
        });
    }

    draw(game:Game){
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