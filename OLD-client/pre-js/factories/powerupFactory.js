app.factory('powerupFactory', function($http){
	var powerupFactory = {};

	powerupFactory.getPowerups = function(){
		return $http.get('js/powerups.json')
			.then(function(data){
				return data.data;
			});
	}

	return powerupFactory;
})