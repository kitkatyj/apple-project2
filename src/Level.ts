import {Sprite} from './Sprite';
import {Player} from './Player';
import { Game } from './Game';

interface Entity {
    item: string;
    position: any;
}

export class Level {
    width : number;
    height: number;
    floor: string;
    entities: Entity[] = [];

    private xPosOffset : number = 0;
    private yPosOffset : number = 0;

    private sprites : Sprite[] = [];
    private player? : Player;

    constructor(game:Game,width:number,height:number,floor:string,entities?:Entity[]){
        this.width = width;
        this.height = height;
        this.floor = floor;
        this.entities = entities;

        this.setOffset(this.width * game.blockLength / 2,this.height * game.blockLength / 2);
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
            game.blockLength * this.width,
            game.blockLength * this.height
        );
    }
}