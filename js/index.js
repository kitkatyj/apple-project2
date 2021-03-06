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
        Entity.prototype.setFrameStart = function () {
            this.frameStartX = (this.frameIndex % this.properties.framesPerRow) * this.properties.width;
            this.frameStartY = (Math.floor(this.frameIndex / this.properties.framesPerRow) % this.rows) * this.properties.height;
        };
        Entity.prototype.setPosDraw = function (game) {
            this.properties.xPosDraw = game.level.topLeftCornerPosX + Math.round(this.properties.xPos * game.blockLength);
            this.properties.yPosDraw = game.level.topLeftCornerPosY + Math.round(this.properties.yPos * game.blockLength);
        };
        Entity.prototype.draw = function (game) {
            this.frameIndex = Math.floor(game.frameCount * this.properties.animateSpeed) % this.properties.totalFrames;
            this.setFrameStart();
            this.setPosDraw(game);
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.properties.width, this.properties.height, this.properties.xPosDraw, this.properties.yPosDraw, this.properties.width, this.properties.height);
        };
        return Entity;
    }());
    exports.Entity = Entity;
});
define("Sound", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sound = (function () {
        function Sound() {
            this.soundTick = 0;
        }
        return Sound;
    }());
    exports.Sound = Sound;
});
define("Player", ["require", "exports", "Character", "Sound"], function (require, exports, Character_1, Sound_1) {
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
            if (game.level.dialogueBox.text.length === 0) {
                if (game.keyState[37] || game.keyState[65] || game.keyState[39] || game.keyState[68] || game.keyState[38] || game.keyState[87] || game.keyState[40] || game.keyState[83] || game.joystickState.moveX != 0 || game.joystickState.moveY != 0) {
                    if (game.keyState[16]) {
                        this.moveSpeed = this.tempMoveSpeed * 2;
                        this.animateSpeed = this.properties.animateSpeed * 2;
                        this.action = 'running';
                    }
                    else {
                        this.action = 'walking';
                    }
                }
                var orientationBuilder = [];
                if (game.keyState[37] || game.keyState[65] || game.joystickState.moveX < 0) {
                    orientationBuilder.push('left');
                }
                if (game.keyState[39] || game.keyState[68] || game.joystickState.moveX > 0) {
                    orientationBuilder.push('right');
                }
                if (game.keyState[38] || game.keyState[87] || game.joystickState.moveY < 0) {
                    orientationBuilder.push('back');
                }
                if (game.keyState[40] || game.keyState[83] || game.joystickState.moveY > 0) {
                    orientationBuilder.push('front');
                }
                if (orientationBuilder.length > 0)
                    this.direction = orientationBuilder;
            }
            this.setPosDraw(game);
            this.setDirection(game);
            if (this.sound)
                this.sound.soundTick++;
            var stepTicks = 30;
            var stepVolume = 0.1;
            if (this.action == "running") {
                stepTicks = 20;
                stepVolume = 0.2;
            }
            if ((this.sound == undefined || this.sound.soundTick >= stepTicks * (0.8 + Math.random() * 0.2))
                && (this.action == "walking" || this.action == "running")
                && this.direction.length > 0) {
                var walkSounds = ['walk1', 'walk2', 'walk3', 'walk4'];
                if (this.sound == undefined)
                    this.sound = new Sound_1.Sound();
                this.sound.soundObj = game.createjs.Sound.play(walkSounds[Math.floor(Math.random() * walkSounds.length)]);
                this.sound.soundObj.volume = stepVolume * (0.5 + Math.random() * 0.5);
                this.sound.soundTick = 0;
            }
            this.setFrameStart();
            this.drawShadow(game);
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.properties.width, this.properties.height, this.properties.xPosDraw, this.properties.yPosDraw, this.properties.width, this.properties.height);
            if (game.hitboxVisible)
                this.drawHitBox(game);
        };
        return Player;
    }(Character_1.Character));
    exports.Player = Player;
});
define("Dialogue", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dialogue = (function () {
        function Dialogue(dialogues, imageMap, soundSrc) {
            this.dialogues = [];
            this.bubbleFrameCount = 0;
            this.dialogueIndex = -1;
            this.dialogues = dialogues;
            if (soundSrc)
                this.soundSrc = soundSrc;
            var thisDialogue = this;
            imageMap.forEach(function (img) {
                if (img.src === 'speech.png') {
                    thisDialogue.bubbleImg = img.img;
                }
            });
        }
        Dialogue.prototype.checkDialogueOk = function (game, nonPlayer) {
            var talkingDistance = 1;
            var talkingWidth = 1;
            var isDialogueOk = false;
            var playerXPos = game.level.getPlayer().properties.xPos;
            var playerYPos = game.level.getPlayer().properties.yPos;
            if (nonPlayer.direction.indexOf('left') !== -1) {
                if (nonPlayer.properties.xPos - 1 - talkingDistance < playerXPos && playerXPos < nonPlayer.properties.xPos &&
                    nonPlayer.properties.yPos - talkingWidth < playerYPos && playerYPos < nonPlayer.properties.yPos + talkingWidth) {
                    isDialogueOk = true;
                }
            }
            if (nonPlayer.direction.indexOf('right') !== -1) {
                if (nonPlayer.properties.xPos < playerXPos && playerXPos < nonPlayer.properties.xPos + talkingDistance + 1 &&
                    nonPlayer.properties.yPos - talkingWidth < playerYPos && playerYPos < nonPlayer.properties.yPos + talkingWidth) {
                    isDialogueOk = true;
                }
            }
            if (nonPlayer.direction.indexOf('front') !== -1) {
                if (nonPlayer.properties.xPos - talkingWidth < playerXPos && playerXPos < nonPlayer.properties.xPos + talkingWidth &&
                    nonPlayer.properties.yPos < playerYPos && playerYPos < nonPlayer.properties.yPos + talkingDistance) {
                    isDialogueOk = true;
                }
            }
            if (nonPlayer.direction.indexOf('back') !== -1) {
                if (nonPlayer.properties.xPos - talkingWidth < playerXPos && playerXPos < nonPlayer.properties.xPos + talkingWidth &&
                    nonPlayer.properties.yPos - talkingDistance < playerYPos && playerYPos < nonPlayer.properties.yPos) {
                    isDialogueOk = true;
                }
            }
            return isDialogueOk;
        };
        Dialogue.prototype.drawDialogueBubble = function (game, nonPlayer) {
            var frameIndex = Math.floor(this.bubbleFrameCount * 1 / 12) % 4;
            var frameStartX = frameIndex * game.blockLength;
            this.bubbleFrameCount++;
            if (!this.checkDialogueOk(game, nonPlayer))
                game.ctx.globalAlpha = 0.5;
            else {
                if (game.keyUpState[69]) {
                    if (this.dialogueIndex + 1 >= this.dialogues.length) {
                        this.dialogueIndex = -1;
                        game.level.dialogueBox.resetText();
                    }
                    else {
                        this.dialogueIndex++;
                        game.level.dialogueBox.setText(game.ctx, this.dialogues[this.dialogueIndex], this.soundSrc);
                    }
                    var targetOrientation = '';
                    switch (nonPlayer.orientation) {
                        case 'left':
                            targetOrientation = 'right';
                            break;
                        case 'right':
                            targetOrientation = 'left';
                            break;
                        case 'back':
                            targetOrientation = 'front';
                            break;
                        case 'front':
                            targetOrientation = 'back';
                            break;
                    }
                    game.level.getPlayer().direction = [targetOrientation];
                }
            }
            game.ctx.drawImage(this.bubbleImg, frameStartX, 0, game.blockLength, game.blockLength, nonPlayer.properties.xPosDraw, nonPlayer.properties.yPosDraw - nonPlayer.properties.height, game.blockLength, game.blockLength);
            if (!this.checkDialogueOk(game, nonPlayer))
                game.ctx.globalAlpha = 1;
        };
        return Dialogue;
    }());
    exports.Dialogue = Dialogue;
});
define("NonPlayer", ["require", "exports", "Character", "Dialogue"], function (require, exports, Character_2, Dialogue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NonPlayer = (function (_super) {
        __extends(NonPlayer, _super);
        function NonPlayer(properties, direction, action, frameCount, orientationFrames, imageMap, dialogues, dialogueSoundSrc) {
            var _this = _super.call(this, properties, direction, action, frameCount, orientationFrames, imageMap) || this;
            _this.dialogue = new Dialogue_1.Dialogue(dialogues, imageMap, dialogueSoundSrc);
            return _this;
        }
        NonPlayer.prototype.draw = function (game) {
            this.setPosDraw(game);
            this.setDirection(game);
            this.setFrameStart();
            this.drawShadow(game);
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.properties.width, this.properties.height, this.properties.xPosDraw, this.properties.yPosDraw, this.properties.width, this.properties.height);
            if (this.dialogue.dialogues.length > 0)
                this.dialogue.drawDialogueBubble(game, this);
            if (game.hitboxVisible)
                this.drawHitBox(game);
        };
        return NonPlayer;
    }(Character_2.Character));
    exports.NonPlayer = NonPlayer;
});
define("DialogueBox", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DialogueBox = (function () {
        function DialogueBox() {
            this.text = [];
            this.padding = 10;
            this.renderIndex = 0;
            this.soundTick = 0;
        }
        DialogueBox.prototype.reset = function (game) {
            if (game.canvas.width > 300) {
                this.width = 256;
            }
            else if (game.canvas.width > 200) {
                this.width = 192;
            }
            else {
                this.width = 128;
            }
            this.height = Math.floor(game.canvas.height / 4);
            this.xPosDraw = Math.round(game.canvas.width / 2 - this.width / 2);
            this.yPosDraw = Math.round(game.canvas.height - this.height - this.padding * 2);
        };
        DialogueBox.prototype.setText = function (ctx, text, soundSrc) {
            this.renderIndex = 0;
            this.textLength = text.length;
            this.text = this.getLines(ctx, text);
            if (soundSrc)
                this.soundSrc = soundSrc;
        };
        DialogueBox.prototype.resetText = function () {
            this.text = [];
        };
        DialogueBox.prototype.getLines = function (ctx, text) {
            var words = text.split(" ");
            var lines = [];
            var currentLine = words[0];
            for (var i = 1; i < words.length; i++) {
                var word = words[i];
                var width = ctx.measureText(currentLine + " " + word).width;
                if (width < this.width - this.padding) {
                    currentLine += " " + word;
                }
                else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        };
        DialogueBox.prototype.dialogueGradient = function (ctx, color) {
            var gradient;
            gradient = ctx.createLinearGradient(0, this.yPosDraw, 0, this.yPosDraw + this.height);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, color);
            return gradient;
        };
        DialogueBox.prototype.draw = function (game) {
            var c = game.ctx;
            c.fillStyle = this.dialogueGradient(c, "#ccffff");
            game.level.drawRoundRect(c, this.xPosDraw, this.yPosDraw, this.width, this.height, 8);
            c.fill();
            c.lineWidth = 2;
            c.strokeStyle = "#336666";
            c.stroke();
            var thisBox = this;
            var renderedLines = [];
            var renderIndexTemp = this.renderIndex;
            if (this.renderIndex < this.textLength) {
                this.text.forEach(function (line) {
                    if (renderIndexTemp > 0) {
                        if (renderIndexTemp < line.length) {
                            renderedLines.push(line.substr(0, renderIndexTemp));
                            renderIndexTemp = 0;
                        }
                        else {
                            renderedLines.push(line);
                            renderIndexTemp = renderIndexTemp - line.length;
                        }
                    }
                });
                var stepTicks = 10;
                var stepVolume = 0.2;
                if (this.sound)
                    this.soundTick++;
                if ((this.sound == undefined || this.soundTick >= stepTicks * (0.5 + Math.random() * 0.5))) {
                    this.sound = game.createjs.Sound.play(this.soundSrc);
                    this.sound.volume = stepVolume * (0.5 + Math.random() * 0.5);
                    this.soundTick = 0;
                }
            }
            else {
                renderedLines = this.text;
            }
            c.fillStyle = "#000000";
            c.font = "16px Determination";
            c.textAlign = "left";
            renderedLines.forEach(function (line, index) {
                c.fillText(line, Math.floor(thisBox.xPosDraw + thisBox.padding), Math.floor(thisBox.yPosDraw - 4 + 16 * (index + 1) + thisBox.padding));
            });
            if (this.renderIndex < this.textLength)
                this.renderIndex += 1 / 2;
        };
        return DialogueBox;
    }());
    exports.DialogueBox = DialogueBox;
});
define("Level", ["require", "exports", "Entity", "Character", "Player", "NonPlayer", "DialogueBox"], function (require, exports, Entity_1, Character_3, Player_1, NonPlayer_1, DialogueBox_1) {
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
            var sounds = [
                { src: "grass1.ogg", id: "walk1" },
                { src: "grass2.ogg", id: "walk2" },
                { src: "grass3.ogg", id: "walk3" },
                { src: "grass4.ogg", id: "walk4" },
                { src: "clem_blip.ogg", id: "clem_blip" }
            ];
            game.createjs.Sound.registerSounds(sounds, 'audio/');
            this.entities = { bottom: [], solid: [], ground: [], top: [] };
            this.seed = seed;
            this.seedGen = game.seedFunction(this.seed);
            this.dialogueBox = new DialogueBox_1.DialogueBox();
            var level = this;
            var playerPosTemp = playerPos;
            var applePlayer;
            applePlayer = new Player_1.Player({
                xPos: playerPosTemp[0],
                yPos: playerPosTemp[1],
                width: 32,
                height: 32,
                src: 'res/apple320.png',
                totalFrames: 40,
                framesPerRow: 10,
                animateSpeed: 1 / 12
            }, ['front'], 'normal', 0, {
                front: {
                    normal: 0,
                    walking: [1, 4],
                    running: [5, 9]
                },
                back: {
                    normal: 10,
                    walking: [11, 14],
                    running: [15, 19]
                },
                left: {
                    normal: 20,
                    walking: [21, 24],
                    running: [25, 29]
                },
                right: {
                    normal: 30,
                    walking: [31, 34],
                    running: [35, 39]
                }
            }, game.loadImageMap());
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
                    if (char.name === "clementine") {
                        var npClementine = void 0;
                        npClementine = new NonPlayer_1.NonPlayer({
                            src: 'res/clem.png',
                            xPos: pos[0],
                            yPos: pos[1],
                            width: char.width,
                            height: char.height,
                            totalFrames: 20,
                            framesPerRow: 5,
                            animateSpeed: 1 / 12
                        }, [char.direction], 'normal', 0, {
                            front: {
                                normal: 0,
                                walking: [1, 4]
                            },
                            back: {
                                normal: 5,
                                walking: [6, 9]
                            },
                            left: {
                                normal: 10,
                                walking: [11, 14]
                            },
                            right: {
                                normal: 15,
                                walking: [16, 19]
                            }
                        }, game.loadImageMap(), char.dialogue, char.dialogueSoundSrc);
                        level.setCharacter(npClementine);
                    }
                    else {
                        var charTemp = new Character_3.Character({
                            src: 'res/' + char.src,
                            xPos: pos[0],
                            yPos: pos[1],
                            width: char.width,
                            height: char.height,
                            totalFrames: char.totalFrames,
                            framesPerRow: char.framesPerRow,
                            animateSpeed: char.animateSpeed
                        }, ['front'], 'normal', 0, {
                            front: {
                                normal: 0,
                                walking: [1, 4]
                            },
                            back: {
                                normal: 5,
                                walking: [6, 9]
                            },
                            left: {
                                normal: 10,
                                walking: [11, 14]
                            },
                            right: {
                                normal: 15,
                                walking: [16, 19]
                            }
                        }, game.loadImageMap());
                        level.setCharacter(charTemp);
                    }
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
            this.dialogueBox.reset(game);
        }
        Level.prototype.randomPos = function () {
            var posArray = [Math.floor(this.seedGen() * this.blockWidth), Math.floor(this.seedGen() * this.blockHeight)];
            return posArray;
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
        Level.prototype.imageValid = function (img) {
            return img.height != 0;
        };
        Level.prototype.drawRoundRect = function (ctx, x, y, width, height, radius) {
            if (width < 2 * radius)
                radius = width / 2;
            if (height < 2 * radius)
                radius = height / 2;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
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
                if (thisLevel.withinWindowBounds(game, entity.properties.xPos, entity.properties.yPos) && thisLevel.imageValid(entity.img))
                    entity.draw(game);
            });
            this.entities.bottom.forEach(function (entity) {
                if (thisLevel.withinWindowBounds(game, entity.properties.xPos, entity.properties.yPos) && thisLevel.imageValid(entity.img))
                    entity.draw(game);
            });
            var _loop_1 = function (yIndex) {
                this_1.entities.ground.forEach(function (entity) {
                    if (Math.ceil(entity.properties.yPos) == yIndex && thisLevel.withinWindowBounds(game, entity.properties.xPos, entity.properties.yPos) && thisLevel.imageValid(entity.img)) {
                        entity.draw(game);
                    }
                });
            };
            var this_1 = this;
            for (var yIndex = 0; yIndex < this.height; yIndex++) {
                _loop_1(yIndex);
            }
            if (this.dialogueBox.text.length > 0) {
                this.dialogueBox.draw(game);
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
            game.keyUpState = [];
        };
        return Level;
    }());
    exports.Level = Level;
});
define("Game", ["require", "exports", "Level"], function (require, exports, Level_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = (function () {
        function Game(canvas, seedFunction, createjs) {
            this.fps = 0;
            this.hitboxVisible = false;
            this.frameCount = 0;
            this.blockLength = 32;
            this.keyState = [];
            this.keyUpState = [];
            this.joystickState = {
                down: false,
                moveX: 0,
                moveY: 0
            };
            this.images = [];
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.seedFunction = seedFunction;
            this.createjs = createjs;
            var thisGame = this;
            createjs.Sound.alternateExtensions = ["mp3"];
            setInterval(function () {
                thisGame.fps = thisGame.frameCount;
                thisGame.frameCount = 0;
            }, 1000);
            document.addEventListener("keydown", function (e) {
                if (e.ctrlKey || e.altKey || e.metaKey || document.activeElement === document.getElementById("seedInput")) {
                    return false;
                }
                thisGame.keyState[e.keyCode || e.which] = true;
            });
            document.addEventListener("keyup", function (e) {
                thisGame.keyUpState[e.keyCode || e.which] = true;
                thisGame.keyState[e.keyCode || e.which] = false;
            });
            this.loadCommonImages();
        }
        Game.prototype.loadLevel = function (seed) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "levels/a1.json", true);
            xhr.send();
            var thisGame = this;
            xhr.addEventListener("readystatechange", function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var lvl = JSON.parse(xhr.responseText);
                    thisGame.level = new Level_1.Level(thisGame, lvl.width, lvl.height, lvl.floor, lvl.playerPos, lvl.characters, lvl.entities, seed);
                }
            });
        };
        Game.prototype.loadCommonImages = function () {
            var bubbleImg = new Image();
            bubbleImg.src = 'res/speech.png';
            this.images.push({ src: 'speech.png', img: bubbleImg });
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
                else if (playerHB.xPos + playerHB.width > entityPos.xPos && playerHB.xPos < entityPos.xPos + 1) {
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
            game.ctx.fillRect(game.level.topLeftCornerPosX + this.properties.xPos * game.blockLength + this.hitbox.xPos, game.level.topLeftCornerPosY + this.properties.yPos * game.blockLength + this.hitbox.yPos, this.hitbox.width, this.hitbox.height);
        };
        Character.prototype.drawShadow = function (game) {
            game.ctx.fillStyle = "#000000";
            game.ctx.globalAlpha = 0.3;
            game.ctx.beginPath();
            game.ctx.ellipse(game.level.topLeftCornerPosX + this.properties.xPos * game.blockLength + this.properties.width / 2, game.level.topLeftCornerPosY + this.properties.yPos * game.blockLength + this.properties.height - 1, this.properties.width / 3, 3, 0, 0, 2 * Math.PI);
            game.ctx.fill();
            game.ctx.globalAlpha = 1;
        };
        Character.prototype.setDirection = function (game) {
            if (this.direction[0])
                this.orientation = this.direction[0];
            switch (this.action) {
                case 'normal':
                    this.frameIndex = eval('this.orientationFrames.' + this.orientation + '.' + this.action);
                    this.frameCount = 0;
                    break;
                case 'walking':
                case 'running':
                    this.frameIndex = Math.floor(this.frameCount * this.animateSpeed) % this.properties.totalFrames;
                    var totalFramesTemp = eval('this.orientationFrames.' + this.orientation + '.' + this.action + '[1] - this.orientationFrames.' + this.orientation + '.' + this.action + '[0] + 1');
                    var startingFrame = eval('this.orientationFrames.' + this.orientation + '.' + this.action + '[0]');
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
        };
        Character.prototype.draw = function (game) {
            this.setPosDraw(game);
            this.setDirection(game);
            this.setFrameStart();
            this.drawShadow(game);
            game.ctx.drawImage(this.img, this.frameStartX, this.frameStartY, this.properties.width, this.properties.height, this.properties.xPosDraw, this.properties.yPosDraw, this.properties.width, this.properties.height);
            if (game.hitboxVisible)
                this.drawHitBox(game);
        };
        return Character;
    }(Entity_2.Entity));
    exports.Character = Character;
});
define("index", ["require", "exports", "Game"], function (require, exports, Game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var game = null;
    var canvas, mainBody, gameBody, resizeTimer, debug = null;
    var paintBgColor = "#200040";
    var frameCounter = false;
    var pixelFactor = 3;
    var seedFunction;
    var createjs = null;
    var config = {
        showStart: true,
        debugVisible: false,
        hitboxVisible: false,
        pixelFactor: 3,
        joystickSize: 128
    };
    function gameInit(seedFunctionTemp, createjsTemp) {
        console.log("Ready!");
        seedFunction = seedFunctionTemp;
        createjs = createjsTemp;
        if (localStorage.getItem("config")) {
            config = JSON.parse(localStorage.getItem("config"));
        }
        if (config.showStart) {
            document.getElementById("playBtn").addEventListener("click", loadGame);
        }
        else {
            loadGame();
            document.getElementById("showStart").checked = false;
        }
    }
    exports.gameInit = gameInit;
    function loadGame() {
        canvas = document.createElement("canvas");
        mainBody = document.getElementsByTagName("body")[0];
        gameBody = document.getElementById("game");
        debug = document.getElementById("debug");
        mainBody.style.margin = "0";
        gameBody.appendChild(canvas);
        canvasSizeReset();
        window.addEventListener("resize", function (e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(canvasSizeReset, 250);
        });
        document.getElementById("start").remove();
        document.getElementById("settings").innerHTML = settingsScreen();
        document.querySelector("#settings > a").addEventListener("click", function () {
            if (this.parentElement.className === 'open') {
                this.parentElement.className = '';
            }
            else {
                this.parentElement.className = 'open';
            }
        });
        document.getElementById("seedBtn").addEventListener("click", loadGame2);
        document.getElementById("showStart").addEventListener("change", function (e) {
            config.showStart = document.getElementById("showStart").checked;
            updateConfig();
        });
        document.getElementById("showDebug").addEventListener("change", function (e) {
            config.debugVisible = document.getElementById("showDebug").checked;
            updateConfig();
        });
        document.getElementById("showHitbox").addEventListener("change", function (e) {
            config.hitboxVisible = document.getElementById("showHitbox").checked;
            game.hitboxVisible = !game.hitboxVisible;
            updateConfig();
        });
        if (localStorage.getItem("levelSeed"))
            document.getElementById("seedInput").setAttribute("value", localStorage.getItem("levelSeed"));
        if (config.debugVisible) {
            document.getElementById("showDebug").checked = true;
        }
        loadGame2();
        window.requestAnimationFrame(draw);
    }
    function updateConfig() {
        localStorage.setItem("config", JSON.stringify(config));
    }
    function loadGame2() {
        game = new Game_1.Game(canvas, seedFunction, createjs);
        var seedInputValue = document.getElementById("seedInput").value;
        game.loadLevel(seedInputValue);
        localStorage.setItem("levelSeed", seedInputValue);
        if (config.hitboxVisible) {
            game.hitboxVisible = true;
            document.getElementById("showHitbox").checked = true;
        }
        var joystick = {
            obj: document.getElementById("joystick"),
            stick: {
                obj: null,
                posX: 0, posY: 0
            },
            posX: 0, posY: 0
        };
        joystick.obj.innerHTML = drawJoystick();
        joystick.stick.obj = document.getElementById("stick");
        gameBody.addEventListener("touchstart", function (e) {
            joystick.obj.style.display = "block";
            joystick.posX = e.touches[0].clientX - config.joystickSize / 2;
            joystick.posY = e.touches[0].clientY - config.joystickSize / 2;
            joystick.obj.style.left = joystick.posX.toString();
            joystick.obj.style.top = joystick.posY.toString();
            game.joystickState.down = true;
        });
        gameBody.addEventListener("touchmove", function (e) {
            if (game.joystickState.down) {
                joystick.stick.posX = e.touches[0].clientX - joystick.posX;
                joystick.stick.posY = e.touches[0].clientY - joystick.posY;
                var _x = joystick.stick.posX - config.joystickSize / 2;
                var _y = joystick.stick.posY - config.joystickSize / 2;
                joystick.stick.obj.style.left = (joystick.stick.posX - config.joystickSize / 4).toString();
                joystick.stick.obj.style.top = (joystick.stick.posY - config.joystickSize / 4).toString();
                if (_y > -0.5 * _x && _y > 0.5 * _x)
                    game.joystickState.moveY = 1;
                else if (_y < -0.5 * _x && _y < 0.5 * _x)
                    game.joystickState.moveY = -1;
                else
                    game.joystickState.moveY = 0;
                if (_y < -2 * _x && _y > 2 * _x)
                    game.joystickState.moveX = -1;
                else if (_y < 2 * _x && _y > -2 * _x)
                    game.joystickState.moveX = 1;
                else
                    game.joystickState.moveX = 0;
            }
        });
        gameBody.addEventListener("touchend", function (e) {
            joystick.obj.style.display = "none";
            game.joystickState.down = false;
            game.joystickState.moveX = 0;
            game.joystickState.moveY = 0;
            joystick.stick.obj.style.left = config.joystickSize / 4;
            joystick.stick.obj.style.top = config.joystickSize / 4;
        });
        if (!createjs.Sound.initializeDefaultPlugins()) {
            console.warn("sound won't be played");
        }
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
        if (game.level && config.debugVisible) {
            debug.innerHTML = debugStatement();
        }
        else {
            debug.innerHTML = "";
        }
        window.requestAnimationFrame(draw);
    }
    function settingsScreen() {
        var settings = "";
        settings += "<a href='#'><i class='fas fa-cog'></i><span>Settings</span></a>";
        settings += "<section>";
        settings += "<section><span>seed:</span><input type='text' name='seedInput' id='seedInput' value='hello!'><input type='button' name='seedBtn' id='seedBtn' value='update'></section>";
        settings += "<section><label for='showDebug'><span>show debug</span><input type='checkbox' name='showDebug' id='showDebug'></label></section>";
        settings += "<section><label for='showHitbox'><span>show hitboxes</span><input type='checkbox' name='showHitbox' id='showHitbox'></label></section>";
        settings += "<section><label for='showStart'><span>show start screen</span><input id='showStart' name='showStart' type='checkbox' checked></label></section>";
        settings += "</section>";
        return settings;
    }
    function drawJoystick() {
        var joystick = "";
        joystick += "<div id='ring'><div id='stick'></div></div>";
        return joystick;
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
        debug += "direction : " + game.level.getPlayer().direction + "<br>";
        debug += "action : " + game.level.getPlayer().action + "<br>";
        debug += "joystickStateX : " + game.joystickState.moveX + "<br>";
        debug += "joystickStateY : " + game.joystickState.moveY + "<br>";
        return debug;
    }
    function canvasSizeReset() {
        canvas.width = window.innerWidth / pixelFactor;
        canvas.height = window.innerHeight / pixelFactor;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        if (game) {
            game.level.focusOnPlayer(game);
            game.level.dialogueBox.reset(game);
        }
    }
    function paintBg(color) {
        game.ctx.beginPath();
        game.ctx.rect(0, 0, canvas.width, canvas.height);
        game.ctx.fillStyle = color;
        game.ctx.fill();
    }
});
