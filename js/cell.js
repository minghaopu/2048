app.directive("cell", function() {
	var inHTML = "<div class=\"cell-wrapper cell-{{cell.x}}-{{cell.y}}\" >";
	inHTML += "<div class=\"cell-inner number-{{cell.value}} \">{{cell.value==0?\"\":cell.value}}</div>";
	inHTML += "</div>";

	return {
		restrict: "A",
		replace: true,
		template: inHTML,

		
		link: function(scope, ele, attr) {
	
			scope.$parent.cellContainer.position[scope.cell.x][scope.cell.y] = scope.$index;
			scope.cell.moveCell = function(offset) {
				var cellContainer = scope.$parent.cellContainer;
				var grid = cellContainer.grid;
				var position = cellContainer.position;
				var score = cellContainer.score;

				var newX = scope.cell.x - offset.deltaX;
				var newY = scope.cell.y - offset.deltaY;
				var oldX = scope.cell.x;
				var oldY = scope.cell.y;

				while (newX < 5 && newX > -2 && newY < 5 && newY > -2) {
					if (newX === 4 || newX === -1 || newY === 4 || newY === -1) {
						newX = newX + offset.deltaX;
						newY = newY + offset.deltaY;
						break;
					}
					if (position[newX][newY] === -1) {
						newX = newX - offset.deltaX;
						newY = newY - offset.deltaY;
					} else if (grid[position[newX][newY]].previousPostion === null) {
						if (grid[position[newX][newY]].value == scope.cell.value) {
							break;
						} else {
							newX += offset.deltaX;
							newY += offset.deltaY;
							break;
						}
					} else {
						newX += offset.deltaX;
						newY += offset.deltaY;
						break;
					}
				}

				if (newX !== scope.cell.x || newY !== scope.cell.y) {
					cellContainer.moveFlag = true;
					if (position[newX][newY] === -1) {
						scope.cell.x = newX;
						scope.cell.y = newY;

						position[newX][newY] = scope.$index;
						scope.cell.previousPostion = null;
						position[oldX][oldY] = -1;
						scope.$apply()

					} else if (grid[position[newX][newY]].value == scope.cell.value && grid[position[newX][newY]].previousPostion === null) {
						scope.cell.x = newX;
						scope.cell.y = newY;
						scope.cell.previousPostion = {
							x: oldX,
							y: oldY
						}
						scope.cell.value += grid[position[newX][newY]].value;
						cellContainer.score += scope.cell.value;
						var oldIndex = position[newX][newY]
						position[newX][newY] = scope.$index;
						position[oldX][oldY] = -1;

						grid.splice(oldIndex,1);
						updateIndex(oldIndex, grid, position);
						
					}
				}

			};
			var updateIndex = function(index, grid, position){
				for(var i = index; i <grid.length; i++){
					position[grid[i].x][grid[i].y] = i;

				}
				scope.$parent.$apply();
			}

		}
	}
});