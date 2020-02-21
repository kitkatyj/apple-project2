import {Game, ImageMap} from './Game';
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

interface Hitbox {
    xPos : number;
    yPos : number;
    width: number;
    height: number;
}

export class Player extends Entity {
    direction : string[] = ['front',null];
    orientation : string = 'front';
    action : string = 'normal';
    frameCount : number;
    orientationFrames : OrientationFrames;
    tempMoveSpeed : number = 1;
    moveSpeed : number;
    animateSpeed : number;

    hitbox : Hitbox;

    constructor(properties:SpriteProperties,orientation:string[],action:string,frameCount:number,orientationFrames:OrientationFrames,imageMap:ImageMap[]){
        super(properties,imageMap);

        this.direction = orientation;
        this.action = action;
        this.frameCount = frameCount;
        this.orientationFrames = orientationFrames;

        this.hitbox = {xPos: 11, yPos: 28, width:9, height:3}

        this.moveSpeed = this.tempMoveSpeed;
        this.animateSpeed = this.properties.animateSpeed;
    }

    isCollide(game:Game){
        let isCollide:boolean = false;

        let playerHB = {
            xPos:this.properties.xPos+(this.hitbox.xPos/game.blockLength),
            yPos:this.properties.yPos+(this.hitbox.yPos/game.blockLength),
            width:this.hitbox.width/game.blockLength,
            height:this.hitbox.height/game.blockLength
        };

        let playerOrient = this.direction;

        let playerMoveSpeed = this.moveSpeed;

        if(playerOrient.indexOf('left') !== -1 && playerHB.xPos - this.moveSpeed/game.blockLength < 0){
            playerOrient.splice(playerOrient.indexOf('left'),1);
        }
        else if(playerOrient.indexOf('right') !== -1  && playerHB.xPos + playerHB.width + this.moveSpeed/game.blockLength > game.level.blockWidth){
            playerOrient.splice(playerOrient.indexOf('right'),1);
        }
        else if(playerOrient.indexOf('front') !== -1  && this.properties.yPos + 1 + this.moveSpeed/game.blockLength > game.level.blockHeight){
            playerOrient.splice(playerOrient.indexOf('front'),1);
        }
        else if(playerOrient.indexOf('back') !== -1 && playerHB.yPos - this.moveSpeed/game.blockLength < 0){
            playerOrient.splice(playerOrient.indexOf('back'),1);
        }
        else {
            game.level.getEntities().solid.forEach(function(entity){
                let entityPos = {xPos:entity.properties.xPos,yPos:entity.properties.yPos}
                
                // can it move left or right if solid entity in the way
                if(playerHB.yPos + playerHB.height > entityPos.yPos && playerHB.yPos < entityPos.yPos + 1){
    
                    // console.log([playerOrient,[playerHB.xPos - 0.02,'<',entityPos.xPos + 1,playerHB.xPos - 0.02 < entityPos.xPos + 1]])
                    if(playerOrient.indexOf('left' ) !== -1 && playerHB.xPos - playerMoveSpeed/game.blockLength < entityPos.xPos + 1 && playerHB.xPos + playerHB.width > entityPos.xPos){
                        playerOrient.splice(playerOrient.indexOf('left'),1);
                    }
                    if(playerOrient.indexOf('right') !== -1  && playerHB.xPos + playerHB.width + playerMoveSpeed/game.blockLength > entityPos.xPos && playerHB.xPos < entityPos.xPos + 1){
                        playerOrient.splice(playerOrient.indexOf('right'),1);
                    }
                }
                // can it move up or down if solid entity in the way
                if(playerHB.xPos + playerHB.width > entityPos.xPos && playerHB.xPos < entityPos.xPos + 1){
                    if(playerOrient.indexOf('front') !== -1  && playerHB.yPos + playerHB.height + playerMoveSpeed/game.blockLength > entityPos.yPos && playerHB.yPos < entityPos.yPos + 1){
                        playerOrient.splice(playerOrient.indexOf('front'),1);
                    }
                    if(playerOrient.indexOf('back' ) !== -1 && playerHB.yPos - playerMoveSpeed/game.blockLength < entityPos.yPos + 1 && playerHB.yPos + playerHB.height > entityPos.yPos){
                        playerOrient.splice(playerOrient.indexOf('back'),1);
                    }
                }
            });
        }

        // return isCollide;
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
        if(game.hitboxVisible){
            game.ctx.fillStyle = "#ff0000";
            game.ctx.fillRect(
                game.level.topLeftCornerPosX+this.properties.xPos*game.blockLength+this.hitbox.xPos,
                game.level.topLeftCornerPosY+this.properties.yPos*game.blockLength+this.hitbox.yPos,
                this.hitbox.width,this.hitbox.height
            );
        }
    }
}