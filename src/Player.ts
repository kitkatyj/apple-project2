import { Character, OrientationFrames } from "./Character";
import { SpriteProperties } from "./Entity";
import { ImageMap, Game } from "./Game";

export class Player extends Character {
    constructor(properties:SpriteProperties,direction:string[],action:string,frameCount:number,orientationFrames:OrientationFrames,imageMap:ImageMap[]){
        super(properties,direction,action,frameCount,orientationFrames,imageMap);
    }

    draw(game:Game){
        this.action = 'normal';

        this.moveSpeed = this.tempMoveSpeed;
        this.animateSpeed = this.properties.animateSpeed;

        if(game.keyState[37] || game.keyState[65] || game.keyState[39] || game.keyState[68] || game.keyState[38] || game.keyState[87] || game.keyState[40] || game.keyState[83]){
            this.action = 'walking';
        }

        if(game.keyState[16]){
            this.moveSpeed = this.tempMoveSpeed * 2;
            this.animateSpeed = this.properties.animateSpeed * 2;
        }

        let orientationBuilder:string[] = [];

        if(game.keyState[37] || game.keyState[65]){
            orientationBuilder.push('left');
        }
        if(game.keyState[39] || game.keyState[68]){
            orientationBuilder.push('right');
        }
        if(game.keyState[38] || game.keyState[87]){
            orientationBuilder.push('back');
        }
        if(game.keyState[40] || game.keyState[83]){
            orientationBuilder.push('front');
        }

        if(orientationBuilder.length > 0) this.direction = orientationBuilder;

        this.properties.xPosDraw = game.level.topLeftCornerPosX + Math.round(this.properties.xPos * game.blockLength);
        this.properties.yPosDraw = game.level.topLeftCornerPosY + Math.round(this.properties.yPos * game.blockLength);

        if(this.direction[0]) this.orientation = this.direction[0];
        
        switch(this.action){
            case 'normal':
                this.frameIndex = eval('this.orientationFrames.'+this.orientation+'Still');
                this.frameCount = 0;
                break;
            case 'walking':
                this.frameIndex = Math.floor(this.frameCount * this.animateSpeed) % this.properties.totalFrames;
                let totalFramesTemp = eval('this.orientationFrames.'+this.orientation+'[1] - this.orientationFrames.'+this.orientation+'[0] + 1');
                let startingFrame = eval('this.orientationFrames.'+this.orientation+'[0]');
                this.frameIndex = startingFrame + this.frameIndex % totalFramesTemp;
                this.frameCount++;

                this.isCollide(game);

                if(this.direction.indexOf('left') !== -1){
                    this.properties.xPos = Math.floor((this.properties.xPos*game.blockLength) - this.moveSpeed)/game.blockLength; 
                }
                else if(this.direction.indexOf('right') !== -1){
                    this.properties.xPos = Math.floor((this.properties.xPos*game.blockLength) + this.moveSpeed)/game.blockLength; 
                }
                if(this.direction.indexOf('back') !== -1){
                    this.properties.yPos = Math.floor((this.properties.yPos*game.blockLength) - this.moveSpeed)/game.blockLength; 
                }
                else if(this.direction.indexOf('front') !== -1){
                    this.properties.yPos = Math.floor((this.properties.yPos*game.blockLength) + this.moveSpeed)/game.blockLength; 
                }

                break;
        }
        
        this.frameStartX = (this.frameIndex % this.properties.framesPerRow) * this.properties.width;
        this.frameStartY = (Math.floor(this.frameIndex / this.properties.framesPerRow) % this.rows) * this.properties.height;

        game.ctx.drawImage(this.img,this.frameStartX,this.frameStartY,this.properties.width,this.properties.height,this.properties.xPosDraw,this.properties.yPosDraw,this.properties.width,this.properties.height);
        
        if(game.hitboxVisible) this.drawHitBox(game);
    }
}