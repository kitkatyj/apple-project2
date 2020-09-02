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

    seedFunction = seedFunctionTemp;

    if(!JSON.parse(localStorage.getItem("showStart"))){
        loadGame();
        (<HTMLInputElement>document.getElementById("showStart")).checked = false;
    } else {
        document.getElementById("playBtn").addEventListener("click",loadGame);
    }
}

function toggleDebug(){
    debugVisible = !debugVisible;
}

function loadGame(){
    canvas = document.createElement("canvas");
    mainBody = document.getElementsByTagName("body")[0];
    debug = document.getElementById("debug");

    mainBody.style.margin = "0";
    mainBody.appendChild(canvas);

    canvasSizeReset();

    window.addEventListener("resize",function(e){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(canvasSizeReset,250);
    });
    
    document.getElementById("start").remove();
    document.getElementById("settings").innerHTML = settingsScreen();

    document.querySelector("#settings > a").addEventListener("click",function(){
        if(this.parentElement.className === 'open'){
            this.parentElement.className = '';
        } else {
            this.parentElement.className = 'open';
        }
    });
    
    document.getElementById("showDebug").addEventListener("click",toggleDebug);
    document.getElementById("seedBtn").addEventListener("click",loadGame2);
    
    document.getElementById("showStart").addEventListener("change",function(e){
        localStorage.setItem("showStart",JSON.stringify((<HTMLInputElement>document.getElementById("showStart")).checked));
    });

    document.getElementById("showDebug").addEventListener("change",function(e){
        localStorage.setItem("debug",JSON.stringify((<HTMLInputElement>document.getElementById("showDebug")).checked));
    })

    if(localStorage.getItem("levelSeed")) document.getElementById("seedInput").setAttribute("value",localStorage.getItem("levelSeed"));
    if(JSON.parse(localStorage.getItem("debug"))){
        debugVisible = true; 
        (<HTMLInputElement>document.getElementById("showDebug")).checked = true;
    }

    loadGame2();

    window.requestAnimationFrame(draw);
}

function loadGame2(){
    game = new Game(canvas,seedFunction);

    let seedInputValue = (<HTMLInputElement>document.getElementById("seedInput")).value;

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
    else {
        debug.innerHTML = "";
    }

    window.requestAnimationFrame(draw);
}

function settingsScreen(){
    let settings = "";

    settings += "<a href='#'><i class='fas fa-cog'></i><span>Settings</span></a>";
    settings += "<section>";
    settings += "<section><span>seed:</span><input type='text' name='seedInput' id='seedInput' value='hello!'><input type='button' name='seedBtn' id='seedBtn' value='update'></section>";
    settings += "<section><label for='showDebug'><span>show debug</span><input type='checkbox' name='showDebug' id='showDebug'></label></section>";
    settings += "<section><label for='showStart'><span>show start screen</span><input id='showStart' name='showStart' type='checkbox' checked></label></section>";
    settings += "</section>"

    return settings;
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
    debug += "action : "+game.level.getPlayer().action + "<br>";
 
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