import {Sprite} from './Sprite';
import {Player} from './Player';
import { Game } from './Game';

interface Entity {
    item: string;
    itemImg: HTMLImageElement;
    position: number[][];
}

export class Level {
    width : number = 0;
    height:  number = 0;
    blockWidth : number = 0;
    blockHeight: number = 0;
    topLeftCornerPosX : number = 0;
    topLeftCornerPosY : number = 0;
    floorSrc: string;
    entities: Entity[] = [];

    floorImg: HTMLImageElement;

    private xPosOffset : number = 0;
    private yPosOffset : number = 0;

    private sprites : Sprite[] = [];
    private player? : Player;

    constructor(game:Game,blockWidth:number,blockHeight:number,floor:string,playerPos:number[],entities:Entity[]){
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.width = blockWidth * game.blockLength;
        this.height = blockHeight * game.blockLength;

        this.floorSrc = floor;
        this.entities = entities;

        if(this.floorSrc){
            this.floorImg = new Image();
            this.floorImg.src = "res/"+this.floorSrc;
        }

        let playerPosTemp = playerPos;

        let applePlayer:Player;
        switch(document.querySelector("input[name=player]:checked").getAttribute("value")){
            case "player1":
                applePlayer = new Player(
                    playerPosTemp[0],playerPosTemp[1],
                    48,48,
                    'res/apple4.png',
                    16,4,1/12,'front','normal',0,
                    {
                        front:[0,3],left:[4,7],right:[8,11],back:[12,15],
                        frontStill:0,leftStill:5,rightStill:9,backStill:12
                    }
                );
                break;
            case "player2":
                    applePlayer = new Player(
                    playerPosTemp[0],playerPosTemp[1],
                    32,32,
                    'res/apple5.png',
                    20,5,1/12,'front','normal',0,
                    {
                        front:[1,4],left:[11,14],right:[16,19],back:[6,9],
                        frontStill:0,leftStill:10,rightStill:15,backStill:5
                    }
                );
                break;
            case "player3":
                applePlayer = new Player(
                    playerPosTemp[0],playerPosTemp[1],
                    32,32,
                    'res/apple6.png',
                    16,4,1/12,'front','normal',0,
                    {
                        front:[0,3],left:[4,7],right:[8,11],back:[12,15],
                        frontStill:0,leftStill:5,rightStill:9,backStill:12
                    }
                );
                break;
        }

        this.entities.forEach(function(entity){
            if(entity.item){
                entity.itemImg = new Image();
                entity.itemImg.src = "res/"+entity.item;
            }
        });

        this.setPlayer(applePlayer);

        this.resetTopCorner(game);

        this.setOffset(this.blockWidth * game.blockLength / 2,this.blockHeight * game.blockLength / 2);
    }

    resetTopCorner(game:Game){
        this.topLeftCornerPosX = Math.floor(game.canvas.width/2 - this.width/2);
        this.topLeftCornerPosY = Math.floor(game.canvas.height/2 - this.height/2);
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
            this.topLeftCornerPosX,
            this.topLeftCornerPosY,
            this.width,this.height
        );

        let thisLevel = this;

        // draw grass
        for(let i = 0; i < this.blockWidth; i++){
            for(let j = 0; j < this.blockHeight; j++){
                game.ctx.drawImage(
                    this.floorImg,
                    this.topLeftCornerPosX + i * game.blockLength,
                    this.topLeftCornerPosY + j * game.blockLength,
                    game.blockLength,game.blockLength
                );
            }
        }

        this.entities.forEach(function(entity){
            entity.position.forEach(function(position){
                game.ctx.drawImage(
                    entity.itemImg,
                    thisLevel.topLeftCornerPosX + position[0] * game.blockLength,
                    thisLevel.topLeftCornerPosY + position[1] * game.blockLength,
                    game.blockLength,game.blockLength
                );
            })
        });
    }
}