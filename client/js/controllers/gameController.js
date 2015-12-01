app.controller('gameController', ['$state', '$resource', 'levelFactory', 'powerupFactory', 'highScoresFactory', function($state, $resource, levelFactory, powerupFactory, highScoresFactory){
	
	var gameCtrl = this;
	var level = levelFactory.getLevel();
	gameCtrl.legendItems = [];

	powerupFactory.getPowerups()
		.then(function(results){
			gameCtrl.legendItems = results;
		});

	gameCtrl.highScores = [];

	gameCtrl.isPaused = false;
	
	gameCtrl.createHighScore = function(){
		highScoresFactory.saveHighScore(gameCtrl.player, highScore);
		gameCtrl.player = "";
	}

	gameCtrl.confirmQuit = function(){
		gameCtrl.pause();
	}

	gameCtrl.quit = function(){
		// var p = new Promise(function(resolve, reject){ 
		// 	if(hasHighScore()){
		// 		logHighScore();
		// 	}
		// 	console.log(2);
		// 	resolve();
		// });
		
		clearLevel();
		$(".modal-backdrop").remove();
    	$state.go('start');
	}

	gameCtrl.highScoresClick = function(){
		gameCtrl.pause();
		highScoresFactory.getHighScores()
			.then(function(data){
				gameCtrl.highScores = data;
			});
	}

	gameCtrl.pause = function(){
		clearInterval(lightTimer);
		clearInterval(enemyTimer);
		gameCtrl.isPaused = true;
	}

	gameCtrl.resume = function(){
		enemyTimer = setInterval(moveEnemies, 300);
		lightTimer = setInterval(toggleLights, 1000);
		gameCtrl.isPaused = false;
	}

	gameCtrl.restart = function(){
		roundNumber = 1;
		setUpLevel(roundNumber);
	}

	//function launchGame(level){
	var stage;
	var border;
	var doorWidth = 50;
	var doorColor = "red";
	var door;
	var sideWithDoor;
	var doorPos, doorFrame1, doorFrame2;
	var wallWidth = 10;
	var canvasWidth = 1000;
	var canvasHeight = 600;
	var hero;
	var heroRadius = 10;
	var heroMoveIncrement;
	var enemyMoveIncrement = 10;
	var wallBuffer = heroRadius*2;
	var lightsOn = true;
	var enemies = new Map();
	var lightTimer;
	var enemyTimer;
	var invincibleTimer;
	var powerups = [];
	var lightsOnSoundID;
	var enemySoundID;
	var invincible = false;
	var invincibilityTimeLimit = 8000;
	var doorUnlocked;
	var breathingRoom = 100;

	var roundNumber = 1;
	var highScore = 0;

	function clearLevel(){
		clearInterval(lightTimer);
		clearInterval(enemyTimer);
	}

	function setUpLevel(roundNumber){
		//clean up after last level
		clearInterval(lightTimer);
		clearInterval(enemyTimer);

		powerups = [];
		doorUnlocked = false;

		heroMoveIncrement = 10;

		//Sound effects
		lightsOnSoundID = level.lightsOnSoundID;
		enemySoundID = level.enemySoundID;
		createjs.Sound.registerSound("../audio/"+level.lightsOnSound, lightsOnSoundID);
		createjs.Sound.registerSound("../audio/"+level.enemySound, enemySoundID);
		//End Sound effects

		stage = new createjs.Stage("canvas");
		//draw a rectangle the size of the canvas, filled in white
		border = new createjs.Shape();
		border.graphics.ss(wallWidth).s("black").f("White").r(0,0,1000,600);
		stage.addChild(border);

		//pick random location for door
		sideWithDoor = Math.floor(Math.random() * 4);
		var r1 = Math.floor(Math.random() * (canvasWidth - doorWidth)) + doorWidth/2;
		var r2 = Math.floor(Math.random() * (canvasHeight - doorWidth)) + doorWidth/2;
		door = new createjs.Shape();
		
		switch(sideWithDoor){
			case(0):
				doorPos = [r1,0];
				//TODO: get sizes and adjust the door frame values
				doorFrame1 = r1 - 2*heroRadius;
				doorFrame2 = r1 + 2*heroRadius;
				door.graphics.ss(wallWidth).s(doorColor).mt(r1-doorWidth/2,0).lt(r1+doorWidth/2,0).endStroke();
				break;
			case(1):
				doorPos = [canvasWidth,r2];
				doorFrame1 = r2 - 2*heroRadius;
				doorFrame2 = r2 + 2*heroRadius;
				door.graphics.ss(wallWidth).s(doorColor).mt(canvasWidth,r2-doorWidth/2).lt(canvasWidth,r2+doorWidth/2).endStroke();
				break;
			case(2):
				doorPos = [r1, canvasHeight];
				doorFrame1 = r1 - 2*heroRadius;
				doorFrame2 = r1 + 2*heroRadius;
				door.graphics.ss(wallWidth).s(doorColor).mt(r1-doorWidth/2,canvasHeight).lt(r1+doorWidth/2,canvasHeight).endStroke();
				break;
			default:
				doorPos = [0, r2];
				doorFrame1 = r2 - 2*heroRadius;
				doorFrame2 = r2 + 2*heroRadius;
				door.graphics.ss(wallWidth).s(doorColor).mt(0,r2-doorWidth/2).lt(0,r2+doorWidth/2).endStroke();
				break;
		}

		stage.addChild(door);

		// for(var i = 0; i < gameCtrl.legendItems; i++){
		// 	powerups.push(createPowerup(gameCtrl.legendItems[i].name, pgameCtrl.legendItems[i].image));
		// }

		powerupFactory.getPowerups()
			.then(function(powerupList){
				for(var i = 0; i < powerupList.length; i++){
					powerups.push(createPowerup(powerupList[i].name, 
						powerupList[i].image,
						powerupList[i].sound));
				}
			});

		

		// powerups.push(createPowerup(skate, "ED_power-speed.png", function(){
		// 	heroMoveIncrement *= 2;
		// }));
		// powerups.push(createPowerup(cloak, "ED_power-eye.png", function(){
		// 	hero.visible = false;
		// }));
		// powerups.push(createPowerup(invincible, "ED_power-shield.png", function(){
		// 	invincible = true;
		// 	invincibleTimer = setInterval(function(){ 
		// 		invincible = false;
		// 		clearInterval(invincibleTimer);
		// 		},
		// 		invincibilityTimeLimit);
		// }));
		// powerups.push(createPowerup(key, "ED_ghost-yellow.png", function(){
		// 	doorUnlocked = true;
		// }));

		hero = new createjs.Shape();
		hero.graphics.beginStroke("black").beginFill("Black").drawCircle(0, 0, heroRadius);
		//hero = new createjs.Bitmap("images/"+level.heroImages.down);
		//hero.scaleX = .15;
		//hero.scaleY = .15;
		var heroStart = randomLocation();
		hero.x = heroStart[0];
		hero.y = heroStart[1];
		stage.addChild(hero);

		//createEnemies(roundNumber, "images/"+level.enemyImages.down);
		createEnemies(roundNumber, "images/trump.png");

		stage.update();

		enemyTimer = setInterval(moveEnemies, 300);
		lightTimer = setInterval(toggleLights, Math.floor(Math.random() * 1000));
	}

	function randomLocation(objectWidth){
		objectWidth = typeof objectWidth !== 'undefined' ? objectWidth : 20;

		var x = Math.floor(Math.random() * (canvasWidth-2*objectWidth)) + objectWidth;
		var y = Math.floor(Math.random() * (canvasHeight-2*objectWidth)) + objectWidth;
		return [x,y];
	}

	function createPowerup(name, src, sound){
		var location = randomLocation();
		//p = new createjs.Shape()
		//p.graphics.beginStroke(color).beginFill(color).drawCircle(0, 0, heroRadius);
		p = new createjs.Bitmap("images/"+src);
		//p = new createjs.Shape();
		//p.graphics.beginStroke("blue").beginFill("blue").drawCircle(0, 0, heroRadius);
		p.scaleX = .2;
		p.scaleY = .2;
		p.x = location[0];
		p.y = location[1];
		p.name = name;
		stage.addChild(p);

		createjs.Sound.registerSound("../audio/"+sound, name);

		return p;
	}

	function createEnemies(num, imgSource){
		enemies = new Map();

		for(var i = 0; i < num; i++){
			var enemyStart = randomLocation();

			while(Math.abs(hero.x - enemyStart[0]) < breathingRoom || Math.abs(hero.y - enemyStart[1]) < breathingRoom){
				enemyStart = randomLocation();
			}

			var enemy = new createjs.Bitmap(imgSource);
			enemy.scaleX = .7;
			enemy.scaleY = .7;
			//var enemy = new createjs.Shape();
			//enemy.graphics.beginStroke("red").beginFill("red").drawCircle(0, 0, heroRadius);
			enemy.x = enemyStart[0];
			enemy.y = enemyStart[1];
			enemies.set(i, enemy);
			stage.addChild(enemy);
		}
	}

	function areTouching(obj1, obj2){
		var xDiff = Math.abs(obj1.x - obj2.x);
		var yDiff = Math.abs(obj1.y - obj2.y);

		if(xDiff <= 2*heroRadius && yDiff <= 2*heroRadius){
			return true;
		}

		return false;
	}

	function moveLeft(){
		var origX = hero.x;
		var origY = hero.y;
		//stage.removeChild(hero);
		//hero = new createjs.Bitmap("images/"+level.heroImages.left);
		//hero.scaleX = .15;
		//hero.scaleY = .15;
		hero.x = origX;
		hero.y = origY;
		//stage.addChild(hero);
		//stage.update();

		if(hero.x >= wallBuffer){
			hero.x -= heroMoveIncrement;
			stage.update();
		}else if(hero.x > 0){
			hero.x = 0;
			stage.update();
		}else if(sideWithDoor == 3 && hero.y > doorFrame1 && hero.y < doorFrame2){
			if(doorUnlocked){
				success();
			}
		}
		// if(0 < hero.x < wallBuffer){
		// 	hero.x -= hero.x;
		// }

		// else if(hero.x >= wallBuffer){
			
		// }else if(sideWithDoor == 3 && hero.y > doorFrame1 && hero.y < doorFrame2){
		// 	success();
		// }

		checkPowerups();
	}

	function moveUp(){
		var origX = hero.x;
		var origY = hero.y;
		//stage.removeChild(hero);
		//hero = new createjs.Bitmap("images/"+level.heroImages.up);
		//hero.scaleX = .15;
		//hero.scaleY = .15;
		hero.x = origX;
		hero.y = origY;
		//stage.addChild(hero);
		//stage.update();

		if(hero.y >= wallBuffer){
			hero.y -= heroMoveIncrement;
			stage.update();
		}else if(hero.y > 0){
			hero.y = 0;
			stage.update();
		}else if(sideWithDoor == 0 && hero.x > doorFrame1 && hero.x < doorFrame2){
			if(doorUnlocked){
				success();
			}
		}

		checkPowerups();
	}

	function moveRight(){
		var origX = hero.x;
		var origY = hero.y;
		// stage.removeChild(hero);
		// hero = new createjs.Bitmap("images/"+level.heroImages.right);
		// hero.scaleX = .15;
		// hero.scaleY = .15;
		hero.x = origX;
		hero.y = origY;
		// stage.addChild(hero);
		// stage.update();

		if(hero.x <= canvasWidth - wallBuffer - 2*heroRadius){
			hero.x += heroMoveIncrement;
			stage.update();
		}else if(hero.x < canvasWidth - 2*heroRadius){
			hero.x = canvasWidth - 2*heroRadius;
			stage.update();
		}else if(sideWithDoor == 1 && hero.y > doorFrame1 && hero.y < doorFrame2){
			if(doorUnlocked){
				success();
			}
		}

		checkPowerups();
	}

	function moveDown(){
		var origX = hero.x;
		var origY = hero.y;
		// stage.removeChild(hero);
		// hero = new createjs.Bitmap("images/"+level.heroImages.down);
		// hero.scaleX = .15;
		// hero.scaleY = .15;
		hero.x = origX;
		hero.y = origY;
		// stage.addChild(hero);
		// stage.update();

		if(hero.y <= canvasHeight - wallBuffer - 2*heroRadius){
			hero.y += heroMoveIncrement;
			stage.update();
		}else if(hero.y < canvasHeight - 2*heroRadius){
			hero.y = canvasHeight - 2*heroRadius;
			stage.update();
		}else if(sideWithDoor == 2 && hero.x > doorFrame1 && hero.x < doorFrame2){
			if(doorUnlocked){
				success();
			}
		}

		checkPowerups();
	}

	function pause(){
		gameCtrl.isPaused = true;
	}

	function moveEnemies(){
		if(gameCtrl.isPaused) return;

		for(var i = 0; i < enemies.size; i++){
			var enemy = enemies.get(i);

			if(hero.isVisible()){
				var xDiff = Math.abs(hero.x - enemy.x);
				var yDiff = Math.abs(hero.y - enemy.y);

				if(xDiff > yDiff){
					if(hero.x > enemy.x){
						enemy.x += enemyMoveIncrement;
					}
					else{
						enemy.x -= enemyMoveIncrement;
					}
				}
				else{
					if(hero.y > enemy.y){
						enemy.y += enemyMoveIncrement;
					}else{
						enemy.y -= enemyMoveIncrement;
					}
				}

				if(!invincible && areTouching(hero, enemy)){
					clearLevel();
					gameOver();
				}
			}else{
				var direction = Math.floor(Math.random() * 4);
				switch(direction){
					case(0):
						enemy.x -= enemyMoveIncrement; break;
					case(1):
						enemy.x += enemyMoveIncrement; break;
					case(2):
						enemy.y -= enemyMoveIncrement; break;
					case(3):
						enemy.y += enemyMoveIncrement; break;
					default: break;
				}
			}
		}
		
		stage.update();
	}

	function checkPowerups(){
		for(var i = 0; i < powerups.length; i++){
			checkPowerup(powerups[i]);
		}
	}

	function checkPowerup(p){
		if(areTouching(hero, p)){
			activate(p.name);
			stage.removeChild(p);

			createjs.Sound.play(p.name);

			var index = powerups.indexOf(p);
			if(index > -1){
				powerups.splice(index, 1);
			}

			stage.update();
		}
	}

	function activate(name){
		switch(name){
			case "speed":
				heroMoveIncrement *= 2;
				break;
			case "cloak":
				hero.visible = false;
				break;
			case "shield":
				invincible = true;
				invincibleTimer = setInterval(function(){ 
					invincible = false;
					clearInterval(invincibleTimer);
				},invincibilityTimeLimit);
				break;
			case "key":
				doorUnlocked = true;
				break;
		}
	}

	function toggleLights(){
		if(gameCtrl.isPaused) return;

		lightsOn = !lightsOn;

		var soundTriggered = false;

		for(var i = 0; i < enemies.size; i++){
			var enemy = enemies.get(i);
			var xDiff = Math.abs(hero.x - enemy.x);
			var yDiff = Math.abs(hero.y - enemy.y);

			if(lightsOn && !soundTriggered && xDiff < 100 && yDiff < 100){
				soundTriggered = true;
				createjs.Sound.play(enemySoundID);
			}

			enemy.visible = lightsOn;
		}

		for(var i = 0; i < powerups.length; i++){
			powerups[i].visible = lightsOn;
		}

		if(lightsOn){
			createjs.Sound.play(lightsOnSoundID);
			border.graphics.ss(wallWidth).s("black").f("white").r(0,0,1000,600);
		}
		else{
			border.graphics.ss(wallWidth).s("black").f("black").r(0,0,1000,600);
		}

		clearInterval(lightTimer);
		lightTimer = setInterval(toggleLights, Math.floor(Math.random() * 3000));
	}

	function success(){
		//$.post('/', {levelNumber: level.number, roundNumber: level.numOfEnemies + 1});
		setUpLevel(++roundNumber);
	}

	function hasHighScore(){
		return highScoresFactory.getScoreToBeat()
			.then(function(results){
				scoreToBeat = results;
				return roundNumber >= scoreToBeat;
			});
	}

	function logHighScore(){
		$("#highScoreForm").modal({
			keyboard: false,
			backdrop: 'static'
		});

		highScore = roundNumber;
	}

	function gameOver(){
		if(hasHighScore()){
			logHighScore();
		}
		else{
			$("#gameOverModal").modal({
				keyboard: false,
				backdrop: 'static'
			});

			$("#gameOverModal button").click(function(){
				$("#gameOverModal").modal('hide');
				$(".modal-backdrop").remove();
			});

			// roundNumber = 1;
			// setUpLevel(roundNumber);
		}
	}

	$("#highScoreForm button[type='submit']").click(function(){
		if(gameCtrl.player && gameCtrl.player.length > 0){
			$("#highScoreForm").modal('hide');
			roundNumber = 1;
			setUpLevel(roundNumber);
		}
	});

	$(document).keydown(function(event){
		switch (event.keyCode) {
	        // case 37: moveLeft(); break;
	        // case 38: moveUp(); break;
	        // case 39: moveRight(); break;
	        // case 40: moveDown(); break;
	        case 75: moveLeft(); break;
	        case 79: moveUp(); break;
	        case 186: moveRight(); break;
	        case 76: moveDown(); break;
	        case 67: hero.visible = true; break; //if user presses "c" they drop the cloak
	        //case 80: pause = !pause; break; // P = pause
	    }
	});

	setUpLevel(roundNumber);
}]);