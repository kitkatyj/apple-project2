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
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.width, this.height, this.xPos, this.yPos, this.width, this.height);
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
                            this.xPos--;
                            break;
                        case 'right':
                            this.xPos++;
                            break;
                        case 'back':
                            this.yPos--;
                            break;
                        case 'front':
                            this.yPos++;
                            break;
                    }
                    break;
            }
            this.frameStartX = (this.frameIndex % this.framesPerRow) * this.width;
            this.frameStartY = (Math.floor(this.frameIndex / this.framesPerRow) % this.rows) * this.height;
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.width, this.height, this.xPos, this.yPos, this.width, this.height);
        };
        return Player;
    }(Sprite_1.Sprite));
    exports.Player = Player;
});
define("Level", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Level = (function () {
        function Level(game, width, height, floor, entities) {
            this.entities = [];
            this.xPosOffset = 0;
            this.yPosOffset = 0;
            this.sprites = [];
            this.width = width;
            this.height = height;
            this.floor = floor;
            this.entities = entities;
            this.setOffset(this.width * game.blockLength / 2, this.height * game.blockLength / 2);
        }
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
        Level.prototype.draw = function (game) {
            game.ctx.fillStyle = '#000';
            game.ctx.fillRect(game.canvas.width / 2 - this.xPosOffset, game.canvas.height / 2 - this.yPosOffset, game.blockLength * this.width, game.blockLength * this.height);
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
    var canvas, mainBody, resizeTimer = null;
    var paintBgColor = "#200040";
    var frameCounter = true;
    var pixelFactor = 2;
    function gameInit() {
        console.log("Ready!");
        document.getElementById("ph").remove();
        canvas = document.createElement("canvas");
        mainBody = document.getElementsByTagName("body")[0];
        mainBody.style.margin = "0";
        mainBody.appendChild(canvas);
        canvasSizeReset();
        var applePlayer = new Player_1.Player(canvas.width / 2, canvas.height / 2, 48, 48, 'res/apple4.png', 16, 4, 1 / 12, 'left', 'normal', 0, {
            front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
            frontStill: 0, leftStill: 5, rightStill: 9, backStill: 12
        });
        game = new Game_1.Game(canvas, applePlayer);
        window.addEventListener("resize", function (e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(canvasSizeReset, 250);
        });
        window.requestAnimationFrame(draw);
    }
    exports.gameInit = gameInit;
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
        window.requestAnimationFrame(draw);
    }
    function canvasSizeReset() {
        canvas.width = window.innerWidth / pixelFactor;
        canvas.height = window.innerHeight / pixelFactor;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
    }
    function paintBg(color) {
        game.ctx.beginPath();
        game.ctx.rect(0, 0, canvas.width, canvas.height);
        game.ctx.fillStyle = color;
        game.ctx.fill();
    }
});
