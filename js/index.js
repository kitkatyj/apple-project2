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
define("Player", ["require", "exports", "Entity"], function (require, exports, Entity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(properties, orientation, action, frameCount, orientationFrames) {
            var _this = _super.call(this, properties) || this;
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
            var _a, _b;
            switch (this.action) {
                case 'normal':
                    this.frameIndex = eval('this.orientationFrames.' + this.orientation + 'Still');
                    this.frameCount = 0;
                    break;
                case 'walking':
                    this.frameIndex = Math.floor(this.frameCount * this.properties.animateSpeed) % this.properties.totalFrames;
                    var totalFramesTemp = eval('this.orientationFrames.' + this.orientation + '[1] - this.orientationFrames.' + this.orientation + '[0] + 1');
                    var startingFrame = eval('this.orientationFrames.' + this.orientation + '[0]');
                    this.frameIndex = startingFrame + this.frameIndex % totalFramesTemp;
                    this.frameCount++;
                    switch (this.orientation) {
                        case 'left':
                            if (this.properties.xPos > 0) {
                                this.properties.xPos = Math.floor((this.properties.xPos * 100) - 2) / 100;
                            }
                            break;
                        case 'right':
                            if (this.properties.xPos < ((_a = game.level) === null || _a === void 0 ? void 0 : _a.blockWidth) - 1) {
                                this.properties.xPos = Math.floor((this.properties.xPos * 100) + 2) / 100;
                            }
                            break;
                        case 'back':
                            if (this.properties.yPos > 0) {
                                this.properties.yPos = Math.floor((this.properties.yPos * 100) - 2) / 100;
                            }
                            break;
                        case 'front':
                            if (this.properties.yPos < ((_b = game.level) === null || _b === void 0 ? void 0 : _b.blockHeight) - 1) {
                                this.properties.yPos = Math.floor((this.properties.yPos * 100) + 2) / 100;
                            }
                            break;
                    }
                    break;
            }
            this.frameStartX = (this.frameIndex % this.properties.framesPerRow) * this.properties.width;
            this.frameStartY = (Math.floor(this.frameIndex / this.properties.framesPerRow) % this.rows) * this.properties.height;
            this.properties.xPosDraw = Math.floor(game.level.topLeftCornerPosX + this.properties.xPos * game.blockLength);
            this.properties.yPosDraw = Math.floor(game.level.topLeftCornerPosY + this.properties.yPos * game.blockLength);
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.properties.width, this.properties.height, this.properties.xPosDraw, this.properties.yPosDraw, this.properties.width, this.properties.height);
        };
        return Player;
    }(Entity_1.Entity));
    exports.Player = Player;
});
define("Level", ["require", "exports", "Entity", "Player"], function (require, exports, Entity_2, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Level = (function () {
        function Level(game, blockWidth, blockHeight, floor, playerPos, entities) {
            this.width = 0;
            this.height = 0;
            this.blockWidth = 0;
            this.blockHeight = 0;
            this.topLeftCornerPosX = 0;
            this.topLeftCornerPosY = 0;
            this.xPosOffset = 0;
            this.yPosOffset = 0;
            this.entities = [];
            this.blockWidth = blockWidth;
            this.blockHeight = blockHeight;
            this.width = blockWidth * game.blockLength;
            this.height = blockHeight * game.blockLength;
            this.floorSrc = floor;
            if (this.floorSrc) {
                this.floorImg = new Image();
                this.floorImg.src = "res/" + this.floorSrc;
            }
            var levelEntites = this.entities;
            entities.forEach(function (entityTemp) {
                entityTemp.position.forEach(function (position) {
                    var entity = new Entity_2.Entity({
                        src: 'res/' + entityTemp.src,
                        xPos: position[0],
                        yPos: position[1]
                    });
                    levelEntites.push(entity);
                });
            });
            var playerPosTemp = playerPos;
            var applePlayer;
            switch (document.querySelector("input[name=player]:checked").getAttribute("value")) {
                case "player1":
                    applePlayer = new Player_1.Player({
                        xPos: playerPosTemp[0],
                        yPos: playerPosTemp[1],
                        width: 48,
                        height: 48,
                        src: 'res/apple4.png',
                        totalFrames: 16,
                        framesPerRow: 4,
                        animateSpeed: 1 / 12
                    }, 'front', 'normal', 0, {
                        front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
                        frontStill: 0, leftStill: 5, rightStill: 9, backStill: 12
                    });
                    break;
                case "player2":
                    applePlayer = new Player_1.Player({
                        xPos: playerPosTemp[0],
                        yPos: playerPosTemp[1],
                        src: 'res/apple5.png',
                        totalFrames: 20,
                        framesPerRow: 5,
                        animateSpeed: 1 / 12
                    }, 'front', 'normal', 0, {
                        front: [1, 4], left: [11, 14], right: [16, 19], back: [6, 9],
                        frontStill: 0, leftStill: 10, rightStill: 15, backStill: 5
                    });
                    break;
                case "player3":
                    applePlayer = new Player_1.Player({
                        xPos: playerPosTemp[0],
                        yPos: playerPosTemp[1],
                        src: 'res/apple6.png',
                        totalFrames: 16,
                        framesPerRow: 4,
                        animateSpeed: 1 / 12
                    }, 'front', 'normal', 0, {
                        front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
                        frontStill: 0, leftStill: 5, rightStill: 9, backStill: 12
                    });
                    break;
            }
            this.setPlayer(applePlayer);
            this.resetTopCorner(game);
            this.setOffset(this.blockWidth * game.blockLength / 2, this.blockHeight * game.blockLength / 2);
        }
        Level.prototype.resetTopCorner = function (game) {
            this.topLeftCornerPosX = Math.floor(game.canvas.width / 2 - this.width / 2);
            this.topLeftCornerPosY = Math.floor(game.canvas.height / 2 - this.height / 2);
        };
        Level.prototype.addEntity = function (entitiy) {
            this.entities.push(entitiy);
        };
        Level.prototype.getEntities = function () {
            return this.entities;
        };
        Level.prototype.setPlayer = function (playerObj) {
            this.player = playerObj;
            this.addEntity(playerObj);
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
            game.ctx.fillRect(this.topLeftCornerPosX, this.topLeftCornerPosY, this.width, this.height);
            for (var i = 0; i < this.blockWidth; i++) {
                for (var j = 0; j < this.blockHeight; j++) {
                    game.ctx.drawImage(this.floorImg, this.topLeftCornerPosX + i * game.blockLength, this.topLeftCornerPosY + j * game.blockLength, game.blockLength, game.blockLength);
                }
            }
            this.entities.forEach(function (entity) {
                entity.draw(game);
            });
        };
        return Level;
    }());
    exports.Level = Level;
});
define("Game", ["require", "exports", "Level"], function (require, exports, Level_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = (function () {
        function Game(canvas) {
            this.fps = 0;
            this.frameCount = 0;
            this.blockLength = 32;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            var thisGame = this;
            setInterval(function () {
                thisGame.fps = thisGame.frameCount;
                thisGame.frameCount = 0;
            }, 1000);
            this.loadLevel();
        }
        Game.prototype.loadLevel = function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "levels/a1.json", true);
            xhr.send();
            var thisGame = this;
            xhr.addEventListener("readystatechange", function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var levelTemp = JSON.parse(xhr.responseText);
                    thisGame.level = new Level_1.Level(thisGame, levelTemp.width, levelTemp.height, levelTemp.floor, levelTemp.playerPos, levelTemp.entities);
                }
            });
        };
        return Game;
    }());
    exports.Game = Game;
});
define("Entity", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Entity = (function () {
        function Entity(properties) {
            this.rows = 0;
            this.frameIndex = 0;
            this.frameStartX = 0;
            this.frameStartY = 0;
            this.properties = properties;
            this.properties.xPosDraw = 0;
            this.properties.yPosDraw = 0;
            if (!this.properties.width) {
                this.properties.width = 32;
            }
            if (!this.properties.height) {
                this.properties.height = 32;
            }
            if (!this.properties.totalFrames) {
                this.properties.totalFrames = 1;
            }
            if (!this.properties.framesPerRow) {
                this.properties.framesPerRow = 1;
            }
            if (!this.properties.animateSpeed) {
                this.properties.animateSpeed = 0;
            }
            this.rows = Math.floor(this.properties.totalFrames / this.properties.framesPerRow);
            if (this.properties.src) {
                this.img = new Image();
                this.img.src = this.properties.src;
            }
        }
        Entity.prototype.draw = function (game) {
            this.frameIndex = Math.floor(game.frameCount * this.properties.animateSpeed) % this.properties.totalFrames;
            this.frameStartX = (this.frameIndex % this.properties.framesPerRow) * this.properties.width;
            this.frameStartY = (Math.floor(this.frameIndex / this.properties.framesPerRow) % this.rows) * this.properties.height;
            this.properties.xPosDraw = game.level.topLeftCornerPosX + this.properties.xPos * game.blockLength;
            this.properties.yPosDraw = game.level.topLeftCornerPosY + this.properties.yPos * game.blockLength;
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.properties.width, this.properties.height, this.properties.xPosDraw, this.properties.yPosDraw, this.properties.width, this.properties.height);
        };
        return Entity;
    }());
    exports.Entity = Entity;
});
define("index", ["require", "exports", "Game"], function (require, exports, Game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var game = null;
    var canvas, mainBody, resizeTimer, debug = null;
    var paintBgColor = "#200040";
    var frameCounter = false;
    var debugVisible = false;
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
        game = new Game_1.Game(canvas);
    }
    function draw() {
        var _a;
        game.ctx.clearRect(0, 0, canvas.width, canvas.height);
        paintBg(paintBgColor);
        (_a = game.level) === null || _a === void 0 ? void 0 : _a.draw(game);
        if (frameCounter) {
            game.ctx.font = "bold 16px Courier New";
            game.ctx.textAlign = "right";
            game.ctx.fillStyle = "white";
            game.ctx.fillText(game.fps.toString(), canvas.width, 16);
            game.frameCount++;
        }
        if (game.level && debugVisible) {
            debug.innerHTML = debugStatement();
        }
        window.requestAnimationFrame(draw);
    }
    function debugStatement() {
        var debug = "";
        debug += "xPos : " + game.level.getPlayer().properties.xPos + "<br>";
        debug += "yPos : " + game.level.getPlayer().properties.yPos + "<br>";
        debug += "xPosDraw : " + game.level.getPlayer().properties.xPosDraw + "<br>";
        debug += "yPosDraw : " + game.level.getPlayer().properties.yPosDraw + "<br>";
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
