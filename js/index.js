var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Sprite", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sprite = (function () {
        function Sprite(xPos, yPos, width, height, src, totalFrames, framesPerRow, animateSpeed) {
            this.xPos = 0;
            this.yPos = 0;
            this.xPosDraw = 0;
            this.yPosDraw = 0;
            this.animateSpeed = 1 / 12;
            this.rows = 0;
            this.frameIndex = 0;
            this.frameStartX = 0;
            this.frameStartY = 0;
            this.xPos = xPos;
            this.yPos = yPos;
            this.width = width;
            this.height = height;
            this.src = src;
            this.totalFrames = totalFrames;
            this.framesPerRow = framesPerRow;
            this.animateSpeed = animateSpeed;
            this.rows = Math.floor(this.totalFrames / this.framesPerRow);
            if (this.src) {
                this.img = new Image();
                this.img.src = this.src;
            }
        }
        Sprite.prototype.draw = function (game) {
            this.frameIndex = Math.floor(game.frameCount * this.animateSpeed) % this.totalFrames;
            this.frameStartX = (this.frameIndex % this.framesPerRow) * this.width;
            this.frameStartY = (Math.floor(this.frameIndex / this.framesPerRow) % this.rows) * this.height;
            this.xPosDraw = game.level.topLeftCornerPosX + this.xPos * game.blockLength;
            this.yPosDraw = game.level.topLeftCornerPosY + this.yPos * game.blockLength;
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.width, this.height, this.xPosDraw, this.yPosDraw, this.width, this.height);
        };
        return Sprite;
    }());
    exports.Sprite = Sprite;
});
define("Player", ["require", "exports", "Sprite"], function (require, exports, Sprite_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(xPos, yPos, width, height, src, totalFrames, framesPerRow, animateSpeed, orientation, action, frameCount, orientationFrames) {
            var _this = _super.call(this, xPos, yPos, width, height, src, totalFrames, framesPerRow, animateSpeed) || this;
            _this.orientation = 'front';
            _this.action = 'normal';
            _this.orientation = orientation;
            _this.action = action;
            _this.frameCount = frameCount;
            _this.orientationFrames = orientationFrames;
            var thisPlayer = _this;
            window.addEventListener("keydown", function (e) {
                if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
                    return false;
                }
                if (e.keyCode === 37 || e.keyCode === 65) {
                    thisPlayer.orientation = 'left';
                    thisPlayer.action = 'walking';
                }
                else if (e.keyCode === 38 || e.keyCode === 87) {
                    thisPlayer.orientation = 'back';
                    thisPlayer.action = 'walking';
                }
                else if (e.keyCode === 39 || e.keyCode === 68) {
                    thisPlayer.orientation = 'right';
                    thisPlayer.action = 'walking';
                }
                else if (e.keyCode === 40 || e.keyCode === 83) {
                    thisPlayer.orientation = 'front';
                    thisPlayer.action = 'walking';
                }
            });
            document.addEventListener("keyup", function (e) {
                thisPlayer.action = 'normal';
            });
            return _this;
        }
        Player.prototype.draw = function (game) {
            switch (this.action) {
                case 'normal':
                    this.frameIndex = eval('this.orientationFrames.' + this.orientation + 'Still');
                    this.frameCount = 0;
                    break;
                case 'walking':
                    this.frameIndex = Math.floor(this.frameCount * this.animateSpeed) % this.totalFrames;
                    var totalFramesTemp = eval('this.orientationFrames.' + this.orientation + '[1] - this.orientationFrames.' + this.orientation + '[0] + 1');
                    var startingFrame = eval('this.orientationFrames.' + this.orientation + '[0]');
                    this.frameIndex = startingFrame + this.frameIndex % totalFramesTemp;
                    this.frameCount++;
                    switch (this.orientation) {
                        case 'left':
                            this.xPos = Math.floor((this.xPos * 100) - 2) / 100;
                            break;
                        case 'right':
                            this.xPos = Math.floor((this.xPos * 100) + 2) / 100;
                            break;
                        case 'back':
                            this.yPos = Math.floor((this.yPos * 100) - 2) / 100;
                            break;
                        case 'front':
                            this.yPos = Math.floor((this.yPos * 100) + 2) / 100;
                            break;
                    }
                    break;
            }
            this.frameStartX = (this.frameIndex % this.framesPerRow) * this.width;
            this.frameStartY = (Math.floor(this.frameIndex / this.framesPerRow) % this.rows) * this.height;
            this.xPosDraw = Math.floor(game.level.topLeftCornerPosX + this.xPos * game.blockLength);
            this.yPosDraw = Math.floor(game.level.topLeftCornerPosY + this.yPos * game.blockLength);
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.width, this.height, this.xPosDraw, this.yPosDraw, this.width, this.height);
        };
        return Player;
    }(Sprite_1.Sprite));
    exports.Player = Player;
});
define("Level", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Level = (function () {
        function Level(game, blockWidth, blockHeight, floor, entities) {
            this.width = 0;
            this.height = 0;
            this.blockWidth = 0;
            this.blockHeight = 0;
            this.topLeftCornerPosX = 0;
            this.topLeftCornerPosY = 0;
            this.entities = [];
            this.xPosOffset = 0;
            this.yPosOffset = 0;
            this.sprites = [];
            this.blockWidth = blockWidth;
            this.blockHeight = blockHeight;
            this.width = blockWidth * game.blockLength;
            this.height = blockHeight * game.blockLength;
            this.floor = floor;
            this.entities = entities;
            this.resetTopCorner(game);
            this.setOffset(this.blockWidth * game.blockLength / 2, this.blockHeight * game.blockLength / 2);
        }
        Level.prototype.resetTopCorner = function (game) {
            this.topLeftCornerPosX = game.canvas.width / 2 - this.width / 2;
            this.topLeftCornerPosY = game.canvas.height / 2 - this.height / 2;
        };
        Level.prototype.addSprite = function (sprite) {
            this.sprites.push(sprite);
        };
        Level.prototype.getSprites = function () {
            return this.sprites;
        };
        Level.prototype.setPlayer = function (playerObj) {
            this.player = playerObj;
            this.addSprite(playerObj);
        };
        Level.prototype.getPlayer = function () {
            return this.player;
        };
        Level.prototype.setOffset = function (xPosOffset, yPosOffset) {
            this.xPosOffset = xPosOffset;
            this.yPosOffset = yPosOffset;
        };
        Level.prototype.getOffset = function () {
            return [this.xPosOffset, this.yPosOffset];
        };
        Level.prototype.incrementXOffset = function (increment) {
            this.xPosOffset + increment;
        };
        Level.prototype.incrementYOffset = function (increment) {
            this.yPosOffset + increment;
        };
        Level.prototype.draw = function (game) {
            game.ctx.fillStyle = '#000';
            game.ctx.fillRect(game.canvas.width / 2 - this.xPosOffset, game.canvas.height / 2 - this.yPosOffset, this.width, this.height);
        };
        return Level;
    }());
    exports.Level = Level;
});
define("Game", ["require", "exports", "Level"], function (require, exports, Level_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = (function () {
        function Game(canvas, player) {
            this.fps = 0;
            this.frameCount = 0;
            this.blockLength = 32;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.loadLevel(player);
            var thisGame = this;
            setInterval(function () {
                thisGame.fps = thisGame.frameCount;
                thisGame.frameCount = 0;
            }, 1000);
        }
        Game.prototype.loadLevel = function (player) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "levels/a1.json", true);
            xhr.send();
            var thisGame = this;
            xhr.addEventListener("readystatechange", function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var levelTemp = JSON.parse(xhr.responseText);
                    thisGame.level = new Level_1.Level(thisGame, levelTemp.width, levelTemp.height, levelTemp.floor, levelTemp.entities);
                    thisGame.level.setPlayer(player);
                }
            });
        };
        return Game;
    }());
    exports.Game = Game;
});
define("index", ["require", "exports", "Game", "Player"], function (require, exports, Game_1, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var game = null;
    var canvas, mainBody, resizeTimer, debug = null;
    var paintBgColor = "#200040";
    var frameCounter = true;
    var pixelFactor = 3;
    function gameInit() {
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
        document.querySelectorAll("input[name=player]").forEach(function (choice) {
            choice.addEventListener("change", loadGame);
        });
        window.addEventListener("resize", function (e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(canvasSizeReset, 250);
        });
        window.requestAnimationFrame(draw);
    }
    exports.gameInit = gameInit;
    function loadGame() {
        var applePlayer;
        switch (document.querySelector("input[name=player]:checked").getAttribute("value")) {
            case "player1":
                applePlayer = new Player_1.Player(4, 4, 48, 48, 'res/apple4.png', 16, 4, 1 / 12, 'front', 'normal', 0, {
                    front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
                    frontStill: 0, leftStill: 5, rightStill: 9, backStill: 12
                });
                break;
            case "player2":
                applePlayer = new Player_1.Player(4, 4, 32, 32, 'res/apple5.png', 20, 5, 1 / 12, 'front', 'normal', 0, {
                    front: [1, 4], left: [11, 14], right: [16, 19], back: [6, 9],
                    frontStill: 0, leftStill: 10, rightStill: 15, backStill: 5
                });
                break;
            case "player3":
                applePlayer = new Player_1.Player(4, 4, 32, 32, 'res/apple6.png', 16, 4, 1 / 12, 'front', 'normal', 0, {
                    front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
                    frontStill: 0, leftStill: 5, rightStill: 9, backStill: 12
                });
                break;
        }
        game = new Game_1.Game(canvas, applePlayer);
    }
    function draw() {
        var _a, _b;
        game.ctx.clearRect(0, 0, canvas.width, canvas.height);
        paintBg(paintBgColor);
        if (frameCounter) {
            game.ctx.font = "bold 16px Courier New";
            game.ctx.textAlign = "right";
            game.ctx.fillStyle = "white";
            game.ctx.fillText(game.fps.toString(), canvas.width, 16);
            game.frameCount++;
        }
        (_a = game.level) === null || _a === void 0 ? void 0 : _a.draw(game);
        (_b = game.level) === null || _b === void 0 ? void 0 : _b.getSprites().forEach(function (sprite) {
            sprite.draw(game);
        });
        if (game.level) {
            debug.innerHTML = debugStatement();
        }
        window.requestAnimationFrame(draw);
    }
    function debugStatement() {
        var debug = "";
        debug += "xPos : " + game.level.getPlayer().xPos + "<br>";
        debug += "yPos : " + game.level.getPlayer().yPos + "<br>";
        debug += "xPosDraw : " + game.level.getPlayer().xPosDraw + "<br>";
        debug += "yPosDraw : " + game.level.getPlayer().yPosDraw + "<br>";
        debug += "frameIndex : " + game.level.getPlayer().frameIndex + "<br>";
        debug += "width : " + game.level.width + "<br>";
        debug += "height : " + game.level.height + "<br>";
        debug += "blockWidth : " + game.level.blockWidth + "<br>";
        debug += "blockHeight : " + game.level.blockHeight + "<br>";
        debug += "topLeftCornerPosX : " + game.level.topLeftCornerPosX + "<br>";
        debug += "topLeftCornerPosY : " + game.level.topLeftCornerPosY + "<br>";
        debug += "levelOffset : " + game.level.getOffset() + "<br>";
        return debug;
    }
    function canvasSizeReset() {
        canvas.width = window.innerWidth / pixelFactor;
        canvas.height = window.innerHeight / pixelFactor;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        if (game) {
            game.level.resetTopCorner(game);
        }
    }
    function paintBg(color) {
        game.ctx.beginPath();
        game.ctx.rect(0, 0, canvas.width, canvas.height);
        game.ctx.fillStyle = color;
        game.ctx.fill();
    }
});
