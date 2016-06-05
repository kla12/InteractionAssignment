var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
function Coin(game, spritesheet, x, y) {
    this.animation = new Animation(spritesheet, 100, 100, 10, .1, 10, true, .5);
    this.speed = 400;
    this.ctx = game.ctx;
    x = Math.floor(Math.random() * 1350);
    y = Math.floor(Math.random() * 750);
    Entity.call(this, game, x, y);
    
}

Coin.prototype = new Entity();
Coin.prototype.constructor = Coin;

Coin.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Coin.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
function Jeb(game, spritesheet) {
    this.animation = new Animation(spritesheet, 49, 48.2, 3, .2, 3, true, 2);
    this.speed = 100;
    this.ctx = game.ctx;
    xpos = Math.floor(Math.random() * 1275);
    ypos = Math.floor(Math.random() * 650);
    Entity.call(this, game, xpos, ypos);
    
}

Jeb.prototype = new Entity();
Jeb.prototype.constructor = Coin;
dir = 4;
var prefDir = -1;

Jeb.prototype.update = function () {
	switch (dir) {
		//RIGHT
		case 0: {
			this.x += this.game.clockTick * this.speed;
			break;
		}
		//LEFT
		case 1: {
			this.x -= this.game.clockTick * this.speed;
			break;
		}
		//DOWN
		case 2: {
			this.y += this.game.clockTick * this.speed;
			break;
		}
		//UP
		case 3: {
			this.y -= this.game.clockTick * this.speed;
			break;
		}
		//STILL
		case 4: {
			this.y = this.y;
			this.x = this.x;
		}
	}
	
	//FIND CLOSEST COIN
	//MY COORDS
	console.log("finding closest coin")
	var myX = this.game.entities[0].x;
    var myY = this.game.entities[0].y;
	closestDistance = 10000;
	closestCoin = 0;
	
	for (i = 1; i < this.game.entities.length; i++) {
		//COIN COORDS
		coinX = this.game.entities[i].x;
		coinY = this.game.entities[i].y;
		
		//DISTANCE VARS
		var dX = myX - coinX;
        var dY = myY - coinY;

		//FINDING THE DISTANCE
        var dist = Math.sqrt(dX * dX + dY * dY);
        if(dist < closestDistance) {
            closestDistance = dist;
            closestCoin = i;
        }
        console.log("closest coin is coin #" + closestCoin);
	}
	
	if (closestDistance < 20) {
		this.game.entities.splice(closestCoin, 1);
		this.game.addEntity(new Coin(this.game, AM.getAsset("./img/coins.png"), 0, 0));
	} else if (closestCoin > 0) {
		closestX = this.game.entities[closestCoin].x;
        closestY = this.game.entities[closestCoin].y;
            
		var downDist = Math.sqrt((myX - closestX) * (myX - closestX) + (myY - closestY+1) * (myY - closestY+1));
		var rightDist = Math.sqrt((myX - closestX+1) * (myX- closestX+1) + (myY - closestY) * (myY - closestY));
		var leftDist = Math.sqrt((myX - closestX-1) * (myX - closestX-1) + (myY - closestY) * (myY - closestY));
		var upDist = Math.sqrt((myX - closestX) * (myX - closestX) + (myY - closestY-1) * (myY - closestY-1));
	}
	
	var newDir = 0;
	var lowestDist = Math.min(downDist, rightDist, leftDist, upDist);
	
		//ASSIGNING LOWEST DIST TO NEWDIR
		if(lowestDist === leftDist) {
            newDir = 1;
        }
        if(lowestDist === rightDist) {
            newDir = 0;
        }
        if(lowestDist === upDist) {
            newDir = 3;
        }
        if(lowestDist === downDist) {
            newDir = 2;
        }
        
		var curr = dir;
		
		//CHECKING IF JEB HAS GONE AS FAR AS HE CAN IN HIS CURRENT DIRECTION
		//IF YES, CHANGE DIRECTION TO THE DIRECTION WITH THE SHORTEST DISTANCE
		if (dir === 0) {
			if (myX >= closestX) {
				dir = newDir;
			}
		} else if (dir === 1) {
			if (myX <= closestX) {
				dir = newDir;
			}
		} else if (dir === 2) {
			if (myY >= closestY) {
				dir = newDir;
			}
		} else if (dir === 3) {
			if (myY <= closestY) {
				dir = newDir;
			}
		} else {
			dir = newDir;
		}
		
		//CHANGING THE SPRITESHEETS (FOR DIFFERENT DIRECTIONS)
		if(dir === curr) {
			
		} else if (dir === 0) {
			this.animation = new Animation(AM.getAsset("./img/jebRight.png"), 49, 48.2, 3, .1, 3, true, 2);
		} else if (dir === 1) {
			this.animation = new Animation(AM.getAsset("./img/jebLeft.png"), 49, 48.2, 3, .1, 3, true, 2);
		} else if (dir === 2) {
			this.animation = new Animation(AM.getAsset("./img/jebDown.png"), 49, 48.2, 3, .1, 3, true, 2);
		} else if (dir === 3) {
			this.animation = new Animation(AM.getAsset("./img/jebUp.png"), 49, 48.2, 3, .1, 3, true, 2);
		}
		
    Entity.prototype.update.call(this);
	
}

Jeb.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/coins.png");
AM.queueDownload("./img/jebDown.png");
AM.queueDownload("./img/jebLeft.png");
AM.queueDownload("./img/jebRight.png");
AM.queueDownload("./img/jebUp.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Jeb(gameEngine, AM.getAsset("./img/jebLeft.png")));
	for(i = 0; i < 5; i++) {
		gameEngine.addEntity(new Coin(gameEngine, AM.getAsset("./img/coins.png"), 0, 0));
	}
	
    console.log("All Done!");
});
