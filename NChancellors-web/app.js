(function() {
  var app = angular.module('NChancellors', [ ]);
  
  app.controller('PuzzleController', function() {
    var me = this;
    me.n = 0;
    
    me.imgURL = "images/box.png";
    me.unavailableURL = "images/coal.png";
    me.chancellorURL = "images/present.png";
    me.blankURL = "images/box.png";
    me.cells = new Array();
    me.ansCtr = 0;
    me.solutions = new Array();
    me.gameEnd = false;
    var audio = new Audio('win.wav');

    var TRUE = 1;
    var FALSE = 0;

    var print_solution = function(n,x, title) {
        var i,j;
        
        var solution = new Array(n+1);
        for (i = 0; i < n+1; i++) {
          solution[i] = new Array(n+1);
        }
        
        // pre-fill with dashes
        for(i=1;i<=n;i++) {
            for(j=1; j<=n; j++) {
                solution[i][j]='-';
            }
        }
        
        // fill solutions
        for(i=1;i<=n;i++) {
            solution[i][x[i]]='C';
        }
        
        // print table
        var str = title;
        for( i=1;i<=n;i++) {
            for(j=1;j<=n;j++) {
              str = str + " " + solution[i][j];
                //console.log("\t" + solution[i][j]);
            }
            str = str + " \n";
            //str = "";
        }
        console.log(str);
        me.solutions.push(str);
    };


    var place = function(x,k) {
        var i;
        for(i=1;i<k;i++) { // compare against previous answers
    
            if (x[i]==x[k]) { // if same column
                return FALSE;
            }
    
            if (i-x[i]==k-x[k]) { // if same back-diagonal
                //return FALSE;
            }
    
            if (i+x[i]==k+x[k]) { // if same forward-diagonal
                //return FALSE;
            }
            // knight moves
            if (i==k-1 && x[i]==x[k]-2) { // col-2, row-1
                return FALSE;
            }
            if (i==k+1 && x[i]==x[k]-2) { // col-2, row+1
                return FALSE;
            }
            if (i==k-1 && x[i]==x[k]+2) { // col+2, row-1
                return FALSE;
            }
            if (i==k+1 && x[i]==x[k]+2) { // col+2, row+1
                return FALSE;
            }
            if (i==k-2 && x[i]==x[k]-1) { // col-1, row-2
                return FALSE;
            }
            if (i==k+2 && x[i]==x[k]-1) { // col-1, row+2
                return FALSE;
            }
            if (i==k-2 && x[i]==x[k]+1) { // col+1, row-2
                return FALSE;
            }
            if (i==k+2 && x[i]==x[k]+1) { // col+1, row+2
                return FALSE;
            }
        }
    
        return TRUE;
    };
    
    var nchancellors = function(puzzle, n, initial) {
        var x = new Array(n+1); // queen positions: row=index, column=value
        var count=0;
        var k=1;
    
        x[k]=0;
        
        while(k!=0) {
            x[k]=x[k]+1;
            while((x[k]<=n)&&(!place(x,k))) { // try each column to place queen
                x[k]=x[k]+1; // if cannot be placed in column x[k], try next column (x[k]+1)
            }
            if(x[k]<=n) {
                if(k==n) { // n queens have been placed
                    var i, hasInitialSolution = TRUE;
                    for (i=1; i<=n; i++) {
                        if (initial[i]>0 && initial[i]!=x[i]) {
                            hasInitialSolution = FALSE;
                        }
                    }
                    if (hasInitialSolution) {
                        count++;
                        var title = "\nSolution "+count+": \n";
                        console.log(title);
                        //document.write("<br>");
                        //document.write("<br>");
                        print_solution(n,x, title);
                    }
                } else { // next queen
                    k++;
                    x[k]=0;
                }
            } else { // lumampas na; backtrack!
                k--;
            }
        }
    
        if (count==0) {
            //console.log("\n\tPuzzle " + puzzle + " has no solutions\n");
        }
        
        
        return;
    };
    
    this.main = function(){
      
      if (me.cells.length > 0) {
        me.cells = new Array();
        me.solutions = new Array();
        me.gameEnd = false;
        me.ansCtr = 0;
        return;
      }
      
      var puzzles = 1;
      var n = me.n;
      
      var initial = new Array(n+1);
      for (var i = 0; i < n+1; i++) {
        initial[i] = 0;
      }
      
      var row = 1;
      var col = 1;
      for(var i = 0; i < n*n; i++){
        var cell = {
          'row' : row,
          'col' : col,
          'isEnd' : false,
          'url' : me.blankURL,
          'aggressors' : 0,
          'toggleImage' : function () {
              if (this.url === me.blankURL) {
                  this.url = me.chancellorURL;
              } else {
                  this.url = me.blankURL;
              }
          },
          'disable' : function() {
            for(var i = 0; i < me.cells.length; i++){
              if (this.row == me.cells[i].row && // self
                  this.col == me.cells[i].col) {
                
              } else if (this.row == me.cells[i].row || // rows
                  this.col == me.cells[i].col) {        // cols
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
              // horse
              else if (this.row-2 == me.cells[i].row &&
                       this.col-1 == me.cells[i].col) {
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
              else if (this.row-2 == me.cells[i].row &&
                       this.col+1 == me.cells[i].col) {
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
              else if (this.row-1 == me.cells[i].row &&
                       this.col-2 == me.cells[i].col) {
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
              else if (this.row-1 == me.cells[i].row &&
                       this.col+2 == me.cells[i].col) {
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
              else if (this.row+1 == me.cells[i].row &&
                       this.col-2 == me.cells[i].col) {
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
              else if (this.row+1 == me.cells[i].row &&
                       this.col+2 == me.cells[i].col) {
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
              else if (this.row+2 == me.cells[i].row &&
                       this.col-1 == me.cells[i].col) {
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
              else if (this.row+2 == me.cells[i].row &&
                       this.col+1 == me.cells[i].col) {
                me.cells[i].url = me.unavailableURL;
                me.cells[i].aggressors++;
              }
            }
          },
          'enable' : function() {
            for(var i = 0; i < me.cells.length; i++){
              if (this.row == me.cells[i].row && // self
                  this.col == me.cells[i].col) {
                
              } else if (this.row == me.cells[i].row || // rows
                  this.col == me.cells[i].col) {        // cols
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
              // horse
              else if (this.row-2 == me.cells[i].row &&
                       this.col-1 == me.cells[i].col) {
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
              else if (this.row-2 == me.cells[i].row &&
                       this.col+1 == me.cells[i].col) {
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
              else if (this.row-1 == me.cells[i].row &&
                       this.col-2 == me.cells[i].col) {
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
              else if (this.row-1 == me.cells[i].row &&
                       this.col+2 == me.cells[i].col) {
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
              else if (this.row+1 == me.cells[i].row &&
                       this.col-2 == me.cells[i].col) {
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
              else if (this.row+1 == me.cells[i].row &&
                       this.col+2 == me.cells[i].col) {
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
              else if (this.row+2 == me.cells[i].row &&
                       this.col-1 == me.cells[i].col) {
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
              else if (this.row+2 == me.cells[i].row &&
                       this.col+1 == me.cells[i].col) {
                me.cells[i].aggressors--;
                if (me.cells[i].aggressors == 0) {
                  me.cells[i].url = me.blankURL;
                }
              }
            }
          },
          'onClick' : function() {
            if (me.gameEnd) {
              return;
            }
            if (this.url == me.blankURL) {
              this.toggleImage();
              this.disable();
              me.ansCtr++;
            } else if (this.url == me.chancellorURL) {
              this.toggleImage();
              this.enable();
              me.ansCtr--;
            }
            if (me.ansCtr == me.n) {
              me.gameEnd = true;
              audio.play();
              alert("YOU'VE SAVED CHRISTMAS!");
            }
          }
        };
        col++;
        if ((i+1)%n==0) {
          cell.isEnd = true;
          row++;
          col = 1;
        }
        me.cells.push(cell);
      }
      
    };
    
    me.solve = function(){
      
      if (me.solutions.length > 0 || me.cells.length == 0 || me.gameEnd) {
        return;
      }
      
      var initial = new Array(me.n + 1);
      for (var i = 0; i < initial.length; i++) {
        initial[i] = 0;
      }
      
      var row = 1;
      var col = 1;
      var ctr = 0;
      for (var i = 0; i < me.cells.length; i++) {
        if (me.cells[i].url == me.chancellorURL) {
          initial[row] = col;
        }
        if(col > me.n-1){
            row++;
            col = 0;
        }
        col++;
        ctr++;
      }
      
      nchancellors(1, me.n, initial);
      me.gameEnd = true;
    };

  });
  
  
})();