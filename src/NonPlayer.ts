import { Character, OrientationFrames } from "./Character";
import { SpriteProperties } from "./Entity";
import { ImageMap, Game } from "./Game";

export class NonPlayer extends Character {
    constructor(properties:SpriteProperties,direction:string[],action:string,frameCount:number,orientationFrames:OrientationFrames,imageMap:ImageMap[]){
        super(properties,direction,action,frameCount,orientationFrames,imageMap);
    }

    
}