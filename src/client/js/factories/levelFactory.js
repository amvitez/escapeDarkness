app.factory('levelFactory', function($http){
	var _level = {};
	var levelFactory = {};

	levelFactory.getLevels = function(){
		return $http.get('js/levels.json')
			.then(function(data){
				return data.data;
			});
	};

	levelFactory.getLevel = function(){
		if($.isEmptyObject(_level)){
			_level = JSON.parse(localStorage.getItem("level"));
		}

		return _level;
	};

	levelFactory.setLevel = function(level){
		localStorage.setItem("level", JSON.stringify(level));
		_level = level;
	};

	return levelFactory;
});