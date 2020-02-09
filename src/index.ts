import {Game} from './Game';
import {Player} from './Player';

let game:Game = null;
let canvas,mainBody,resizeTimer = null;
let paintBgColor = "#200040";
let frameCounter:boolean = true;
let pixelFactor = 3;

export function gameInit(){
    console.log("Ready!");
    document.getElementById("ph").remove();

    canvas = document.createElement("canvas");
    mainBody = document.getElementsByTagName("body")[0];

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
                canvas.width/2,
                canvas.height/2,
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
                canvas.width/2,
                canvas.height/2,
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
                canvas.width/2,
                canvas.height/2,
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

    window.requestAnimationFrame(draw);
}

function canvasSizeReset(){
    canvas.width = window.innerWidth/pixelFactor;
    canvas.height = window.innerHeight/pixelFactor;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
}

function paintBg(color){
    game.ctx.beginPath();
    game.ctx.rect(0,0,canvas.width,canvas.height);
    game.ctx.fillStyle = color;
    game.ctx.fill();
}

// window.onload = gameInit;