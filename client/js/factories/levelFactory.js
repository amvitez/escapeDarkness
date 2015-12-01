app.factory('levelFactory', function($http){
	var _level = { };
	var levelFactory = {};

	levelFactory.getLevels = function(){
		return $http.get('js/levels.json')
			.then(function(data){
				return data.data;
			});
	};

	levelFactory.getLevel = function(){
		return _level;
	};

	levelFactory.setLevel = function(level){
		_level = level;
	};

	return levelFactory;
})