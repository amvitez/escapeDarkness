app.controller('legendController', ['$scope', '$resource', function($scope, $resource){
	var LegendItem = $resource('/api/legend');

	LegendItem.query(function(results){
		$scope.legendItems = results;
	});

	$scope.legendItems = [];
}]);