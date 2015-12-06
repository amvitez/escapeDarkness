app.factory('highScoresFactory', function($resource){
	var highScoresFactory = {};
	var HighScores = $resource('/api/highScores');

	highScoresFactory.saveHighScore = function(player, round){
		HighScores.save({player:player, round:round});
	};	

	highScoresFactory.getHighScores = function(){
		return HighScores.query()
			.$promise
			.then(function(results){
				return results;
			});
	};

	highScoresFactory.getScoreToBeat = function(){
		return HighScores.query()
			.$promise
			.then(function(results){
				return results.length < 10 ? 0 : results[9].round;
			});
	};

	return highScoresFactory;
});