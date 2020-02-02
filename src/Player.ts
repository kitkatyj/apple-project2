import {Game} from './Game';
import {Sprite} from './Sprite';

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

export class Player extends Sprite {
    orientation : string = 'front';
    action : string = 'normal';
    frameCount : number;
    orientationFrames : OrientationFrames;

    constructor(xPos:number,yPos:number,width:number,height:number,src:string,totalFrames:number,framesPerRow:number,animateSpeed:number,orientation:string,action:string,frameCount:number,orientationFrames:OrientationFrames){
        super(xPos,yPos,width,height,src,totalFrames,framesPerRow,animateSpeed);

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
                this.frameIndex = Math.floor(this.frameCount * this.animateSpeed) % this.totalFrames;
                let totalFramesTemp = eval('this.orientationFrames.'+this.orientation+'[1] - this.orientationFrames.'+this.orientation+'[0] + 1');
                let startingFrame = eval('this.orientationFrames.'+this.orientation+'[0]');
                this.frameIndex = startingFrame + this.frameIndex % totalFramesTemp;
                this.frameCount++;

                switch(this.orientation){
                    case 'left':    this.xPos--; break;
                    case 'right':   this.xPos++; break;
                    case 'back':    this.yPos--; break;
                    case 'front':   this.yPos++; break;
                }

                break;
        }
        
        this.frameStartX = (this.frameIndex % this.framesPerRow) * this.width;
        this.frameStartY = (Math.floor(this.frameIndex / this.framesPerRow) % this.rows) * this.height;

        game.ctx.drawImage(this.img,this.frameStartX,this.frameStartY,this.width,this.height,this.xPos,this.yPos,this.width,this.height);
    }
}