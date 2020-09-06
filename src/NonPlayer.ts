import { Character, OrientationFrames } from "./Character";
import { SpriteProperties, Entity } from "./Entity";
import { ImageMap, Game } from "./Game";
import { Dialogue } from "./Dialogue";

export class NonPlayer extends Character {

    dialogue : Dialogue;

    constructor(properties:SpriteProperties,direction:string[],action:string,frameCount:number,orientationFrames:OrientationFrames,imageMap:ImageMap[],dialogues:string[],dialogueSoundSrc?:string){
        super(properties,direction,action,frameCount,orientationFrames,imageMap);

        this.dialogue = new Dialogue(dialogues,imageMap,dialogueSoundSrc);
    }

    draw(game:Game){
        this.setPosDraw(game);

        this.setDirection(game);
        
        this.setFrameStart();
        this.drawShadow(game);

        game.ctx.drawImage(this.img,this.frameStartX,this.frameStartY,this.properties.width,this.properties.height,this.properties.xPosDraw,this.properties.yPosDraw,this.properties.width,this.properties.height);
        
        if(this.dialogue.dialogues.length > 0) this.dialogue.drawDialogueBubble(game,this);
        if(game.hitboxVisible) this.drawHitBox(game);
    }
}