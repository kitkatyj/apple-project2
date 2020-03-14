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
define("Entity", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Entity = (function () {
        function Entity(properties, imageMap) {
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
                var thisEntity_1 = this;
                var imgMatch_1 = false;
                imageMap.forEach(function (image) {
                    if (thisEntity_1.properties.src === image.src) {
                        thisEntity_1.img = image.img;
                        imgMatch_1 = true;
                    }
                });
                if (!imgMatch_1) {
                    this.img = new Image();
                    this.img.src = this.properties.src;
                    imageMap.push({ src: this.properties.src, img: this.img });
                }
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
define("Player", ["require", "exports", "Character"], function (require, exports, Character_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(properties, direction, action, frameCount, orientationFrames, imageMap) {
            return _super.call(this, properties, direction, action, frameCount, orientationFrames, imageMap) || this;
        }
        Player.prototype.draw = function (game) {
            this.action = 'normal';
            this.moveSpeed = this.tempMoveSpeed;
            this.animateSpeed = this.properties.animateSpeed;
            if (game.keyState[37] || game.keyState[65] || game.keyState[39] || game.keyState[68] || game.keyState[38] || game.keyState[87] || game.keyState[40] || game.keyState[83]) {
                this.action = 'walking';
            }
            if (game.keyState[16]) {
                this.moveSpeed = this.tempMoveSpeed * 2;
                this.animateSpeed = this.properties.animateSpeed * 2;
            }
            var orientationBuilder = [];
            if (game.keyState[37] || game.keyState[65]) {
                orientationBuilder.push('left');
            }
            if (game.keyState[39] || game.keyState[68]) {
                orientationBuilder.push('right');
            }
            if (game.keyState[38] || game.keyState[87]) {
                orientationBuilder.push('back');
            }
            if (game.keyState[40] || game.keyState[83]) {
                orientationBuilder.push('front');
            }
            if (orientationBuilder.length > 0)
                this.direction = orientationBuilder;
            this.properties.xPosDraw = game.level.topLeftCornerPosX + Math.round(this.properties.xPos * game.blockLength);
            this.properties.yPosDraw = game.level.topLeftCornerPosY + Math.round(this.properties.yPos * game.blockLength);
            if (this.direction[0])
                this.orientation = this.direction[0];
            switch (this.action) {
                case 'normal':
                    this.frameIndex = eval('this.orientationFrames.' + this.orientation + 'Still');
                    this.frameCount = 0;
                    break;
                case 'walking':
                    this.frameIndex = Math.floor(this.frameCount * this.animateSpeed) % this.properties.totalFrames;
                    var totalFramesTemp = eval('this.orientationFrames.' + this.orientation + '[1] - this.orientationFrames.' + this.orientation + '[0] + 1');
                    var startingFrame = eval('this.orientationFrames.' + this.orientation + '[0]');
                    this.frameIndex = startingFrame + this.frameIndex % totalFramesTemp;
                    this.frameCount++;
                    this.isCollide(game);
                    if (this.direction.indexOf('left') !== -1) {
                        this.properties.xPos = Math.floor((this.properties.xPos * game.blockLength) - this.moveSpeed) / game.blockLength;
                    }
                    else if (this.direction.indexOf('right') !== -1) {
                        this.properties.xPos = Math.floor((this.properties.xPos * game.blockLength) + this.moveSpeed) / game.blockLength;
                    }
                    if (this.direction.indexOf('back') !== -1) {
                        this.properties.yPos = Math.floor((this.properties.yPos * game.blockLength) - this.moveSpeed) / game.blockLength;
                    }
                    else if (this.direction.indexOf('front') !== -1) {
                        this.properties.yPos = Math.floor((this.properties.yPos * game.blockLength) + this.moveSpeed) / game.blockLength;
                    }
                    break;
            }
            this.frameStartX = (this.frameIndex % this.properties.framesPerRow) * this.properties.width;
            this.frameStartY = (Math.floor(this.frameIndex / this.properties.framesPerRow) % this.rows) * this.properties.height;
            this.drawShadow(game);
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.properties.width, this.properties.height, this.properties.xPosDraw, this.properties.yPosDraw, this.properties.width, this.properties.height);
            if (game.hitboxVisible)
                this.drawHitBox(game);
        };
        return Player;
    }(Character_1.Character));
    exports.Player = Player;
});
define("Level", ["require", "exports", "Entity", "Character", "Player"], function (require, exports, Entity_1, Character_2, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Level = (function () {
        function Level(game, blockWidth, blockHeight, floor, playerPos, characters, entities, seed) {
            this.width = 0;
            this.height = 0;
            this.blockWidth = 0;
            this.blockHeight = 0;
            this.topLeftCornerPosX = 0;
            this.topLeftCornerPosY = 0;
            this.blockWidth = blockWidth;
            this.blockHeight = blockHeight;
            this.width = blockWidth * game.blockLength;
            this.height = blockHeight * game.blockLength;
            this.floorSrc = floor;
            if (this.floorSrc) {
                this.floorImg = new Image();
                this.floorImg.src = "res/" + this.floorSrc;
            }
            this.entities = { bottom: [], solid: [], ground: [], top: [] };
            this.seed = seed;
            this.seedGen = game.seedFunction(this.seed);
            var level = this;
            var playerPosTemp = playerPos;
            var applePlayer;
            switch (document.querySelector("input[name=player]:checked").getAttribute("value")) {
                case "player1":
                    applePlayer = new Player_1.Player({
                        xPos: playerPosTemp[0],
                        yPos: playerPosTemp[1],
                        width: 32,
                        height: 32,
                        src: 'res/yx/apple.png',
                        totalFrames: 20,
                        framesPerRow: 5,
                        animateSpeed: 1 / 12
                    }, ['front'], 'normal', 0, {
                        front: [1, 4], left: [11, 14], right: [16, 19], back: [6, 9],
                        frontStill: 0, leftStill: 10, rightStill: 15, backStill: 5
                    }, game.loadImageMap());
                    break;
                case "player2":
                    applePlayer = new Player_1.Player({
                        xPos: playerPosTemp[0],
                        yPos: playerPosTemp[1],
                        src: 'res/yj/apple.png',
                        totalFrames: 20,
                        framesPerRow: 5,
                        animateSpeed: 1 / 12
                    }, ['front'], 'normal', 0, {
                        front: [1, 4], left: [11, 14], right: [16, 19], back: [6, 9],
                        frontStill: 0, leftStill: 10, rightStill: 15, backStill: 5
                    }, game.loadImageMap());
                    break;
                case "player3":
                    applePlayer = new Player_1.Player({
                        xPos: playerPosTemp[0],
                        yPos: playerPosTemp[1],
                        src: 'res/yy/apple.png',
                        totalFrames: 16,
                        framesPerRow: 4,
                        animateSpeed: 1 / 12
                    }, ['front'], 'normal', 0, {
                        front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
                        frontStill: 0, leftStill: 5, rightStill: 9, backStill: 12
                    }, game.loadImageMap());
                    break;
            }
            var levelMap = [];
            for (var i = 0; i < level.blockHeight; i++) {
                levelMap[i] = [];
                for (var j = 0; j < level.blockWidth; j++) {
                    levelMap[i][j] = false;
                }
            }
            this.setPlayer(applePlayer);
            levelMap[playerPos[0]][playerPos[1]] = true;
            characters.forEach(function (char) {
                char.position.forEach(function (pos) {
                    var charTemp;
                    if (char.name === "clementine") {
                        switch (document.querySelector("input[name=player]:checked").getAttribute("value")) {
                            case "player1":
                                charTemp = new Character_2.Character({
                                    src: 'res/yx/clem.png',
                                    xPos: pos[0],
                                    yPos: pos[1],
                                    width: char.width,
                                    height: char.height,
                                    totalFrames: 20,
                                    framesPerRow: 5,
                                    animateSpeed: 1 / 12
                                }, ['front'], 'normal', 0, {
                                    front: [1, 4], left: [11, 14], right: [16, 19], back: [6, 9],
                                    frontStill: 0, leftStill: 10, rightStill: 15, backStill: 5
                                }, game.loadImageMap());
                                break;
                            case "player2":
                                charTemp = new Character_2.Character({
                                    src: 'res/yj/clem.png',
                                    xPos: pos[0],
                                    yPos: pos[1],
                                    width: char.width,
                                    height: char.height,
                                    totalFrames: 20,
                                    framesPerRow: 5,
                                    animateSpeed: 1 / 12
                                }, ['front'], 'normal', 0, {
                                    front: [1, 4], left: [11, 14], right: [16, 19], back: [6, 9],
                                    frontStill: 0, leftStill: 10, rightStill: 15, backStill: 5
                                }, game.loadImageMap());
                                break;
                            case "player3":
                                charTemp = new Character_2.Character({
                                    src: 'res/yy/clem.png',
                                    xPos: pos[0],
                                    yPos: pos[1],
                                    width: char.width,
                                    height: char.height,
                                    totalFrames: 16,
                                    framesPerRow: 4,
                                    animateSpeed: 1 / 12
                                }, ['front'], 'normal', 0, {
                                    front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
                                    frontStill: 0, leftStill: 5, rightStill: 9, backStill: 12
                                }, game.loadImageMap());
                                break;
                        }
                    }
                    else {
                        charTemp = new Character_2.Character({
                            src: 'res/' + char.src,
                            xPos: pos[0],
                            yPos: pos[1],
                            width: char.width,
                            height: char.height,
                            totalFrames: char.totalFrames,
                            framesPerRow: char.framesPerRow,
                            animateSpeed: char.animateSpeed
                        }, ['front'], 'normal', 0, {
                            front: [0, 3], left: [4, 7], right: [8, 11], back: [12, 15],
                            frontStill: 0, leftStill: 5, rightStill: 9, backStill: 12
                        }, game.loadImageMap());
                    }
                    level.setCharacter(charTemp);
                });
            });
            entities.forEach(function (entityTemp) {
                if (Array.isArray(entityTemp.position)) {
                    entityTemp.position.forEach(function (position) {
                        var entity = new Entity_1.Entity({
                            src: 'res/' + entityTemp.src,
                            xPos: position[0],
                            yPos: position[1],
                            width: entityTemp.width,
                            height: entityTemp.height,
                            totalFrames: entityTemp.totalFrames,
                            framesPerRow: entityTemp.framesPerRow,
                            animateSpeed: entityTemp.animateSpeed
                        }, game.loadImageMap());
                        level.addEntity(entity, entityTemp.layer);
                    });
                }
                else if (entityTemp.position === 'random') {
                    var entityQty = Math.round(level.blockHeight * level.blockWidth * entityTemp.threshold);
                    for (var i = 0; i < entityQty; i++) {
                        var pos = level.randomPos();
                        while (levelMap[pos[0]][pos[1]]) {
                            pos = level.randomPos();
                        }
                        levelMap[pos[0]][pos[1]] = true;
                        var entity = new Entity_1.Entity({
                            src: 'res/' + entityTemp.src,
                            xPos: pos[0],
                            yPos: pos[1],
                            width: entityTemp.width,
                            height: entityTemp.height,
                            totalFrames: entityTemp.totalFrames,
                            framesPerRow: entityTemp.framesPerRow,
                            animateSpeed: entityTemp.animateSpeed
                        }, game.loadImageMap());
                        level.addEntity(entity, entityTemp.layer);
                    }
                }
            });
            this.focusOnPlayer(game);
        }
        Level.prototype.randomPos = function () {
            var posArray = [Math.floor(this.seedGen() * this.blockWidth), Math.floor(this.seedGen() * this.blockHeight)];
            return posArray;
        };
        Level.prototype.resetTopCorner = function (game) {
            this.topLeftCornerPosX = Math.floor(game.canvas.width / 2 - this.width / 2);
            this.topLeftCornerPosY = Math.floor(game.canvas.height / 2 - this.height / 2);
        };
        Level.prototype.focusOnPlayer = function (game) {
            if ((game.canvas.width / 2 - game.blockLength / 2) % 1 === 0) {
                this.topLeftCornerPosX = Math.round(game.canvas.width / 2 - this.player.properties.xPos * game.blockLength - game.blockLength / 2);
            }
            else {
                this.topLeftCornerPosX = Math.floor(game.canvas.width / 2 - this.player.properties.xPos * game.blockLength - game.blockLength / 2);
            }
            if ((game.canvas.height / 2 - game.blockLength / 2) % 1 === 0) {
                this.topLeftCornerPosY = Math.round(game.canvas.height / 2 - this.player.properties.yPos * game.blockLength - game.blockLength / 2);
            }
            else {
                this.topLeftCornerPosY = Math.floor(game.canvas.height / 2 - this.player.properties.yPos * game.blockLength - game.blockLength / 2);
            }
        };
        Level.prototype.addEntity = function (entity, layer) {
            switch (layer) {
                case 'bottom':
                    this.entities.bottom.push(entity);
                    break;
                case 'solid':
                    this.entities.solid.push(entity);
                    break;
                case 'ground':
                    this.entities.ground.push(entity);
                    break;
                case 'top':
                    this.entities.top.push(entity);
                    break;
            }
        };
        Level.prototype.getEntities = function () {
            return this.entities;
        };
        Level.prototype.setCharacter = function (charObj) {
            this.addEntity(charObj, 'ground');
        };
        Level.prototype.setPlayer = function (playerObj) {
            this.player = playerObj;
            this.addEntity(playerObj, 'ground');
        };
        Level.prototype.getPlayer = function () {
            return this.player;
        };
        Level.prototype.withinWindowBounds = function (game, posX, posY) {
            return -this.topLeftCornerPosX - game.blockLength < posX * game.blockLength && posX * game.blockLength < -this.topLeftCornerPosX + game.canvas.width &&
                -this.topLeftCornerPosY - game.blockLength < posY * game.blockLength && posY * game.blockLength < -this.topLeftCornerPosY + game.canvas.height;
        };
        Level.prototype.draw = function (game) {
            game.ctx.fillStyle = '#000';
            game.ctx.fillRect(this.topLeftCornerPosX, this.topLeftCornerPosY, this.width, this.height);
            for (var i = 0; i < this.blockWidth; i++) {
                for (var j = 0; j < this.blockHeight; j++) {
                    if (this.withinWindowBounds(game, i, j)) {
                        game.ctx.drawImage(this.floorImg, this.topLeftCornerPosX + i * game.blockLength, this.topLeftCornerPosY + j * game.blockLength, game.blockLength, game.blockLength);
                    }
                }
            }
            var thisLevel = this;
            this.entities.solid.forEach(function (entity) {
                if (thisLevel.withinWindowBounds(game, entity.properties.xPos, entity.properties.yPos))
                    entity.draw(game);
            });
            this.entities.bottom.forEach(function (entity) {
                if (thisLevel.withinWindowBounds(game, entity.properties.xPos, entity.properties.yPos))
                    entity.draw(game);
            });
            var _loop_1 = function (yIndex) {
                this_1.entities.ground.forEach(function (entity) {
                    if (Math.ceil(entity.properties.yPos) == yIndex && thisLevel.withinWindowBounds(game, entity.properties.xPos, entity.properties.yPos)) {
                        entity.draw(game);
                    }
                });
            };
            var this_1 = this;
            for (var yIndex = 0; yIndex < this.height; yIndex++) {
                _loop_1(yIndex);
            }
            if (this.topLeftCornerPosX + Math.round(this.player.properties.xPos * game.blockLength) + game.blockLength / 2 >= game.canvas.width * 2 / 3) {
                this.topLeftCornerPosX = this.topLeftCornerPosX - this.player.moveSpeed;
            }
            else if (this.topLeftCornerPosX + Math.round(this.player.properties.xPos * game.blockLength) + game.blockLength / 2 <= game.canvas.width / 3) {
                this.topLeftCornerPosX = this.topLeftCornerPosX + this.player.moveSpeed;
            }
            if (this.topLeftCornerPosY + Math.round(this.player.properties.yPos * game.blockLength) + game.blockLength / 2 >= game.canvas.height * 2 / 3) {
                this.topLeftCornerPosY = this.topLeftCornerPosY - this.player.moveSpeed;
            }
            else if (this.topLeftCornerPosY + Math.round(this.player.properties.yPos * game.blockLength) + game.blockLength / 2 < game.canvas.height / 3) {
                this.topLeftCornerPosY = this.topLeftCornerPosY + this.player.moveSpeed;
            }
        };
        return Level;
    }());
    exports.Level = Level;
});
define("Game", ["require", "exports", "Level"], function (require, exports, Level_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = (function () {
        function Game(canvas, seedFunction) {
            this.fps = 0;
            this.hitboxVisible = false;
            this.frameCount = 0;
            this.blockLength = 32;
            this.keyState = [];
            this.images = [];
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.seedFunction = seedFunction;
            var thisGame = this;
            setInterval(function () {
                thisGame.fps = thisGame.frameCount;
                thisGame.frameCount = 0;
            }, 1000);
            document.addEventListener("keydown", function (e) {
                if (e.ctrlKey || e.altKey || e.metaKey) {
                    return false;
                }
                thisGame.keyState[e.keyCode || e.which] = true;
            });
            document.addEventListener("keyup", function (e) {
                thisGame.keyState[e.keyCode || e.which] = false;
            });
        }
        Game.prototype.loadLevel = function (seed) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "levels/a1.json", true);
            xhr.send();
            var thisGame = this;
            xhr.addEventListener("readystatechange", function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var levelTemp = JSON.parse(xhr.responseText);
                    thisGame.level = new Level_1.Level(thisGame, levelTemp.width, levelTemp.height, levelTemp.floor, levelTemp.playerPos, levelTemp.characters, levelTemp.entities, seed);
                }
            });
        };
        Game.prototype.loadImageMap = function () {
            return this.images;
        };
        return Game;
    }());
    exports.Game = Game;
});
define("Character", ["require", "exports", "Entity"], function (require, exports, Entity_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(properties, direction, action, frameCount, orientationFrames, imageMap) {
            var _this = _super.call(this, properties, imageMap) || this;
            _this.direction = ['front', null];
            _this.orientation = 'front';
            _this.action = 'normal';
            _this.tempMoveSpeed = 1;
            _this.direction = direction;
            _this.action = action;
            _this.frameCount = frameCount;
            _this.orientationFrames = orientationFrames;
            _this.hitbox = { xPos: 11, yPos: 28, width: 9, height: 3 };
            _this.moveSpeed = _this.tempMoveSpeed;
            _this.animateSpeed = _this.properties.animateSpeed;
            return _this;
        }
        Character.prototype.isCollide = function (game) {
            var playerHB = {
                xPos: this.properties.xPos + (this.hitbox.xPos / game.blockLength),
                yPos: this.properties.yPos + (this.hitbox.yPos / game.blockLength),
                width: this.hitbox.width / game.blockLength,
                height: this.hitbox.height / game.blockLength
            };
            var playerOrient = this.direction;
            var playerMoveSpeed = this.moveSpeed;
            if (playerOrient.indexOf('left') !== -1 && playerHB.xPos - this.moveSpeed / game.blockLength < 0) {
                playerOrient.splice(playerOrient.indexOf('left'), 1);
            }
            if (playerOrient.indexOf('right') !== -1 && playerHB.xPos + playerHB.width + this.moveSpeed / game.blockLength > game.level.blockWidth) {
                playerOrient.splice(playerOrient.indexOf('right'), 1);
            }
            if (playerOrient.indexOf('front') !== -1 && this.properties.yPos + 1 + this.moveSpeed / game.blockLength > game.level.blockHeight) {
                playerOrient.splice(playerOrient.indexOf('front'), 1);
            }
            if (playerOrient.indexOf('back') !== -1 && playerHB.yPos - this.moveSpeed / game.blockLength < 0) {
                playerOrient.splice(playerOrient.indexOf('back'), 1);
            }
            game.level.getEntities().solid.forEach(function (entity) {
                var entityPos = { xPos: entity.properties.xPos, yPos: entity.properties.yPos };
                if (playerHB.yPos + playerHB.height > entityPos.yPos && playerHB.yPos < entityPos.yPos + 1) {
                    if (playerOrient.indexOf('left') !== -1 && playerHB.xPos - playerMoveSpeed / game.blockLength < entityPos.xPos + 1 && playerHB.xPos + playerHB.width > entityPos.xPos) {
                        playerOrient.splice(playerOrient.indexOf('left'), 1);
                    }
                    if (playerOrient.indexOf('right') !== -1 && playerHB.xPos + playerHB.width + playerMoveSpeed / game.blockLength > entityPos.xPos && playerHB.xPos < entityPos.xPos + 1) {
                        playerOrient.splice(playerOrient.indexOf('right'), 1);
                    }
                }
                if (playerHB.xPos + playerHB.width > entityPos.xPos && playerHB.xPos < entityPos.xPos + 1) {
                    if (playerOrient.indexOf('front') !== -1 && playerHB.yPos + playerHB.height + playerMoveSpeed / game.blockLength > entityPos.yPos && playerHB.yPos < entityPos.yPos + 1) {
                        playerOrient.splice(playerOrient.indexOf('front'), 1);
                    }
                    if (playerOrient.indexOf('back') !== -1 && playerHB.yPos - playerMoveSpeed / game.blockLength < entityPos.yPos + 1 && playerHB.yPos + playerHB.height > entityPos.yPos) {
                        playerOrient.splice(playerOrient.indexOf('back'), 1);
                    }
                }
            });
        };
        Character.prototype.drawHitBox = function (game) {
            game.ctx.fillStyle = "#ff0000";
            game.ctx.fillRect(game.level.topLeftCornerPosX + this.properties.xPos * game.blockLength + this.hitbox.xPos, game.level.topLeftCornerPosY + this.properties.yPos * game.blockLength + this.hitbox.yPos, this.hitbox.width / 2, this.hitbox.height);
        };
        Character.prototype.drawShadow = function (game) {
            game.ctx.fillStyle = "#000000";
            game.ctx.globalAlpha = 0.3;
            game.ctx.beginPath();
            game.ctx.ellipse(game.level.topLeftCornerPosX + this.properties.xPos * game.blockLength + this.properties.width / 2, game.level.topLeftCornerPosY + this.properties.yPos * game.blockLength + this.properties.height - 1, this.properties.width / 3, 3, 0, 0, 2 * Math.PI);
            game.ctx.fill();
            game.ctx.globalAlpha = 1;
        };
        Character.prototype.draw = function (game) {
            this.properties.xPosDraw = game.level.topLeftCornerPosX + Math.round(this.properties.xPos * game.blockLength);
            this.properties.yPosDraw = game.level.topLeftCornerPosY + Math.round(this.properties.yPos * game.blockLength);
            if (this.direction[0])
                this.orientation = this.direction[0];
            switch (this.action) {
                case 'normal':
                    this.frameIndex = eval('this.orientationFrames.' + this.orientation + 'Still');
                    this.frameCount = 0;
                    break;
                case 'walking':
                    this.frameIndex = Math.floor(this.frameCount * this.animateSpeed) % this.properties.totalFrames;
                    var totalFramesTemp = eval('this.orientationFrames.' + this.orientation + '[1] - this.orientationFrames.' + this.orientation + '[0] + 1');
                    var startingFrame = eval('this.orientationFrames.' + this.orientation + '[0]');
                    this.frameIndex = startingFrame + this.frameIndex % totalFramesTemp;
                    this.frameCount++;
                    this.isCollide(game);
                    if (this.direction.indexOf('left') !== -1) {
                        this.properties.xPos = Math.floor((this.properties.xPos * game.blockLength) - this.moveSpeed) / game.blockLength;
                    }
                    else if (this.direction.indexOf('right') !== -1) {
                        this.properties.xPos = Math.floor((this.properties.xPos * game.blockLength) + this.moveSpeed) / game.blockLength;
                    }
                    if (this.direction.indexOf('back') !== -1) {
                        this.properties.yPos = Math.floor((this.properties.yPos * game.blockLength) - this.moveSpeed) / game.blockLength;
                    }
                    else if (this.direction.indexOf('front') !== -1) {
                        this.properties.yPos = Math.floor((this.properties.yPos * game.blockLength) + this.moveSpeed) / game.blockLength;
                    }
                    break;
            }
            this.frameStartX = (this.frameIndex % this.properties.framesPerRow) * this.properties.width;
            this.frameStartY = (Math.floor(this.frameIndex / this.properties.framesPerRow) % this.rows) * this.properties.height;
            this.drawShadow(game);
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.properties.width, this.properties.height, this.properties.xPosDraw, this.properties.yPosDraw, this.properties.width, this.properties.height);
            if (game.hitboxVisible)
                this.drawHitBox(game);
        };
        return Character;
    }(Entity_2.Entity));
    exports.Character = Character;
});
define("NonPlayer", ["require", "exports", "Character"], function (require, exports, Character_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NonPlayer = (function (_super) {
        __extends(NonPlayer, _super);
        function NonPlayer(properties, direction, action, frameCount, orientationFrames, imageMap) {
            return _super.call(this, properties, direction, action, frameCount, orientationFrames, imageMap) || this;
        }
        return NonPlayer;
    }(Character_3.Character));
    exports.NonPlayer = NonPlayer;
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
    var seedFunction;
    function gameInit(seedFunctionTemp) {
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
        if (localStorage.getItem("levelSeed")) {
            document.getElementById("seedInput").setAttribute("value", localStorage.getItem("levelSeed"));
        }
        loadGame();
        document.querySelectorAll("input[name=player]").forEach(function (choice) {
            choice.addEventListener("change", loadGame);
        });
        document.getElementById("seedBtn").addEventListener("click", loadGame);
        window.addEventListener("resize", function (e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(canvasSizeReset, 250);
        });
        window.requestAnimationFrame(draw);
    }
    exports.gameInit = gameInit;
    function loadGame() {
        game = new Game_1.Game(canvas, seedFunction);
        var seedInputValue = document.getElementById("seedInput").value;
        game.loadLevel(seedInputValue);
        localStorage.setItem("levelSeed", seedInputValue);
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
        }
        game.frameCount++;
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
        debug += "player width : " + game.level.getPlayer().properties.width + "<br>";
        debug += "frameIndex : " + game.level.getPlayer().frameIndex + "<br>";
        debug += "width : " + game.level.width + "<br>";
        debug += "height : " + game.level.height + "<br>";
        debug += "blockWidth : " + game.level.blockWidth + "<br>";
        debug += "blockHeight : " + game.level.blockHeight + "<br>";
        debug += "topLeftCornerPosX : " + game.level.topLeftCornerPosX + "<br>";
        debug += "topLeftCornerPosY : " + game.level.topLeftCornerPosY + "<br>";
        debug += "orientation : " + game.level.getPlayer().direction + "<br>";
        return debug;
    }
    function canvasSizeReset() {
        canvas.width = window.innerWidth / pixelFactor;
        canvas.height = window.innerHeight / pixelFactor;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        if (game) {
            game.level.focusOnPlayer(game);
        }
    }
    function paintBg(color) {
        game.ctx.beginPath();
        game.ctx.rect(0, 0, canvas.width, canvas.height);
        game.ctx.fillStyle = color;
        game.ctx.fill();
    }
});
