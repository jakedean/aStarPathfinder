module.exports = (function () {
  
  aStarProto = {
    'updateFrequency' : 150,

  	'openSet' : [],

  	'closedSet' : [],

  	'tracer' : [],

    'immediateSet' : [],

  	'current' : undefined,

  	'aStar' : function () {
  		var gameState = this.gameState,
  		    tempCurrent;

      if (this.immediateSet.length) {
        for (var i = 0; i < this.immediateSet.length; i += 1) {
          if (!tempCurrent || this.immediateSet[i].fScore < tempCurrent.fScore) {
            tempCurrent = this.immediateSet[i];
          }
        }
      } else {
        for (var i = 0; i < this.openSet.length; i += 1) {
          if (!tempCurrent || this.openSet[i].fScore < tempCurrent.fScore) {
          	tempCurrent = this.openSet[i];
          }
        }
      }
      if(tempCurrent.id !== "Start" && tempCurrent.id !== "End") {
        tempCurrent.id = "Closed";
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
      var that = this;
      setTimeout(function () {
        that.myBoard.drawGameBoard();
        that.aStar();
      }, this.updateFrequency);
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
              currTile.getFScore(this.current);
              immediateSet.push(currTile);
              if (this.openSet.indexOf(currTile) === -1) {
                this.openSet.push(currTile);
                if(currTile.id !== "End") {
                  currTile.id = "OpenSet";
                }
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
    startTile.getFScore(startTile);
	  that.openSet.push(startTile);
	  //that.aStar(that.gameState);
  	return that;
  }

  return function (OO) {

  	return init(Object.create(aStarProto).extend(OO));
  }

}());