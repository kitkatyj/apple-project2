import {Entity} from './Entity';
import {Character} from './Character';
import { Game } from './Game';
import { Player } from './Player';
import { NonPlayer } from './NonPlayer';
import { DialogueBox } from './DialogueBox';

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

    private entities : EntityMap;
    private player? : Character;

    seed : string;
    seedGen : Function;

    dialogueBox : DialogueBox;

    constructor(game:Game,blockWidth:number,blockHeight:number,floor:string,playerPos:number[],characters:any[],entities:any[],seed:string){
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.width = blockWidth * game.blockLength;
        this.height = blockHeight * game.blockLength;

        this.floorSrc = floor;

        if(this.floorSrc){
            this.floorImg = new Image();
            this.floorImg.src = "res/"+this.floorSrc;
        }

        let sounds = [
            {src:"grass1.ogg",id:"walk1"},
            {src:"grass2.ogg",id:"walk2"},
            {src:"grass3.ogg",id:"walk3"},
            {src:"grass4.ogg",id:"walk4"},
            {src:"clem_blip.ogg",id:"clem_blip"}
        ]

        game.createjs.Sound.registerSounds(sounds,'audio/');

        this.entities = {bottom:[],solid:[],ground:[],top:[]};

        this.seed = seed;
        this.seedGen = game.seedFunction(this.seed);

        this.dialogueBox = new DialogueBox();

        let level = this;

        let playerPosTemp = playerPos;

        let applePlayer:Player;

        applePlayer = new Player({
                xPos:playerPosTemp[0],
                yPos:playerPosTemp[1],
                width:32,
                height:32,
                src:'res/apple320.png',
                totalFrames:40,
                framesPerRow:10,
                animateSpeed:1/12
            }
            ,['front'],'normal',0,
            {
                front:{
                    normal:0,
                    walking:[1,4],
                    running:[5,9]
                },
                back:{
                    normal:10,
                    walking:[11,14],
                    running:[15,19]
                },
                left:{
                    normal:20,
                    walking:[21,24],
                    running:[25,29]
                },
                right:{
                    normal:30,
                    walking:[31,34],
                    running:[35,39]
                }
            },
            game.loadImageMap()
        );

        let levelMap:boolean[][] = [];

        for(let i = 0; i < level.blockHeight; i++){
            levelMap[i] = [];
            for(let j = 0; j < level.blockWidth; j++){
                levelMap[i][j] = false;
            }
        }

        this.setPlayer(applePlayer);
        levelMap[playerPos[0]][playerPos[1]] = true;

        characters.forEach(function(char){
            char.position.forEach(function(pos){
                if(char.name === "clementine"){
                    let npClementine:NonPlayer;

                    npClementine = new NonPlayer({
                        src: 'res/clem.png',
                        xPos: pos[0],
                        yPos: pos[1],
                        width: char.width,
                        height: char.height,
                        totalFrames:20,
                        framesPerRow:5,
                        animateSpeed:1/12
                    },[char.direction],'normal',0,
                    {
                        front:{
                            normal:0,
                            walking:[1,4]
                        },
                        back:{
                            normal:5,
                            walking:[6,9]
                        },
                        left:{
                            normal:10,
                            walking:[11,14]
                        },
                        right:{
                            normal:15,
                            walking:[16,19]
                        }
                    },game.loadImageMap(),char.dialogue,char.dialogueSoundSrc);

                    level.setCharacter(npClementine);
                }
                else {
                    let charTemp = new Character({
                        src: 'res/'+char.src,
                        xPos: pos[0],
                        yPos: pos[1],
                        width: char.width,
                        height: char.height,
                        totalFrames: char.totalFrames,
                        framesPerRow: char.framesPerRow,
                        animateSpeed: char.animateSpeed
                    },['front'],'normal',0,{
                        front:{
                            normal:0,
                            walking:[1,4]
                        },
                        back:{
                            normal:5,
                            walking:[6,9]
                        },
                        left:{
                            normal:10,
                            walking:[11,14]
                        },
                        right:{
                            normal:15,
                            walking:[16,19]
                        }
                    },game.loadImageMap());

                    level.setCharacter(charTemp);
                }
            });
        });      

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
                    },
                    game.loadImageMap());
    
                    level.addEntity(entity,entityTemp.layer);
                })
            }
            // render based on random seed and threshold
            else if (entityTemp.position === 'random') {
                let entityQty = Math.round(level.blockHeight * level.blockWidth * entityTemp.threshold);
                
                for(let i = 0; i < entityQty; i++){
                    let pos = level.randomPos();

                    while(levelMap[pos[0]][pos[1]]){
                        pos = level.randomPos();
                    }

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
                    },
                    game.loadImageMap());
    
                    level.addEntity(entity,entityTemp.layer);
                }
            }
        });

        this.focusOnPlayer(game);
        this.dialogueBox.reset(game);

        // console.log(game);
    }

    randomPos(){
        let posArray = [Math.floor(this.seedGen()*this.blockWidth), Math.floor(this.seedGen()*this.blockHeight)];

        return posArray;
    }

    focusOnPlayer(game:Game){
        if((game.canvas.width/2 - game.blockLength/2) % 1 === 0){
            this.topLeftCornerPosX = Math.round(game.canvas.width/2 - this.player.properties.xPos * game.blockLength - game.blockLength/2);
        }
        else {
            this.topLeftCornerPosX = Math.floor(game.canvas.width/2 - this.player.properties.xPos * game.blockLength - game.blockLength/2);
        }

        if((game.canvas.height/2 - game.blockLength/2) % 1 === 0){
            this.topLeftCornerPosY = Math.round(game.canvas.height/2 - this.player.properties.yPos * game.blockLength - game.blockLength/2);
        }
        else {
            this.topLeftCornerPosY = Math.floor(game.canvas.height/2 - this.player.properties.yPos * game.blockLength - game.blockLength/2);
        }
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

    setCharacter(charObj:Character){
        this.addEntity(charObj,'ground');
    }

    setPlayer(playerObj:Player){
        this.player = playerObj;
        this.addEntity(playerObj,'ground');
    }

    getPlayer():Player{
        return this.player;
    }

    withinWindowBounds(game:Game,posX:number,posY:number):boolean{
        return -this.topLeftCornerPosX - game.blockLength < posX * game.blockLength && posX * game.blockLength < -this.topLeftCornerPosX + game.canvas.width &&
        -this.topLeftCornerPosY - game.blockLength < posY * game.blockLength && posY * game.blockLength < -this.topLeftCornerPosY + game.canvas.height;
    }

    imageValid(img:HTMLImageElement):boolean{
        return img.height != 0;
    }

    drawRoundRect(ctx:CanvasRenderingContext2D, x:number, y:number, width:number, height:number, radius:number) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
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
                if(this.withinWindowBounds(game,i,j)){
                    game.ctx.drawImage(
                        this.floorImg,
                        this.topLeftCornerPosX + i * game.blockLength,
                        this.topLeftCornerPosY + j * game.blockLength,
                        game.blockLength,game.blockLength
                    );
                }
            }
        }

        let thisLevel = this;

        // draw bottom and solid entities
        this.entities.solid.forEach(function(entity){
            if(thisLevel.withinWindowBounds(game,entity.properties.xPos,entity.properties.yPos) && thisLevel.imageValid(entity.img)) entity.draw(game);
        });
        this.entities.bottom.forEach(function(entity){
            if(thisLevel.withinWindowBounds(game,entity.properties.xPos,entity.properties.yPos) && thisLevel.imageValid(entity.img)) entity.draw(game);
        });

        // draw ground entities based on yIndex
        for(let yIndex = 0; yIndex < this.height; yIndex++){
            this.entities.ground.forEach(function(entity){
                if(Math.ceil(entity.properties.yPos) == yIndex && thisLevel.withinWindowBounds(game,entity.properties.xPos,entity.properties.yPos) && thisLevel.imageValid(entity.img)){
                    entity.draw(game);
                }
            });
        }

        // draw dialogue box if text inside
        if(this.dialogueBox.text.length > 0){
            // console.log(this.dialogueBox);
            this.dialogueBox.draw(game);
        }
        
        // restrict within center 3x3 grid
        if(this.topLeftCornerPosX + Math.round(this.player.properties.xPos * game.blockLength) + game.blockLength/2 >= game.canvas.width*2/3){
            this.topLeftCornerPosX = this.topLeftCornerPosX-this.player.moveSpeed;
        }
        else if(this.topLeftCornerPosX + Math.round(this.player.properties.xPos * game.blockLength) + game.blockLength/2 <= game.canvas.width/3){
            this.topLeftCornerPosX = this.topLeftCornerPosX+this.player.moveSpeed;
        }

        if(this.topLeftCornerPosY + Math.round(this.player.properties.yPos * game.blockLength) + game.blockLength/2 >= game.canvas.height*2/3){
            this.topLeftCornerPosY = this.topLeftCornerPosY-this.player.moveSpeed;
        }
        else if(this.topLeftCornerPosY + Math.round(this.player.properties.yPos * game.blockLength) + game.blockLength/2 < game.canvas.height/3){
            this.topLeftCornerPosY = this.topLeftCornerPosY+this.player.moveSpeed;
        }

        // console.log(game.keyUpState);

        game.keyUpState = [];
    }
}