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
    xPosOffset : number;
    yPosOffset : number;
    floor: string;
    entities: Entity[] = [];

    private sprites : Sprite[] = [];
    private player? : Player;

    constructor(width:number,height:number,floor:string,entities?:Entity[]){
        this.width = width;
        this.height = height;
        this.floor = floor;
        this.entities = entities;
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

    draw(game:Game){
        // game.ctx.rect()
    }
}