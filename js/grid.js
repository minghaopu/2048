app.directive("cellContainer",["$document","$compile", function($document,$compile){
	var inHTML = 	"<div class=\"cell-container-wrapper\" >";
		inHTML +=		"<div class=\"control-container\">";
		inHTML +=			"<div class=\"score-container\">";
		inHTML +=				"<span class=\"score-title\">Score</span>";
		inHTML +=				"<span class=\"score-text\">{{cellContainer.score}}</span>";
		inHTML +=			"</div>";
		inHTML +=			"<div class=\"score-container\">";
		inHTML +=				"<span class=\"score-title\">Best Score</span>";
		inHTML +=				"<span class=\"score-text\">{{cellContainer.bestScore}}</span>";
		inHTML +=			"</div>";
		inHTML +=			"<div class=\"button-container\">";
		inHTML +=				"<div class=\"button\" ng-click=\"startGame()\">New Game</div>";
		inHTML +=				"<div class=\"button\" ng-click=\"clearHistory()\">Clear History</div>";
		inHTML +=			"</div>";		
		inHTML +=		"</div>";
		inHTML +=		"<div class=\"grid-container\">";
		inHTML +=			"<div class=\"grid-row\">";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=			"</div>";
		inHTML +=			"<div class=\"grid-row\">";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=			"</div>";
		inHTML +=			"<div class=\"grid-row\">";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=			"</div>";
		inHTML +=			"<div class=\"grid-row\">";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=				"<div class=\"grid-cell\"></div>";
		inHTML +=			"</div>";
		inHTML +=		"</div>";
		inHTML +=		"<div class=\"cell-container-content\">";
		inHTML +=			"<div cell ng-repeat=\"cell in cellContainer.grid\"></div>";
		inHTML +=		"</div>";
		inHTML += 		"<div id=\"game-over-container\" class=\"mask\" ng-if=\"gameOverFlag\" >";
		inHTML +=			"<div id=\"game-over-container-content\">"
		inHTML +=				"<div class=\"title\">Game Over!</div>"
		inHTML +=				"<div class=\"score-container\">";
		inHTML +=					"<span class=\"score-title\">score</span>";
		inHTML +=					"<span class=\"score-text\">{{cellContainer.score}}</span>";
		inHTML +=				"</div>";
		inHTML +=				"<div class=\"button-container\">";
		inHTML +=					"<div id=\"restart-btn\" class=\"button\" ng-click=\"restartGame()\">Restart Game</div>";
		inHTML +=				"</div>";
		inHTML +=			"</div>"
		inHTML +=		"</div>"
		inHTML += 	"</div>";

	return {
		restrict: "A",
		replace: true,
		template: inHTML,
		scope:{
			cellContainer: "=ngModel"
		},
		controller:["$scope", "$element", function($scope, $element){
			$scope.gameOverFlag = false;
			var init = function(){
				var defaults = {
					moveFlag: false,
					initCell: 2,
					bestScore: 0,
					position: [],
					grid: [],
					score: 0
				};
				for (var i = 0; i < 4; i++) {
					defaults.position[i] = new Array();
					for(var j = 0; j<4; j++) {
						defaults.position[i][j] = -1;
					}
				};
				if($scope.cellContainer.score!==0){
					$scope.cellContainer = angular.extend({}, defaults, $scope.cellContainer);
				}else{
					angular.copy(defaults, $scope.cellContainer);
					var count = 2;
					var x, y;

					while(count>0){
						x = Math.floor(Math.random()*4);
						y = Math.floor(Math.random()*4);
						if($scope.cellContainer.position[x][y] === -1){
							var cell = {
								x: x,
								y: y,
								//moved: false,
								value: Math.random()>0.8?4:2,
								previousPostion: null
							};

							$scope.cellContainer.grid.push(cell);
							$scope.cellContainer.position[x][y] = 99;
							count--;
						};
					}
					
				}
			}();

			var keymap = function(event) {
				var map = {
					38: 0, // Up
					39: 1, // Right
					40: 2, // Down
					37: 3, // Left
					75: 0, // Vim up
					76: 1, // Vim right
					74: 2, // Vim down
					72: 3, // Vim left
					87: 0, // W
					68: 1, // D
					83: 2, // S
					65: 3 // A
				};

				var offset = {
					x: 0,
					y: 0,
					deltaX: 0,
					deltaY: 0,
					direction: 0 // 0 = horizontal, 1 = vertical
				}
				switch (map[event.which]) {
					case 0: //up
						offset.deltaY = 1;
						offset.deltaX = 0;
						offset.x = 0;
						offset.y = 0;
						offset.direction = 1;
						break;
					case 1: //right
						offset.deltaY = 0;
						offset.deltaX = -1;
						offset.x = 3;
						offset.y = 0;
						offset.direction = 0;
						break;
					case 2: //down
						offset.deltaY = -1;
						offset.deltaX = 0;
						offset.x = 0;
						offset.y = 3;
						offset.direction = 1;
						break;
					case 3: //left
						offset.deltaY = 0;
						offset.deltaX = 1;
						offset.x = 0;
						offset.y = 0;
						offset.direction = 0;
						break;
					default:
						return false;
				}
				event.preventDefault();
				return offset;
			}

			var move = function(offset) {
				
				var deltaX = offset.deltaX||1;
				var deltaY = offset.deltaY||1;
				if(offset.direction == 1){
					for (var i = offset.x; i < 4 && i > -1; i += deltaX) {
						for (var j = offset.y; j < 4 && j > -1; j += deltaY) {
							if($scope.cellContainer.position[i][j] === -1) continue;
							$scope.cellContainer.grid[$scope.cellContainer.position[i][j]].moveCell(offset);
						}

					}
				}else{
					for (var j = offset.y; j < 4 && j > -1; j += deltaY) {
						for (var i = offset.x; i < 4 && i > -1; i += deltaX) {
							if($scope.cellContainer.position[i][j] === -1) continue;

							$scope.cellContainer.grid[$scope.cellContainer.position[i][j]].moveCell(offset);
						}

					}
					

				}

				setTimeout(function(){

					addRandomCell();
					$scope.$apply();
					for(var i = 0; i < $scope.cellContainer.grid.length;i++){
						$scope.cellContainer.grid[i].previousPostion = null;
					}
					checkending();
				},150);
			}

			var addRandomCell = function(){
				if($scope.cellContainer.grid.length !== 16&&$scope.cellContainer.moveFlag===true){
					var count = $scope.cellContainer.grid.length===15?1:2;
					var x, y;
					while(count>0){
						x = Math.floor(Math.random()*4);
						y = Math.floor(Math.random()*4);
						if($scope.cellContainer.position[x][y] === -1){


							var cell = {
								x: x,
								y: y,
								//moved: false,
								value: Math.random()>0.8?4:2,
								previousPostion: null
							};
							$scope.cellContainer.grid.push(cell);
							$scope.cellContainer.position[x][y] = 99;

							count--;
							//$scope.$apply()
						}
					}
					$scope.cellContainer.moveFlag = false;
				}
			}

			var checkending = function(){
				var position = $scope.cellContainer.position;
				var check = 0;
				for(var i = 0; i<4; i++){
					if(i%2==0){
						for(var j = 1;j<4;j+=2){
							if(position[i][j]===-1)continue;
							value = $scope.cellContainer.grid[position[i][j]].value;
							if(position[i][j-1]!=-1){
								if(value !== $scope.cellContainer.grid[position[i][j-1]].value) check++;
							}
							if(j+1<4){
								if(position[i][j+1]!=-1){
									if(value !== $scope.cellContainer.grid[position[i][j+1]].value) check++;
								}
							}
							if(i-1>0){
								if(position[i-1][j]!=-1){
									if(value !== $scope.cellContainer.grid[position[i-1][j]].value) check++;
								}
							}
							if(position[i+1][j]!=-1){
								if(value !== $scope.cellContainer.grid[position[i+1][j]].value) check++;
							}
							
						}
					}else{
						for(var j = 0;j<3;j+=2){
							if(position[i][j]===-1)continue;
							value = $scope.cellContainer.grid[position[i][j]].value;
							if(j-1>0){
								if(position[i][j-1]!=-1){
									if(value !== $scope.cellContainer.grid[position[i][j-1]].value) check++;
								}
							}
							if(position[i][j+1]!=-1){
								if(value !== $scope.cellContainer.grid[position[i][j+1]].value) check++;
							}
							if(position[i-1][j]!=-1){
								if(value !== $scope.cellContainer.grid[position[i-1][j]].value) check++;
							}
							if(i+1<4){
								if(position[i+1][j]!=-1){
									if(value !== $scope.cellContainer.grid[position[i+1][j]].value) check++;
								}
							}
						}
					}
				}
				if(check===24){
					$scope.gameOverFlag = true;
					$scope.$apply()
				}
			}

			$scope.startGame = function(){
				$scope.cellContainer.bestScore = $scope.cellContainer.score;
				$scope.cellContainer.score = 0;
				$scope.cellContainer.grid.length = 0;
				for(var i= 0;i<4;i++){
					for(var j=0;j<4;j++){
						$scope.cellContainer.position[i][j] = -1;
					}
				}
				var count = 2;
				var x, y;

				while(count>0){
					x = Math.floor(Math.random()*4);
					y = Math.floor(Math.random()*4);
					if($scope.cellContainer.position[x][y] === -1){
						var cell = {
							x: x,
							y: y,
							moved: false,
							value: Math.random()>0.8?4:2,
							previousPostion: null
						};

						$scope.cellContainer.grid.push(cell);
						$scope.cellContainer.position[x][y] = 99;
						count--;
					};
				}
			}

			$scope.restartGame = function(){
				$scope.gameOverFlag = false;
				$scope.cellContainer.bestScore = $scope.cellContainer.score;
				$scope.startGame();
			}

			$scope.clearHistory = function(){
				$scope.cellContainer.score = 0;
				$scope.gameOverFlag = false;
				$scope.startGame();
			}

			$document.bind("keydown", function(event){
				var offset = keymap(event);
				move(offset)
			});
			
		}]
	}
}]);