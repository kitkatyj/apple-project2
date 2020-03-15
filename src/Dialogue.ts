import { ImageMap, Game } from "./Game";
import { NonPlayer } from "./NonPlayer";

export class Dialogue {
    dialogues : string[] = [];
    bubbleImg : HTMLImageElement;
    bubbleFrameCount : number = 0;

    constructor(dialogues:string[],imageMap:ImageMap[]){
        this.dialogues = dialogues;

        let thisDialogue = this;

        imageMap.forEach(function(img){
            if(img.src === 'speech.png'){
                thisDialogue.bubbleImg = img.img;
            }
        });
    }

    checkDialogueOk(game:Game,nonPlayer:NonPlayer):boolean{
        let talkingDistance = 1;
        let talkingWidth = 1;

        let isDialogueOk = false;
        let playerXPos = game.level.getPlayer().properties.xPos;
        let playerYPos = game.level.getPlayer().properties.yPos;

        if(nonPlayer.direction.indexOf('left') !== -1 ){
            if(
                nonPlayer.properties.xPos-1-talkingDistance < playerXPos && playerXPos < nonPlayer.properties.xPos &&
                nonPlayer.properties.yPos-talkingWidth < playerYPos && playerYPos < nonPlayer.properties.yPos+talkingWidth
            ){
                isDialogueOk = true;
            }
        }
        if(nonPlayer.direction.indexOf('right') !== -1 ){
            if(
                nonPlayer.properties.xPos < playerXPos && playerXPos < nonPlayer.properties.xPos+talkingDistance+1 &&
                nonPlayer.properties.yPos-talkingWidth < playerYPos && playerYPos < nonPlayer.properties.yPos+talkingWidth
            ){
                isDialogueOk = true;
            }
        }
        if(nonPlayer.direction.indexOf('front') !== -1 ){
            if(
                nonPlayer.properties.xPos-talkingWidth < playerXPos && playerXPos < nonPlayer.properties.xPos+talkingWidth &&
                nonPlayer.properties.yPos < playerYPos && playerYPos < nonPlayer.properties.yPos+talkingDistance
            ){
                isDialogueOk = true;
            }
        }
        if(nonPlayer.direction.indexOf('back') !== -1 ){
            if(
                nonPlayer.properties.xPos-talkingWidth < playerXPos && playerXPos < nonPlayer.properties.xPos+talkingWidth &&
                nonPlayer.properties.yPos-talkingDistance < playerYPos && playerYPos < nonPlayer.properties.yPos
            ){
                isDialogueOk = true;
            }
        }

        return isDialogueOk;
    }

    drawDialogueBubble(game:Game,nonPlayer:NonPlayer){
        let frameIndex = Math.floor(this.bubbleFrameCount * 1/12) % 4;
        let frameStartX = frameIndex * game.blockLength;

        this.bubbleFrameCount++;

        if(!this.checkDialogueOk(game,nonPlayer)) game.ctx.globalAlpha = 0.5;
        game.ctx.drawImage(this.bubbleImg,frameStartX,0,game.blockLength,game.blockLength,nonPlayer.properties.xPosDraw,nonPlayer.properties.yPosDraw-nonPlayer.properties.height,game.blockLength,game.blockLength);
        if(!this.checkDialogueOk(game,nonPlayer)) game.ctx.globalAlpha = 1;
    }
}