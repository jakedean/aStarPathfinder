module.exports = (function () {
  
  aStarProto = {

  	'openSet' : [],

  	'closedSet' : [],

  	'tracer' : [],

  	'current' : undefined,

  	'aStar' : function () {
  		var gameState = this.gameState,
  		    tempCurrent = undefined;
      for (var i = 0; i < this.openSet.length; i += 1) {
        if (!tempCurrent || this.openSet[i].getFScore(this.current) < tempCurrent.fScore) {
        	tempCurrent = this.openSet[i];
        }
      }  
      tempCurrent.id = 'Closed';
      this.myBoard.drawGameBoard();
      this.closedSet.push(tempCurrent);
      this.openSet.splice(this.openSet.indexOf(tempCurrent), 1);
      this.current = tempCurrent;
      console.log(tempCurrent);
      this.fillOpenSet(gameState);

      if (this.current === this.gameState[this.myBoard.endRow][this.myBoard.endCol]) {
      	console.log('Path found.');
      	this.setPath();
      	return;
      }
      return this.aStar();      
  	},

  	'fillOpenSet' : function () {
  		console.log('current ' + this.current);
  		var gameState = this.gameState;
      for (var i = this.current.col - 1; i < this.current.col + 1; i += 1) {
      	for (var k = this.current.row - 1; k < this.current.row + 1; k += 1) {
      		if (gameState[k] && gameState[k][i] &&
      			  this.current !== gameState[k][i] && 
      			  this.closedSet.indexOf(this.current) !== -1 &&
      			  this.openSet.indexOf(this.current) === - 1 &&
      			  gameState[k][i] !== 'Blocked'
      			  ) {
      			this.openSet.push(gameState[k][i])
      		}
      	}
      }
  	},

  	'setPath' : function (tile) {
  		console.log('setting path');
  		this.gameState[tile.parent.row][tile.parent.col].id = 'Path';
  		if(tile !== tile.parent) this.setPath(tile.parent);
  	}

  }
  
  var init = function (that) {
  	that.gameState = that.myBoard.gameState;
    var startTile = that.gameState[that.myBoard.startRow][that.myBoard.startCol];
  	startTile.parent = startTile;
  	startTile.gScore = 0;
	  that.openSet.push(startTile);
	  //that.aStar(that.gameState);
  	return that;
  }

  return function (OO) {

  	return init(Object.create(aStarProto).extend(OO));
  }

}());