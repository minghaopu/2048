 // JavaScript Document
var app = angular.module("app", ["ngTouch"]);
app.controller("gameController", function($scope) {
	$scope.gameInfo = {}
	

	if(window.localStorage){

		if(!angular.isDefined(localStorage.gameStorage)){
			var gameStorage= {
				position: [],
				grid: [],
				bestScore: 0,
				score: 0
			};
			localStorage.gameStorage = JSON.stringify(gameStorage);
		}
		angular.copy(JSON.parse(localStorage.gameStorage),$scope.gameInfo);
		
	}

	window.onbeforeunload=function(){
		var gameStorage = {};
		gameStorage.position = $scope.gameInfo.position;
		gameStorage.grid = $scope.gameInfo.grid;
		gameStorage.bestScore = $scope.gameInfo.bestScore;
		gameStorage.score = $scope.gameInfo.score;
		localStorage.gameStorage = JSON.stringify(gameStorage);
	}

});
