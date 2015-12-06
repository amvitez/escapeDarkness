var app = angular.module('escapeApp', ['ngResource', 'ui.router'])
	.config(function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('start', {
				url: '/',
				templateUrl: '/views/start.html',
				controller: 'startController as startCtrl'
			})
			.state('game', {
				url: '/game',
				templateUrl: '/views/game.html',
				controller: 'gameController as gameCtrl'
			});
	});