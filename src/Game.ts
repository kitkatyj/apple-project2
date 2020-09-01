import {Level} from './Level';

export interface ImageMap {
    src: string;
    img: HTMLImageElement;
}

export class Game {
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    fps: number = 0;
    hitboxVisible:boolean = false;
    frameCount : number = 0;
    blockLength : number = 32;
    
    keyState : boolean[] = [];
    keyUpState : boolean[] = [];

    seedFunction : Function;

    level : Level;
    private images : ImageMap[] = [];

    context : AudioContext;
    // bufferLoader : BufferLoader;

    constructor(canvas:HTMLCanvasElement,seedFunction:Function){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.seedFunction = seedFunction;

        let thisGame = this;

        //@ts-ignore
        // this.context = new (window.AudioContext || window.webkitAudioContext)();
        // let thisContext = this.context
        // this.bufferLoader = new BufferLoader(
        //     thisContext,
        //     [
        //         'audio/grass1.mp3'
        //     ]
        // )

        // this.bufferLoader.load();

        setInterval(function(){
            thisGame.fps = thisGame.frameCount;
            thisGame.frameCount = 0;
        },1000);

        document.addEventListener("keydown",function(e){
            if(e.ctrlKey || e.altKey || e.metaKey || document.activeElement === document.getElementById("seedInput")){
                return false;
            }

            thisGame.keyState[e.keyCode || e.which] = true;

            // thisGame.bufferLoader.playSound(thisGame.bufferLoader.bufferList[0]);
        });

        document.addEventListener("keyup",function(e){
            thisGame.keyUpState[e.keyCode || e.which] = true;
            thisGame.keyState[e.keyCode || e.which] = false;
        });
        
        this.loadCommonImages();
    }

    loadLevel(seed:string){
        let xhr = new XMLHttpRequest();
        xhr.open('GET',"levels/a1.json",true);
        xhr.send();

        let thisGame = this;

        xhr.addEventListener("readystatechange",function(e){
            if (xhr.readyState == 4 && xhr.status == 200) {
                let lvl = JSON.parse(xhr.responseText);
                
                thisGame.level = new Level(
                    thisGame,
                    lvl.width,
                    lvl.height,
                    lvl.floor,
                    lvl.playerPos,
                    lvl.characters,
                    lvl.entities,
                    seed
                );
            }
        });
    }

    loadCommonImages(){
        let bubbleImg = new Image();
        bubbleImg.src = 'res/speech.png';

        this.images.push({src:'speech.png',img:bubbleImg});
    }

    loadImageMap(){
        return this.images;
    }
}

// class BufferLoader {
//     context : AudioContext;
//     urlList : string[] = [];
//     onload : Function;
//     bufferList : AudioBuffer[] = [];
//     loadCount : number = 0;

//     constructor(context:AudioContext,urlList:string[],callback?:Function){
//         this.context = context;
//         this.urlList = urlList;
//         this.onload = callback;
//     }

//     loadBuffer(url:string, index:number){
//         let request = new XMLHttpRequest();
//         request.open("GET",url,true);
//         request.responseType = "arraybuffer";

//         let loader = this;

//         request.onload = function(){
//             loader.context.decodeAudioData(
//                 request.response,
//                 function(buffer){
//                     if(!buffer){
//                         alert('error decoding file data: ' + url);
//                         return;
//                     }
//                     loader.bufferList[index] = buffer;
//                     if (++loader.loadCount == loader.urlList.length)
//                         loader.onload(loader.bufferList);
//                 },
//                 function(error){
//                     console.error('decodeAudioData error', error);
//                 }
//             );
//         }

//         request.onerror = function(){
//             console.error('BufferLoader: XHR error');
//         }

//         request.send();
//     }

//     load(){
//         for(let i = 0; i < this.urlList.length; ++i){
//             this.loadBuffer(this.urlList[i],i);
//         }
//     }

//     playSound(buffer:AudioBuffer){
//         var source = this.context.createBufferSource();
//         source.buffer = buffer;

//         source.connect(this.context.destination);
//         source.start(0);
//     }
// }