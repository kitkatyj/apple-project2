import {Sprite} from './Sprite';
import {Player} from './Player';
import { Game } from './Game';

interface Entity {
    item: string;
    position: any;
}

export class Level {
    width : number = 0;
    height:  number = 0;
    blockWidth : number = 0;
    blockHeight: number = 0;
    topLeftCornerPosX : number = 0;
    topLeftCornerPosY : number = 0;
    floor: string;
    entities: Entity[] = [];

    private xPosOffset : number = 0;
    private yPosOffset : number = 0;

    private sprites : Sprite[] = [];
    private player? : Player;

    constructor(game:Game,blockWidth:number,blockHeight:number,floor:string,entities?:Entity[]){
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.width = blockWidth * game.blockLength;
        this.height = blockHeight * game.blockLength;

        this.floor = floor;
        this.entities = entities;

        this.resetTopCorner(game);

        this.setOffset(this.blockWidth * game.blockLength / 2,this.blockHeight * game.blockLength / 2);
    }

    resetTopCorner(game:Game){
        this.topLeftCornerPosX = game.canvas.width/2 - this.width/2;
        this.topLeftCornerPosY = game.canvas.height/2 - this.height/2;
    }

    addSprite(sprite:Sprite){
        this.sprites.push(sprite);
    }

    getSprites(){
        return this.sprites;
    }

    setPlayer(playerObj:Player){
        this.player = playerObj;
        this.addSprite(playerObj);
    }

    getPlayer():Player{
        return this.player;
    }

    setOffset(xPosOffset:number,yPosOffset:number){
        this.xPosOffset = xPosOffset;
        this.yPosOffset = yPosOffset;
    }

    getOffset(){
        return [this.xPosOffset,this.yPosOffset];
    }

    incrementXOffset(increment:number){
        this.xPosOffset + increment;
    }

    incrementYOffset(increment:number){
        this.yPosOffset + increment;
    }

    draw(game:Game){
        game.ctx.fillStyle = '#000';
        game.ctx.fillRect(
            game.canvas.width/2 - this.xPosOffset,
            game.canvas.height/2 - this.yPosOffset,
            this.width,this.height
        );
    }
}