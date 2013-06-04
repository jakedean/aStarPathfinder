module.exports = (function () {
  
  aStarProto = {

  	'openSet' : [],

  	'closedSet' : [],

  	'tracer' : [],

    'immediateSet' : [],

  	'current' : undefined,

  	'aStar' : function () {
  		var gameState = this.gameState,
  		    tempCurrent;

      if (this.immediateSet.length) {
        this.immediateSet[0].getFScore(this.current);
        for (var i = 0; i < this.immediateSet.length; i += 1) {
          if (!tempCurrent || this.immediateSet[i].getFScore(this.current) < tempCurrent.fScore) {
            tempCurrent = this.immediateSet[i];
          }
        }
      } else {
        this.openSet[0].getFScore(this.current);
        for (var i = 0; i < this.openSet.length; i += 1) {
          if (!tempCurrent || this.openSet[i].getFScore(this.current) < tempCurrent.fScore) {
          	tempCurrent = this.openSet[i];
          }
        }
      }
      this.closedSet.push(tempCurrent);
      this.openSet.splice(this.openSet.indexOf(tempCurrent), 1);
      this.current = tempCurrent;
      this.fillOpenSet(gameState);

      if (this.current === this.gameState[this.myBoard.endRow][this.myBoard.endCol]) {
      	console.log('Path found.');
      	this.setPath(this.current.parent);
      	this.myBoard.drawGameBoard();
      	return;
      }
      return this.aStar();      
  	},

  	'fillOpenSet' : function () {
  		var gameState = this.gameState,
          immediateSet = [],
          currTile;
      for (var i = this.current.col - 1; i <= this.current.col + 1; i += 1) {
      	for (var k = this.current.row - 1; k <= this.current.row + 1; k += 1) {
          if (gameState[k] && gameState[k][i]) {
            currTile = gameState[k][i];
            if (currTile.id !== 'Blocked' && this.closedSet.indexOf(currTile) === -1) {
              immediateSet.push(currTile);
              if (this.openSet.indexOf(currTile) === -1) {
                this.openSet.push(currTile);
              }
            }
          }
      	}
      }
      this.immediateSet = immediateSet;
  	},

  	'setPath' : function (tile) {
  		if (tile.id === "Start") return;
  		console.log('setting path');
  		this.gameState[tile.row][tile.col].id = 'Path';
  		this.setPath(tile.parent);
  	}

  }
  
  var init = function (that) {
  	that.gameState = that.myBoard.gameState;
    var startTile = that.gameState[that.myBoard.startRow][that.myBoard.startCol];
  	startTile.parent = startTile;
  	startTile.gScore = 0;
	  that.immediateSet.push(startTile);
    that.current = startTile;
	  //that.aStar(that.gameState);
  	return that;
  }

  return function (OO) {

  	return init(Object.create(aStarProto).extend(OO));
  }

}());