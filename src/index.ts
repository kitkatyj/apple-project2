import {Game} from './Game';

let game:Game = null;
let canvas,mainBody,gameBody,resizeTimer,debug = null;
let paintBgColor = "#200040";
let frameCounter:boolean = false;
let pixelFactor = 3;
let seedFunction:Function;
let createjs = null;

let config = {
    showStart:true,
    debugVisible:false,
    hitboxVisible:false,
    pixelFactor:3,
    joystickSize:128
}

export function gameInit(seedFunctionTemp:Function,createjsTemp:any){

    console.log("Ready!");

    seedFunction = seedFunctionTemp;
    createjs = createjsTemp;

    if(localStorage.getItem("config")){
        config = JSON.parse(localStorage.getItem("config"));
    }

    if(config.showStart){
        document.getElementById("playBtn").addEventListener("click",loadGame);
    } else {
        loadGame();
        (<HTMLInputElement>document.getElementById("showStart")).checked = false;
    }
}

function loadGame(){
    canvas = document.createElement("canvas");
    mainBody = document.getElementsByTagName("body")[0];
    gameBody = document.getElementById("game");
    debug = document.getElementById("debug");

    mainBody.style.margin = "0";
    gameBody.appendChild(canvas);

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
    
    document.getElementById("seedBtn").addEventListener("click",loadGame2);
    
    document.getElementById("showStart").addEventListener("change",function(e){
        config.showStart = (<HTMLInputElement>document.getElementById("showStart")).checked;
        updateConfig();
    });

    document.getElementById("showDebug").addEventListener("change",function(e){
        config.debugVisible = (<HTMLInputElement>document.getElementById("showDebug")).checked;
        updateConfig();
    });

    document.getElementById("showHitbox").addEventListener("change",function(e){
        config.hitboxVisible = (<HTMLInputElement>document.getElementById("showHitbox")).checked;
        game.hitboxVisible = !game.hitboxVisible;
        updateConfig();
    });

    if(localStorage.getItem("levelSeed")) document.getElementById("seedInput").setAttribute("value",localStorage.getItem("levelSeed"));

    if(config.debugVisible){
        (<HTMLInputElement>document.getElementById("showDebug")).checked = true;
    }

    loadGame2();

    window.requestAnimationFrame(draw);
}

function updateConfig(){
    localStorage.setItem("config",JSON.stringify(config));
}

function loadGame2(){
    game = new Game(canvas,seedFunction,createjs);

    let seedInputValue = (<HTMLInputElement>document.getElementById("seedInput")).value;

    game.loadLevel(seedInputValue);
    localStorage.setItem("levelSeed",seedInputValue);

    if(config.hitboxVisible){
        game.hitboxVisible = true; 
        (<HTMLInputElement>document.getElementById("showHitbox")).checked = true;
    }

    let joystick = {
        obj:document.getElementById("joystick"),
        stick:{
            obj:null,
            posX:0, posY:0
        },
        posX:0, posY:0
    }

    joystick.obj.innerHTML = drawJoystick();
    joystick.stick.obj = document.getElementById("stick");
    gameBody.addEventListener("touchstart",function(e){
        joystick.obj.style.display = "block";
        joystick.posX = e.touches[0].clientX - config.joystickSize/2;
        joystick.posY = e.touches[0].clientY - config.joystickSize/2;

        joystick.obj.style.left = joystick.posX.toString();
        joystick.obj.style.top = joystick.posY.toString();
        game.joystickState.down = true;
    });
    gameBody.addEventListener("touchmove",function(e){
        if(game.joystickState.down){
            joystick.stick.posX = e.touches[0].clientX - joystick.posX;
            joystick.stick.posY = e.touches[0].clientY - joystick.posY;

            let _x = joystick.stick.posX - config.joystickSize/2;
            let _y = joystick.stick.posY - config.joystickSize/2;

            joystick.stick.obj.style.left = (joystick.stick.posX - config.joystickSize/4).toString();
            joystick.stick.obj.style.top = (joystick.stick.posY - config.joystickSize/4).toString();

            if (_y > -0.5*_x && _y > 0.5*_x) game.joystickState.moveY = 1;
            else if (_y < -0.5*_x && _y < 0.5*_x) game.joystickState.moveY = -1;
            else game.joystickState.moveY = 0;

            if (_y < -2*_x && _y > 2*_x) game.joystickState.moveX = -1;
            else if (_y < 2*_x && _y > -2*_x) game.joystickState.moveX = 1;
            else game.joystickState.moveX = 0;
        }
    });
    gameBody.addEventListener("touchend",function(e){
        joystick.obj.style.display = "none";
        game.joystickState.down = false;
        game.joystickState.moveX = 0;
        game.joystickState.moveY = 0;
        joystick.stick.obj.style.left = config.joystickSize/4;
        joystick.stick.obj.style.top = config.joystickSize/4;
    });

    if (!createjs.Sound.initializeDefaultPlugins()) {console.warn("sound won't be played")}
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

    if(game.level && config.debugVisible){
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
    settings += "<section><label for='showHitbox'><span>show hitboxes</span><input type='checkbox' name='showHitbox' id='showHitbox'></label></section>";
    settings += "<section><label for='showStart'><span>show start screen</span><input id='showStart' name='showStart' type='checkbox' checked></label></section>";
    settings += "</section>"

    return settings;
}

function drawJoystick(){
    let joystick = "";

    joystick += "<div id='ring'><div id='stick'></div></div>";

    return joystick;
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
    debug += "direction : "+game.level.getPlayer().direction + "<br>";
    debug += "action : "+game.level.getPlayer().action + "<br>";
    debug += "joystickStateX : "+game.joystickState.moveX + "<br>";
    debug += "joystickStateY : "+game.joystickState.moveY + "<br>";
 
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