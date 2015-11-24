app.controller('highScoresController', ['$scope', '$resource', function($scope, $resource){
	var HighScore = $resource('/api/highScores');

	HighScore.query(function(results){
		$scope.highScores = results;
	});

	$scope.highScores = [];
	
	$scope.createHighScore = function(){
		var highScore = new HighScore();
		highScore.player = $scope.player;
		highScore.round = $scope.round;
		$scope.player = "";
		highScore.$save(function(result){
			$scope.highScores.push(result);
		});
	}
}]);