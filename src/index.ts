import {Game} from './Game';
import {Player} from './Player';

let game:Game = null;
let canvas,mainBody,resizeTimer,debug = null;
let paintBgColor = "#200040";
let frameCounter:boolean = false;
let debugVisible:boolean = false;
let pixelFactor = 3;

export function gameInit(){
    console.log("Ready!");
    document.getElementById("ph").remove();

    canvas = document.createElement("canvas");
    mainBody = document.getElementsByTagName("body")[0];
    debug = document.getElementById("debug");

    mainBody.style.margin = "0";
    mainBody.appendChild(canvas);

    canvasSizeReset();

    document.getElementById("choices").style.display = "block";

    loadGame();

    document.querySelectorAll("input[name=player]").forEach(function(choice){
        choice.addEventListener("change",loadGame);
    })

    window.addEventListener("resize",function(e){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(canvasSizeReset,250);
    });

    window.requestAnimationFrame(draw);
}

function loadGame(){
    let applePlayer:Player;
    switch(document.querySelector("input[name=player]:checked").getAttribute("value")){
        case "player1":
            applePlayer = new Player(
                4,4,
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
                4,4,
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
                4,4,
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
    game = new Game(canvas,applePlayer);
}

function draw(){    
    game.ctx.clearRect(0,0,canvas.width,canvas.height);
    paintBg(paintBgColor);

    if(frameCounter){
        game.ctx.font = "bold 16px Courier New";
        game.ctx.textAlign = "right";
        game.ctx.fillStyle = "white";
        game.ctx.fillText(game.fps.toString(),canvas.width,16);
        game.frameCount++;
        // console.log(game.frameCount);
    }

    game.level?.draw(game);

    game.level?.getSprites().forEach(function(sprite){
        sprite.draw(game);
    });

    if(game.level && debugVisible){
        debug.innerHTML = debugStatement();
    }

    window.requestAnimationFrame(draw);
}

function debugStatement(){
    let debug = "";

    debug += "xPos : "+game.level.getPlayer().xPos + "<br>";
    debug += "yPos : "+game.level.getPlayer().yPos + "<br>";
    debug += "xPosDraw : "+game.level.getPlayer().xPosDraw + "<br>";
    debug += "yPosDraw : "+game.level.getPlayer().yPosDraw + "<br>";
    debug += "frameIndex : "+game.level.getPlayer().frameIndex + "<br>";
    debug += "width : "+game.level.width + "<br>";
    debug += "height : "+game.level.height + "<br>";
    debug += "blockWidth : "+game.level.blockWidth + "<br>";
    debug += "blockHeight : "+game.level.blockHeight + "<br>";
    debug += "topLeftCornerPosX : "+game.level.topLeftCornerPosX + "<br>";
    debug += "topLeftCornerPosY : "+game.level.topLeftCornerPosY + "<br>";
    debug += "levelOffset : "+game.level.getOffset() + "<br>";
 
    return debug;
}

function canvasSizeReset(){
    canvas.width = window.innerWidth/pixelFactor;
    canvas.height = window.innerHeight/pixelFactor;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    if(game){
        game.level.resetTopCorner(game);
    }
}

function paintBg(color){
    game.ctx.beginPath();
    game.ctx.rect(0,0,canvas.width,canvas.height);
    game.ctx.fillStyle = color;
    game.ctx.fill();
}

// window.onload = gameInit;