import {Game} from './Game';

let game:Game = null;
let canvas,mainBody,resizeTimer,debug = null;
let paintBgColor = "#200040";
let frameCounter:boolean = false;
let debugVisible:boolean = false;
let pixelFactor = 3;
let seedFunction:Function;

export function gameInit(seedFunctionTemp:Function){

    console.log("Ready!");

    document.getElementById("ph").remove();

    canvas = document.createElement("canvas");
    mainBody = document.getElementsByTagName("body")[0];
    debug = document.getElementById("debug");
    seedFunction = seedFunctionTemp;

    mainBody.style.margin = "0";
    mainBody.appendChild(canvas);

    canvasSizeReset();

    document.getElementById("choices").style.display = "block";
    document.getElementById("seed").style.display = "block";

    if(localStorage.getItem("levelSeed")){
        document.getElementById("seedInput").setAttribute("value",localStorage.getItem("levelSeed"));
    }

    loadGame();

    document.querySelectorAll("input[name=player]").forEach(function(choice){
        choice.addEventListener("change",loadGame);
    });

    document.getElementById("seedBtn").addEventListener("click",loadGame);

    window.addEventListener("resize",function(e){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(canvasSizeReset,250);
    });

    window.requestAnimationFrame(draw);
}

function loadGame(){
    game = new Game(canvas,seedFunction);

    let seedInputValue = (<HTMLInputElement>document.getElementById("seedInput")).value;

    document.querySelectorAll("input[name=player]").forEach(function(choice){
        (<HTMLInputElement>choice).blur();
    });

    game.loadLevel(seedInputValue);
    localStorage.setItem("levelSeed",seedInputValue);
}

function draw(){    
    game.ctx.clearRect(0,0,canvas.width,canvas.height);
    paintBg(paintBgColor);

    game.level?.draw(game);

    if(frameCounter){
        game.ctx.font = "bold 16px Courier New";
        game.ctx.textAlign = "right";
        game.ctx.fillStyle = "white";
        game.ctx.fillText(game.fps.toString(),canvas.width,16);
    }
    game.frameCount++;

    if(game.level && debugVisible){
        debug.innerHTML = debugStatement();
    }

    window.requestAnimationFrame(draw);
}

function debugStatement(){
    let debug = "";

    debug += "xPos : "+game.level.getPlayer().properties.xPos + "<br>";
    debug += "yPos : "+game.level.getPlayer().properties.yPos + "<br>";
    // debug += "topLeftCornerPosX + Math.round(xPos * blockLength) : "+ game.level.topLeftCornerPosX + "+" + Math.round(game.level.getPlayer().properties.xPos * game.blockLength) + "=" + (game.level.topLeftCornerPosX+ Math.round(game.level.getPlayer().properties.xPos * game.blockLength)) + "<br>";
    // debug += "topLeftCornerPosY + Math.round(yPos * blockLength) : "+ game.level.topLeftCornerPosY + "+" + Math.round(game.level.getPlayer().properties.yPos * game.blockLength) + "=" + (game.level.topLeftCornerPosY+ Math.round(game.level.getPlayer().properties.yPos * game.blockLength)) + "<br>";
    // debug += "canvas width/2 - blockLength/2 : "+(game.canvas.width/2 - game.blockLength/2) + "<br>";
    // debug += "canvas height/2 - blockLength/2 : "+(game.canvas.height/2 - game.blockLength/2) + "<br>";
    debug += "xPosDraw : "+game.level.getPlayer().properties.xPosDraw + "<br>";
    debug += "yPosDraw : "+game.level.getPlayer().properties.yPosDraw + "<br>";
    debug += "player width : "+game.level.getPlayer().properties.width + "<br>";
    debug += "frameIndex : "+game.level.getPlayer().frameIndex + "<br>";
    debug += "width : "+game.level.width + "<br>";
    debug += "height : "+game.level.height + "<br>";
    debug += "blockWidth : "+game.level.blockWidth + "<br>";
    debug += "blockHeight : "+game.level.blockHeight + "<br>";
    debug += "topLeftCornerPosX : "+game.level.topLeftCornerPosX + "<br>";
    debug += "topLeftCornerPosY : "+game.level.topLeftCornerPosY + "<br>";
    // debug += "keyState : "+game.keyState + "<br>";
    debug += "orientation : "+game.level.getPlayer().direction + "<br>";
 
    return debug;
}

function canvasSizeReset(){
    canvas.width = window.innerWidth/pixelFactor;
    canvas.height = window.innerHeight/pixelFactor;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    if(game){
        game.level.focusOnPlayer(game);
        game.level.dialogueBox.reset(game);
    }
}

function paintBg(color){
    game.ctx.beginPath();
    game.ctx.rect(0,0,canvas.width,canvas.height);
    game.ctx.fillStyle = color;
    game.ctx.fill();
}

// window.onload = gameInit;