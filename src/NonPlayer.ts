import { Character, OrientationFrames } from "./Character";
import { SpriteProperties, Entity } from "./Entity";
import { ImageMap, Game } from "./Game";

export class NonPlayer extends Character {

    dialogues : string[] = [];

    bubbleImg : HTMLImageElement;

    bubbleFrameCount : number = 0;

    constructor(properties:SpriteProperties,direction:string[],action:string,frameCount:number,orientationFrames:OrientationFrames,imageMap:ImageMap[],dialogues:string[]){
        super(properties,direction,action,frameCount,orientationFrames,imageMap);

        this.dialogues = dialogues;

        let thisNp = this;

        imageMap.forEach(function(img){
            if(img.src === 'speech.png'){
                thisNp.bubbleImg = img.img;
            }
        });
    }

    checkDialogueOk(game:Game):boolean{
        let talkingDistance = 1;
        let talkingWidth = 1;

        let isDialogueOk = false;
        let playerXPos = game.level.getPlayer().properties.xPos;
        let playerYPos = game.level.getPlayer().properties.yPos;

        if(this.direction.indexOf('left') !== -1 ){
            if(
                this.properties.xPos-talkingDistance < playerXPos && playerXPos < this.properties.xPos &&
                this.properties.yPos-talkingWidth < playerYPos && playerYPos < this.properties.yPos+talkingWidth
            ){
                isDialogueOk = true;
            }
        }
        if(this.direction.indexOf('right') !== -1 ){
            if(
                this.properties.xPos < playerXPos && playerXPos < this.properties.xPos+talkingDistance &&
                this.properties.yPos-talkingWidth < playerYPos && playerYPos < this.properties.yPos+talkingWidth
            ){
                isDialogueOk = true;
            }
        }
        if(this.direction.indexOf('front') !== -1 ){
            if(
                this.properties.xPos-talkingWidth < playerXPos && playerXPos < this.properties.xPos+talkingWidth &&
                this.properties.yPos < playerYPos && playerYPos < this.properties.yPos+talkingDistance
            ){
                isDialogueOk = true;
            }
        }
        if(this.direction.indexOf('back') !== -1 ){
            if(
                this.properties.xPos-talkingWidth < playerXPos && playerXPos < this.properties.xPos+talkingWidth &&
                this.properties.yPos-talkingDistance < playerYPos && playerYPos < this.properties.yPos
            ){
                isDialogueOk = true;
            }
        }

        return isDialogueOk;
    }

    drawDialogueBubble(game:Game){
        let frameIndex = Math.floor(this.bubbleFrameCount * 1/12) % 4;
        let frameStartX = frameIndex * game.blockLength;

        this.bubbleFrameCount++;

        if(!this.checkDialogueOk(game)) game.ctx.globalAlpha = 0.5;
        game.ctx.drawImage(this.bubbleImg,frameStartX,0,game.blockLength,game.blockLength,this.properties.xPosDraw,this.properties.yPosDraw-this.properties.height,game.blockLength,game.blockLength);
        if(!this.checkDialogueOk(game)) game.ctx.globalAlpha = 1;
    }

    draw(game:Game){
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

        this.drawShadow(game);

        game.ctx.drawImage(this.img,this.frameStartX,this.frameStartY,this.properties.width,this.properties.height,this.properties.xPosDraw,this.properties.yPosDraw,this.properties.width,this.properties.height);
        
        if(this.dialogues.length > 0) this.drawDialogueBubble(game);
        if(game.hitboxVisible) this.drawHitBox(game);
    }
}