import {Sprite} from './Sprite';
import {Player} from './Player';

export class Game {
    ctx : CanvasRenderingContext2D;
    frameCount : number = 0;

    private sprites : Sprite[] = [];
    private player? : Player;

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
}