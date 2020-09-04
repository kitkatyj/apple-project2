import { Character, OrientationFrames } from "./Character";
import { SpriteProperties } from "./Entity";
import { ImageMap, Game } from "./Game";

export class Player extends Character {
    constructor(properties:SpriteProperties,direction:string[],action:string,frameCount:number,orientationFrames:OrientationFrames,imageMap:ImageMap[]){
        super(properties,direction,action,frameCount,orientationFrames,imageMap);
    }

    draw(game:Game){
        this.action = 'normal';

        this.moveSpeed = this.tempMoveSpeed;
        this.animateSpeed = this.properties.animateSpeed;

        if(game.level.dialogueBox.text.length === 0){
            if(game.keyState[37] || game.keyState[65] || game.keyState[39] || game.keyState[68] || game.keyState[38] || game.keyState[87] || game.keyState[40] || game.keyState[83]){
                if(game.keyState[16]){
                    this.moveSpeed = this.tempMoveSpeed * 2;
                    this.animateSpeed = this.properties.animateSpeed * 2;
                    this.action = 'running';
                }
                else {
                    this.action = 'walking';
                }
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
        }

        this.setPosDraw(game);

        this.setDirection(game);

        if(this.sound) this.soundTick++;

        let stepTicks = 30;
        let stepVolume = 0.1;
        if(this.action == "running") {stepTicks = 20; stepVolume = 0.2;}

        if(
            (this.sound == undefined ||  this.soundTick >= stepTicks * (0.8 + Math.random() * 0.2)) 
            && (this.action == "walking" || this.action == "running") 
            && this.direction.length > 0
        ){
            let walkSounds = ['walk1','walk2','walk3','walk4'];
            this.sound = game.createjs.Sound.play( walkSounds[Math.floor(Math.random() * walkSounds.length)] );
            this.sound.volume = stepVolume * (0.5 + Math.random() * 0.5);
            this.soundTick = 0;
        }
        
        this.setFrameStart();
        this.drawShadow(game);
        
        game.ctx.drawImage(this.img,this.frameStartX,this.frameStartY,this.properties.width,this.properties.height,this.properties.xPosDraw,this.properties.yPosDraw,this.properties.width,this.properties.height);
        
        if(game.hitboxVisible) this.drawHitBox(game);
    }
}