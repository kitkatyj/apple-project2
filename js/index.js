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
    var Sprite = /** @class */ (function () {
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
    var Player = /** @class */ (function (_super) {
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
                thisPlayer.action = 'walking';
                // left, up, right, down
                if (e.keyCode === 37) {
                    thisPlayer.orientation = 'left';
                }
                else if (e.keyCode === 38) {
                    thisPlayer.orientation = 'back';
                }
                else if (e.keyCode === 39) {
                    thisPlayer.orientation = 'right';
                }
                else if (e.keyCode === 40) {
                    thisPlayer.orientation = 'front';
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
define("Game", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function () {
        function Game() {
            this.frameCount = 0;
            this.sprites = [];
        }
        Game.prototype.addSprite = function (sprite) {
            this.sprites.push(sprite);
        };
        Game.prototype.getSprites = function () {
            return this.sprites;
        };
        Game.prototype.setPlayer = function (playerObj) {
            this.player = playerObj;
            this.addSprite(playerObj);
        };
        Game.prototype.getPlayer = function () {
            return this.player;
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
        game = new Game_1.Game();
        game.ctx = canvas.getContext('2d');
        var applePlayer = new Player_1.Player(canvas.width / 2, canvas.height / 2, 46, 48, '../res/apple2.png', 16, 4, 1 / 12, 'left', 'normal', 0, {
            front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
            frontStill: 0, leftStill: 4, rightStill: 9, backStill: 12
        });
        game.setPlayer(applePlayer);
        window.addEventListener("resize", function (e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(canvasSizeReset, 250);
        });
        window.requestAnimationFrame(draw);
    }
    exports.gameInit = gameInit;
    function draw() {
        var _a;
        game.ctx.clearRect(0, 0, canvas.width, canvas.height);
        paintBg(paintBgColor);
        if (frameCounter) {
            game.ctx.font = "bold 16px Courier New";
            game.ctx.textAlign = "right";
            game.ctx.fillStyle = "white";
            game.ctx.fillText(game.frameCount.toString(), canvas.width, 16);
            game.frameCount++;
        }
        (_a = game.getSprites()) === null || _a === void 0 ? void 0 : _a.forEach(function (sprite) {
            // console.log(this);
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
// window.onload = gameInit;
