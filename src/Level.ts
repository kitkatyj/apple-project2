import {Entity} from './Entity';
import {Player} from './Player';
import { Game } from './Game';

interface EntityMap {
    bottom : Entity[];
    solid: Entity[];
    ground: Entity[];
    top: Entity[];
}

export class Level {
    width : number = 0;
    height:  number = 0;
    blockWidth : number = 0;
    blockHeight: number = 0;
    topLeftCornerPosX : number = 0;
    topLeftCornerPosY : number = 0;
    floorSrc: string;

    floorImg: HTMLImageElement;

    private xPosOffset : number = 0;
    private yPosOffset : number = 0;

    private entities : EntityMap;
    private player? : Player;

    seed : string;
    seedGen : Function;

    constructor(game:Game,blockWidth:number,blockHeight:number,floor:string,playerPos:number[],entities:any[],seed:string){
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.width = blockWidth * game.blockLength;
        this.height = blockHeight * game.blockLength;

        this.floorSrc = floor;

        if(this.floorSrc){
            this.floorImg = new Image();
            this.floorImg.src = "res/"+this.floorSrc;
        }

        this.entities = {bottom:[],solid:[],ground:[],top:[]}

        this.seed = seed;
        this.seedGen = game.seedFunction(this.seed);

        let level = this;

        let playerPosTemp = playerPos;

        let applePlayer:Player;
        switch(document.querySelector("input[name=player]:checked").getAttribute("value")){
            case "player1":
                applePlayer = new Player({
                        xPos:playerPosTemp[0],
                        yPos:playerPosTemp[1],
                        width:48,
                        height:48,
                        src:'res/apple4.png',
                        totalFrames:16,
                        framesPerRow:4,
                        animateSpeed:1/12
                    }
                    ,'front','normal',0,
                    {
                        front:[0,3],left:[4,7],right:[8,11],back:[12,15],
                        frontStill:0,leftStill:5,rightStill:9,backStill:12
                    }
                );
                break;
            case "player2":
                    applePlayer = new Player({
                        xPos:playerPosTemp[0],
                        yPos:playerPosTemp[1],
                        src:'res/apple5.png',
                        totalFrames:20,
                        framesPerRow:5,
                        animateSpeed:1/12
                    },'front','normal',0,
                    {
                        front:[1,4],left:[11,14],right:[16,19],back:[6,9],
                        frontStill:0,leftStill:10,rightStill:15,backStill:5
                    }
                );
                break;
            case "player3":
                applePlayer = new Player({
                    xPos:playerPosTemp[0],
                    yPos:playerPosTemp[1],
                    src:'res/apple6.png',
                    totalFrames:16,
                    framesPerRow:4,
                    animateSpeed:1/12
                },'front','normal',0,
                    {
                        front:[0,3],left:[4,7],right:[8,11],back:[12,15],
                        frontStill:0,leftStill:5,rightStill:9,backStill:12
                    }
                );
                break;
        }

        let levelMap:boolean[][] = [];

        for(let i = 0; i < level.blockHeight; i++){
            levelMap[i] = [];
            for(let j = 0; j < level.blockWidth; j++){
                levelMap[i][j] = false;
            }
        }

        this.setPlayer(applePlayer);
        levelMap[playerPos[0]][playerPos[1]] = true;

        entities.forEach(function(entityTemp){
            // render based on set positions
            if(Array.isArray(entityTemp.position)){
                entityTemp.position.forEach(function(position){
                    let entity = new Entity({
                        src: 'res/'+entityTemp.src,
                        xPos: position[0],
                        yPos: position[1],
                        width: entityTemp.width,
                        height: entityTemp.height,
                        totalFrames: entityTemp.totalFrames,
                        framesPerRow: entityTemp.framesPerRow,
                        animateSpeed: entityTemp.animateSpeed
                    });
    
                    level.addEntity(entity,entityTemp.layer);
                })
            }
            // render based on random seed and threshold
            else if (entityTemp.position === 'random') {
                // console.log("seed: "+level.seed);

                let entityQty = Math.round(level.blockHeight * level.blockWidth * entityTemp.threshold);
                
                for(let i = 0; i < entityQty; i++){
                    let pos = level.randomPos();

                    while(levelMap[pos[0]][pos[1]]){
                        pos = level.randomPos();
                    }

                    // console.log(levelMap);

                    levelMap[pos[0]][pos[1]] = true;
                    
                    let entity = new Entity({
                        src: 'res/'+entityTemp.src,
                        xPos: pos[0],
                        yPos: pos[1],
                        width: entityTemp.width,
                        height: entityTemp.height,
                        totalFrames: entityTemp.totalFrames,
                        framesPerRow: entityTemp.framesPerRow,
                        animateSpeed: entityTemp.animateSpeed
                    });
    
                    level.addEntity(entity,entityTemp.layer);
                }
            }
        });

        // console.log(this.entities);

        this.resetTopCorner(game);

        this.setOffset(this.blockWidth * game.blockLength / 2,this.blockHeight * game.blockLength / 2);
    }

    randomPos(){
        let posArray = [Math.floor(this.seedGen()*this.blockWidth), Math.floor(this.seedGen()*this.blockHeight)];

        return posArray;
    }

    resetTopCorner(game:Game){
        this.topLeftCornerPosX = Math.floor(game.canvas.width/2 - this.width/2);
        this.topLeftCornerPosY = Math.floor(game.canvas.height/2 - this.height/2);
    }

    addEntity(entity:Entity,layer:string){
        switch(layer){
            case 'bottom': this.entities.bottom.push(entity); break;
            case 'solid': this.entities.solid.push(entity); break;
            case 'ground': this.entities.ground.push(entity); break;
            case 'top': this.entities.top.push(entity); break;
        }
    }

    getEntities(){
        return this.entities;
    }

    setPlayer(playerObj:Player){
        this.player = playerObj;
        this.addEntity(playerObj,'ground');
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
        // draw floor
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

        // draw bottom and solid entities
        this.entities.solid.forEach(function(entity){entity.draw(game);});
        this.entities.bottom.forEach(function(entity){entity.draw(game);});

        // draw ground entities based on yIndex
        for(let yIndex = 0; yIndex < this.height; yIndex++){
            this.entities.ground.forEach(function(entity){
                if(Math.ceil(entity.properties.yPos) == yIndex){
                    entity.draw(game);
                }
            });
        }        
    }
}