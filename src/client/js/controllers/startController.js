app.controller('startController', ['levelFactory', function(levelFactory){
	
	var startCtrl = this;
	startCtrl.selectedLevel = 1;

	var lightsOnSoundID = "thunder";
	var lightsOn = true;
	var lightTimer;

	createjs.Sound.registerSound("../audio/Thunder1.mp3", lightsOnSoundID);
	lightTimer = getToggleLightsInterval();

	levelFactory.getLevels()
		.then(function(data){
			startCtrl.levels = data;
		});

	startCtrl.startLevel = function(){
		//TODO: get selectedLevel
		clearInterval(lightTimer);
		var level = {};

		if(startCtrl.levels && startCtrl.levels.length > 0)
			level = startCtrl.levels[startCtrl.selectedLevel-1];

		levelFactory.setLevel(level);
	};

	function toggleLights(){
		lightsOn = !lightsOn;

		if(!lightsOn){
			createjs.Sound.play(lightsOnSoundID);
		}

		$(".start-menu").toggleClass("start-menu-background", "no-background");
		$(".darkness").toggleClass("darkness-background", "no-background");

		clearInterval(lightTimer);
		lightTimer = getToggleLightsInterval();
	}

	function getToggleLightsInterval(){
		return setInterval(toggleLights, Math.floor(Math.random() * 3000));
	}
}]);