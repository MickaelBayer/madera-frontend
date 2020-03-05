var editor = {

  wall: function(start, end, type, thick) {
      this.thick = thick;
      this.start = start;
      this.end = end;
      this.type = type;
      this.parent = null;
      this.child = null;
      this.angle = 0;
      this.equations = {};
      this.coords = [];
      this.backUp = false;
  },

  // RETURN OBJECTS ARRAY INDEX OF WALLS [WALL1, WALL2, n...] WALLS WITH THIS NODE, EXCEPT PARAM = OBJECT WALL
  getWallNode: function(coords, except = false) {
      var nodes = [];
      for (var k in WALLS) {
        if (!isObjectsEquals(WALLS[k], except)) {
          if (isObjectsEquals(WALLS[k].start,coords)) {
              nodes.push({wall: WALLS[k], type: "start"});
          }
          if (isObjectsEquals(WALLS[k].end, coords)) {
              nodes.push({wall: WALLS[k], type: "end"});
          }
        }
      }
      if (nodes.length == 0) return false;
      else return nodes;
  },

  wallsComputing: function(WALLS, action = false) {
    // IF ACTION == MOVE -> equation2 exist !!!!!
    $('#boxwall').empty();
    $('#boxArea').empty();

    for (var vertice = 0; vertice < WALLS.length; vertice++) {
      var wall = WALLS[vertice];
      if (wall.parent != null) {
        if (!isObjectsEquals(wall.parent.start, wall.start) && !isObjectsEquals(wall.parent.end, wall.start)) {
          wall.parent = null;
        }
      }
      if (wall.child != null) {
        if (!isObjectsEquals(wall.child.start, wall.end) && !isObjectsEquals(wall.child.end, wall.end)) {
          wall.child = null;
        }
      }
    }

    for (var vertice = 0; vertice < WALLS.length; vertice++) {
      var wall = WALLS[vertice];
        if (wall.parent != null) {
          if (isObjectsEquals(wall.parent.start, wall.start)) {
            var previousWall = wall.parent;
            var previousWallStart = previousWall.end;
            var previousWallEnd = previousWall.start;
          }
          if (isObjectsEquals(wall.parent.end, wall.start)) {
            var previousWall = wall.parent;
            var previousWallStart = previousWall.start;
            var previousWallEnd = previousWall.end;
          }
        }
        else {
          var S = editor.getWallNode(wall.start, wall);
          // if (wallInhibation && isObjectsEquals(wall, wallInhibation)) S = false;
          for (var k in S) {
            var eqInter = editor.createEquationFromWall(S[k].wall);
            var angleInter = 90; // TO PASS TEST
            if (action == "move") {
              angleInter = qSVG.angleBetweenEquations(eqInter.A, equation2.A);
            }
            if (S[k].type == 'start' && S[k].wall.parent == null && angleInter > 20 && angleInter < 160) {
              wall.parent = S[k].wall;
              S[k].wall.parent = wall;
              var previousWall = wall.parent;
              var previousWallStart = previousWall.end;
              var previousWallEnd = previousWall.start;
            }
            if (S[k].type == 'end' && S[k].wall.child == null && angleInter > 20 && angleInter < 160) {
              wall.parent = S[k].wall;
              S[k].wall.child = wall;
              var previousWall = wall.parent;
              var previousWallStart = previousWall.start;
              var previousWallEnd = previousWall.end;
            }
          }
        }

        if (wall.child != null) {
          if (isObjectsEquals(wall.child.end, wall.end)) {
            var nextWall = wall.child;
            var nextWallStart = nextWall.end;
            var nextWallEnd = nextWall.start;
          }
          else {
            var nextWall = wall.child;
            var nextWallStart = nextWall.start;
            var nextWallEnd = nextWall.end;
          }
        }
        else {
          var E = editor.getWallNode(wall.end, wall);
          // if (wallInhibation && isObjectsEquals(wall, wallInhibation)) E = false;
            for (var k in E) {
              var eqInter = editor.createEquationFromWall(E[k].wall);
              var angleInter = 90; // TO PASS TEST
              if (action == "move") {
                angleInter = qSVG.angleBetweenEquations(eqInter.A, equation2.A);
              }
              if (E[k].type == 'end' && E[k].wall.child == null && angleInter > 20 && angleInter < 160) {
                wall.child = E[k].wall;
                E[k].wall.child = wall;
                var nextWall = wall.child;
                var nextWallStart = nextWall.end;
                var nextWallEnd = nextWall.start;
              }
              if (E[k].type == 'start' && E[k].wall.parent == null && angleInter > 20 && angleInter < 160) {
                wall.child = E[k].wall;
                E[k].wall.parent = wall;
                var nextWall = wall.child;
                var nextWallStart = nextWall.start;
                var nextWallEnd = nextWall.end;
              }
            }
        }

      var angleWall = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
      wall.angle = angleWall;
      var wallThickX = (wall.thick/2) * Math.sin(angleWall);
      var wallThickY = (wall.thick/2) * Math.cos(angleWall);
      var eqWallUp = qSVG.createEquation(wall.start.x + wallThickX, wall.start.y - wallThickY, wall.end.x + wallThickX, wall.end.y - wallThickY);
      var eqWallDw = qSVG.createEquation(wall.start.x - wallThickX, wall.start.y + wallThickY, wall.end.x - wallThickX, wall.end.y + wallThickY);
      var eqWallBase = qSVG.createEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
      wall.equations = {up: eqWallUp, down: eqWallDw, base: eqWallBase};
      var dWay;

      // WALL STARTED
      if (wall.parent == null) {
        var eqP = qSVG.perpendicularEquation(eqWallUp, wall.start.x, wall.start.y);
        var interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
        var interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
        wall.coords = [interUp, interDw];
        dWay = "M"+interUp.x+","+interUp.y+" L"+interDw.x+","+interDw.y+" ";
      }
      else {
        var eqP = qSVG.perpendicularEquation(eqWallUp, wall.start.x, wall.start.y);
        // var previousWall = wall.parent;
        //   var previousWallStart = previousWall.start;
        //   var previousWallEnd = previousWall.end;
        var anglePreviousWall = Math.atan2(previousWallEnd.y - previousWallStart.y, previousWallEnd.x - previousWallStart.x);
        var previousWallThickX = (previousWall.thick/2) * Math.sin(anglePreviousWall);
        var previousWallThickY = (previousWall.thick/2) * Math.cos(anglePreviousWall);
        var eqPreviousWallUp = qSVG.createEquation(previousWallStart.x + previousWallThickX, previousWallStart.y - previousWallThickY, previousWallEnd.x + previousWallThickX, previousWallEnd.y - previousWallThickY);
        var eqPreviousWallDw = qSVG.createEquation(previousWallStart.x - previousWallThickX, previousWallStart.y + previousWallThickY, previousWallEnd.x - previousWallThickX, previousWallEnd.y + previousWallThickY);
        if (Math.abs(anglePreviousWall-angleWall) > 0.09) {
          var interUp = qSVG.intersectionOfEquations(eqWallUp, eqPreviousWallUp, "object");
          var interDw = qSVG.intersectionOfEquations(eqWallDw, eqPreviousWallDw, "object");

          if (eqWallUp.A == eqPreviousWallUp.A) {
            interUp = {x: wall.start.x + wallThickX, y: wall.start.y - wallThickY};
            interDw = {x: wall.start.x - wallThickX, y: wall.start.y + wallThickY};
          }

          var miter = qSVG.gap(interUp, {x:previousWallEnd.x, y:previousWallEnd.y});
          if (miter > 1000) {
            var interUp = qSVG.intersectionOfEquations(eqP, eqWallUp, "object");
            var interDw = qSVG.intersectionOfEquations(eqP, eqWallDw, "object");
          }
        }
        if (Math.abs(anglePreviousWall-angleWall) <= 0.09) {
          var interUp = qSVG.intersectionOfEquations(eqP, eqWallUp, "object");
          var interDw = qSVG.intersectionOfEquations(eqP, eqWallDw, "object");
        }
        wall.coords = [interUp, interDw];
        dWay = "M"+interUp.x+","+interUp.y+" L"+interDw.x+","+interDw.y+" ";
      }

      // WALL FINISHED
      if (wall.child == null) {
        var eqP = qSVG.perpendicularEquation(eqWallUp, wall.end.x, wall.end.y);
        var interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
        var interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
        wall.coords.push(interDw, interUp);
        dWay = dWay + "L"+interDw.x+","+interDw.y+" L"+interUp.x+","+interUp.y+" Z";
      }
      else {
        var eqP = qSVG.perpendicularEquation(eqWallUp, wall.end.x, wall.end.y);
        // var nextWall = wall.child;
        //   var nextWallStart = nextWall.start;
        //   var nextWallEnd = nextWall.end;
        var angleNextWall = Math.atan2(nextWallEnd.y - nextWallStart.y, nextWallEnd.x - nextWallStart.x);
        var nextWallThickX = (nextWall.thick/2) * Math.sin(angleNextWall);
        var nextWallThickY = (nextWall.thick/2) * Math.cos(angleNextWall);
        var eqNextWallUp = qSVG.createEquation(nextWallStart.x + nextWallThickX, nextWallStart.y - nextWallThickY, nextWallEnd.x + nextWallThickX, nextWallEnd.y - nextWallThickY);
        var eqNextWallDw = qSVG.createEquation(nextWallStart.x - nextWallThickX, nextWallStart.y + nextWallThickY, nextWallEnd.x - nextWallThickX, nextWallEnd.y + nextWallThickY);
        if (Math.abs(angleNextWall-angleWall) > 0.09) {
          var interUp = qSVG.intersectionOfEquations(eqWallUp, eqNextWallUp, "object");
          var interDw = qSVG.intersectionOfEquations(eqWallDw, eqNextWallDw, "object");

          if (eqWallUp.A == eqNextWallUp.A) {
            interUp = {x: wall.end.x + wallThickX, y: wall.end.y - wallThickY};
            interDw = {x: wall.end.x - wallThickX, y: wall.end.y + wallThickY};
          }

          var miter = qSVG.gap(interUp, {x:nextWallStart.x, y:nextWallStart.y});
          if (miter > 1000) {
            var interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
            var interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
          }
        }
        if (Math.abs(angleNextWall-angleWall) <= 0.09) {
          var interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
          var interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
        }

        wall.coords.push(interDw, interUp);
        dWay = dWay + "L"+interDw.x+","+interDw.y+" L"+interUp.x+","+interUp.y+" Z";
      }

      wall.graph = editor.makeWall(dWay);
      $('#boxwall').append(wall.graph);
    }
  },

  makeWall: function(way) {
    var wallScreen = qSVG.create('none', 'path', {
        d: way,
        stroke: "none",
        fill: colorWall,
        "stroke-width": 1,
        "stroke-linecap": "butt",
        "stroke-linejoin": "miter",
        "stroke-miterlimit": 4,
        "fill-rule": "nonzero"
    });
    return wallScreen;
  },

  invisibleWall: function(wallToInvisble = false) {
    if (!wallToInvisble) wallToInvisble = binder.wall;
    var objWall = editor.objFromWall(wallBind);
    if (objWall.length == 0) {
      wallToInvisble.type = "separate";
      wallToInvisble.backUp = wallToInvisble.thick;
      wallToInvisble.thick = 0.07;
      editor.architect(WALLS);
      mode = "select_mode";
      $('#panel').show(200);
      save();
      return true;
    }
    else {
      $('#boxinfo').html('Les murs contenant des portes ou des fenêtres ne peuvent être une séparation !');
      return false;
    }
  },

  visibleWall:  function(wallToInvisble = false) {
    if (!wallToInvisble) wallToInvisble = binder.wall;
    wallToInvisble.type = "normal";
    wallToInvisble.thick = wallToInvisble.backUp;
    wallToInvisble.backUp = false;
    editor.architect(WALLS);
    mode = "select_mode";
    $('#panel').show(200);
    save();
    return true;
  },

  architect: function(WALLS) {
    editor.wallsComputing(WALLS);
    Rooms = qSVG.polygonize(WALLS);
    $('#boxRoom').empty();
    $('#boxSurface').empty();
    editor.roomMaker(Rooms);
    return true;
  },

  splitWall: function(wallToSplit = false) {
    if (!wallToSplit) wallToSplit = binder.wall;
    var eqWall = editor.createEquationFromWall(wallToSplit);
    var wallToSplitLength = qSVG.gap(wallToSplit.start, wallToSplit.end);
    var newWalls = [];
    for (var k in WALLS) {
      var eq = editor.createEquationFromWall(WALLS[k]);
      var inter = qSVG.intersectionOfEquations(eqWall, eq, 'obj');
      if (qSVG.btwn(inter.x, binder.wall.start.x, binder.wall.end.x, 'round') && qSVG.btwn(inter.y, binder.wall.start.y, binder.wall.end.y, 'round') && qSVG.btwn(inter.x, WALLS[k].start.x, WALLS[k].end.x, 'round') && qSVG.btwn(inter.y, WALLS[k].start.y, WALLS[k].end.y, 'round')) {
        var distance = qSVG.gap(wallToSplit.start, inter);
        if (distance > 5 && distance < wallToSplitLength) newWalls.push({distance: distance, coords: inter});
      }
    }
    newWalls.sort(function(a,b) {
      return (a.distance - b.distance).toFixed(2);
    });
    var initCoords = wallToSplit.start;
    var initThick = wallToSplit.thick;
    // CLEAR THE WALL BEFORE PIECES RE-BUILDER
    for (var k in WALLS) {
        if (isObjectsEquals(WALLS[k].child, wallToSplit)) WALLS[k].child = null;
        if (isObjectsEquals(WALLS[k].parent, wallToSplit)) {WALLS[k].parent = null;}
    }
    WALLS.splice(WALLS.indexOf(wallToSplit),1);
    var wall;
    for (var k in newWalls) {
      wall = new editor.wall(initCoords, newWalls[k].coords, "normal", initThick);
      WALLS.push(wall);
      wall.child = WALLS[WALLS.length];
      initCoords = newWalls[k].coords;
    }
    // LAST WALL ->
    wall = new editor.wall(initCoords, wallToSplit.end, "normal", initThick);
    WALLS.push(wall);
    editor.architect(WALLS);
    mode = "select_mode";
    $('#panel').show(200);
    save();
    return true;
  },

  nearWallNode: function(snap, range = Infinity, except = ['']) {
    var best;
    var bestWall;
    var scan;
    var i = 0;
    var scanDistance;
    var bestDistance = Infinity;
    for (var k = 0; k < WALLS.length; k++) {
      if (except.indexOf(WALLS[k]) == -1) {
        scanStart = WALLS[k].start;
        scanEnd = WALLS[k].end;
        scanDistance = qSVG.measure(scanStart, snap);
        if (scanDistance < bestDistance) {
            best = scanStart;
            bestDistance = scanDistance;
            bestWall = k;
        }
        scanDistance = qSVG.measure(scanEnd, snap);
        if (scanDistance < bestDistance) {
            best = scanEnd;
            bestDistance = scanDistance;
            bestWall = k;
        }
      }
    }
    if (bestDistance <= range) {
        return ({
            x: best.x,
            y: best.y,
            bestWall: bestWall
        });
    } else {
        return false;
    }
  },

  // USING WALLS SUPER WALL OBJECTS ARRAY
  rayCastingWall: function(snap) {
    var wallList = [];
    for (var i = 0; i < WALLS.length; i++) {
      var polygon = [];
      for (var pp = 0; pp < 4; pp++) {
        polygon.push({x: WALLS[i].coords[pp].x, y: WALLS[i].coords[pp].y}); // FOR Z
      }
      if (qSVG.rayCasting(snap, polygon)) {
        wallList.push(WALLS[i]); // Return EDGES Index
      }
      }
      if (wallList.length == 0) return false;
      else {
        if (wallList.length == 1) return wallList[0];
        else return wallList;
      }
    },

  stickOnWall: function(snap) {
    if (WALLS.length == 0) return false;
    var wallDistance = Infinity;
    var wallSelected = {};
    var result;
    if (WALLS.length == 0) return false;
    for (var e = 0; e < WALLS.length; e++) {
      var eq1 = qSVG.createEquation(WALLS[e].coords[0].x, WALLS[e].coords[0].y, WALLS[e].coords[3].x, WALLS[e].coords[3].y);
      result1 = qSVG.nearPointOnEquation(eq1, snap);
      var eq2 = qSVG.createEquation(WALLS[e].coords[1].x, WALLS[e].coords[1].y, WALLS[e].coords[2].x, WALLS[e].coords[2].y);
      result2 = qSVG.nearPointOnEquation(eq2, snap);
      if (result1.distance < wallDistance && qSVG.btwn(result1.x, WALLS[e].coords[0].x, WALLS[e].coords[3].x) && qSVG.btwn(result1.y, WALLS[e].coords[0].y, WALLS[e].coords[3].y)) {
          wallDistance = result1.distance;
          wallSelected = {wall: WALLS[e], x: result1.x, y: result1.y, distance: result1.distance};
      }
      if (result2.distance < wallDistance && qSVG.btwn(result2.x, WALLS[e].coords[1].x, WALLS[e].coords[2].x) && qSVG.btwn(result2.y, WALLS[e].coords[1].y, WALLS[e].coords[2].y)) {
          wallDistance = result2.distance;
          wallSelected = {wall: WALLS[e], x: result2.x, y: result2.y, distance: result2.distance};
      }
    }
    var vv = editor.nearVertice(snap);
    if (vv.distance < wallDistance) {
        var eq1 = qSVG.createEquation(vv.number.coords[0].x, vv.number.coords[0].y, vv.number.coords[3].x, vv.number.coords[3].y);
        result1 = qSVG.nearPointOnEquation(eq1, vv);
        var eq2 = qSVG.createEquation(vv.number.coords[1].x, vv.number.coords[1].y, vv.number.coords[2].x, vv.number.coords[2].y);
        result2 = qSVG.nearPointOnEquation(eq2, vv);
        if (result1.distance < wallDistance && qSVG.btwn(result1.x, vv.number.coords[0].x, vv.number.coords[3].x) && qSVG.btwn(result1.y, vv.number.coords[0].y, vv.number.coords[3].y)) {
            wallDistance = result1.distance;
            wallSelected = {wall: vv.number, x: result1.x, y: result1.y, distance: result1.distance};
        }
        if (result2.distance < wallDistance && qSVG.btwn(result2.x, vv.number.coords[1].x, vv.number.coords[2].x) && qSVG.btwn(result2.y, vv.number.coords[1].y, vv.number.coords[2].y)) {
            wallDistance = result2.distance;
            wallSelected = {wall: vv.number, x: result2.x, y: result2.y, distance: result2.distance};
        }
    }
    return wallSelected;
  },


  // RETURN OBJDATA INDEX LIST FROM AN WALL
  objFromWall:  function(wall, typeObj = false) {
    var objList = [];
    for (var scan = 0; scan < OBJDATA.length; scan++) {
      var search;
      if (OBJDATA[scan].family == 'inWall') {
        var eq = qSVG.createEquation(wall.start.x, wall.start.y,wall.end.x,wall.end.y);
        search = qSVG.nearPointOnEquation(eq, OBJDATA[scan]);
        if (search.distance < 0.01 && qSVG.btwn(OBJDATA[scan].x, wall.start.x, wall.end.x) && qSVG.btwn(OBJDATA[scan].y, wall.start.y, wall.end.y)) objList.push(OBJDATA[scan]);
        // WARNING 0.01 TO NO COUNT OBJECT ON LIMITS OF THE EDGE !!!!!!!!!!!! UGLY CODE( MOUSE PRECISION)
        // TRY WITH ANGLE MAYBE ???
      }
    }
    return objList;
  },

  createEquationFromWall: function(wall) {
    return qSVG.createEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
  },

  // WALLS SUPER ARRAY
  rayCastingWalls: function(snap) {
    var wallList = [];
    for (var i = 0; i < WALLS.length; i++) {
      var polygon = [];
      for (var pp = 0; pp < 4; pp++) {
        polygon.push({x: WALLS[i].coords[pp].x, y: WALLS[i].coords[pp].y}); // FOR Z
      }
      if (qSVG.rayCasting(snap, polygon)) {
        wallList.push(WALLS[i]); // Return EDGES Index
      }
      }
      if (wallList.length == 0) return false;
      else {
        if (wallList.length == 1) return wallList[0];
        else return wallList;
      }
    },

  inWallRib2: function(wall, option = false) {
    if (!option) $('#boxRib').empty();
    ribMaster = [];
    var emptyArray = [];
    ribMaster.push(emptyArray);
    ribMaster.push(emptyArray);
    var inter;
    var distance;
    var cross;
    var angleTextValue = wall.angle*(180/Math.PI);
    var objWall = editor.objFromWall(wall); // LIST OBJ ON EDGE
    ribMaster[0].push({wall: wall, crossObj: false, side : 'up', coords: wall.coords[0], distance: 0});
    ribMaster[1].push({wall: wall, crossObj: false, side : 'down', coords: wall.coords[1], distance: 0});
    for (var ob in objWall) {
      var objTarget = objWall[ob];
      objTarget.up = [
        qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[0]),
        qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[1])
      ];
      objTarget.down = [
        qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[0]),
        qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[1])
      ];

      distance = qSVG.measure(wall.coords[0], objTarget.up[0]) / meter;
      ribMaster[0].push({wall: wall, crossObj: ob, side : 'up', coords: objTarget.up[0], distance: distance.toFixed(2)});
      distance = qSVG.measure(wall.coords[0], objTarget.up[1]) / meter;
      ribMaster[0].push({wall: wall, crossObj: ob, side : 'up', coords: objTarget.up[1], distance: distance.toFixed(2)});
      distance = qSVG.measure(wall.coords[1], objTarget.down[0]) / meter;
      ribMaster[1].push({wall: wall, crossObj: ob, side : 'down', coords: objTarget.down[0], distance: distance.toFixed(2)});
      distance = qSVG.measure(wall.coords[1], objTarget.down[1]) / meter;
      ribMaster[1].push({wall: wall, crossObj: ob, side : 'down', coords: objTarget.down[1], distance: distance.toFixed(2)});
    }
    distance = qSVG.measure(wall.coords[0], wall.coords[3]) / meter;
    ribMaster[0].push({wall: wall, crossObj: false, side : 'up', coords: wall.coords[3], distance: distance});
    distance = qSVG.measure(wall.coords[1], wall.coords[2]) / meter;
    ribMaster[1].push({wall: wall, crossObj: false, side : 'down', coords: wall.coords[2], distance: distance});
      ribMaster[0].sort(function(a,b) {
        return (a.distance - b.distance).toFixed(2);
      });
      ribMaster[1].sort(function(a,b) {
        return (a.distance - b.distance).toFixed(2);
      });
    for (var t in ribMaster) {
      for (var n = 1; n < ribMaster[t].length; n++) {
        var found = true;
        var shift = -5;
        var valueText = Math.abs(ribMaster[t][n-1].distance - ribMaster[t][n].distance);
        var angleText = angleTextValue;
        if (found) {
            if (ribMaster[t][n-1].side == 'down') {shift = -shift+10;}
            if (angleText > 89 || angleText < -89) {
              angleText-=180;
              if (ribMaster[t][n-1].side == 'down') {shift = -5;}
              else shift = -shift+10;
            }



            sizeText[n] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            var startText = qSVG.middle(ribMaster[t][n-1].coords.x, ribMaster[t][n-1].coords.y, ribMaster[t][n].coords.x, ribMaster[t][n].coords.y);
            sizeText[n].setAttributeNS(null, 'x', startText.x);
            sizeText[n].setAttributeNS(null, 'y', (startText.y)+shift);
            sizeText[n].setAttributeNS(null, 'text-anchor', 'middle');
            sizeText[n].setAttributeNS(null, 'font-family', 'roboto');
            sizeText[n].setAttributeNS(null, 'stroke', '#ffffff');
            sizeText[n].textContent = valueText.toFixed(2);
            if (sizeText[n].textContent < 1) {
              sizeText[n].setAttributeNS(null, 'font-size', '0.8em');
              sizeText[n].textContent = sizeText[n].textContent.substring(1, sizeText[n].textContent.length);
            }
            else sizeText[n].setAttributeNS(null, 'font-size', '1em');
            sizeText[n].setAttributeNS(null, 'stroke-width', '0.4px');
            sizeText[n].setAttributeNS(null, 'fill', '#666666');
            sizeText[n].setAttribute("transform", "rotate("+angleText+" "+startText.x+","+(startText.y)+")");

            $('#boxRib').append(sizeText[n]);
        }
      }
    }
  },

  // value can be "text label", "step number in stair", etc...
  obj2D:  function(family, classe, type, pos, angle, angleSign, size, hinge = 'normal', thick, value) {
    this.family = family   // inWall, stick, collision, free
    this.class = classe;  // door, window, energy, stair, measure, text ?
    this.type = type; // simple, double, simpleSlide, aperture, doubleSlide, fixed, switch, lamp....
    this.x = pos.x;
    this.y = pos.y;
    this.angle = angle;
    this.angleSign = angleSign;
    this.limit = [];
    this.hinge = hinge; // normal, reverse
    this.graph = qSVG.create('none', 'g');
    this.scale = {x:1, y:1};
    this.value = value;
    this.size = size;
    this.thick = thick;
    this.width = (this.size / meter).toFixed(2);
    this.height= (this.thick / meter).toFixed(2);

    var cc = carpentryCalc(classe, type, size, thick, value);
    var blank;

    for (var tt = 0; tt < cc.length; tt++) {
      if (cc[tt].path) {
        blank = qSVG.create('none', 'path', {
            d : cc[tt].path,
            "stroke-width": 1,
            fill: cc[tt].fill,
            stroke: cc[tt].stroke,
            'stroke-dasharray': cc[tt].strokeDashArray
        });
      }
      if (cc[tt].text) {
        blank = qSVG.create("none", "text", {
            x: cc[tt].x,
            y: cc[tt].y,
           'font-size': cc[tt].fontSize,
            stroke: cc[tt].stroke,
            "stroke-width": cc[tt].strokeWidth,
            'font-family': 'roboto',
            'text-anchor': 'middle',
            fill : cc[tt].fill
        });
        blank.context.textContent = cc[tt].text;
      }
      this.graph.append(blank);

    } // ENDFOR
    var bbox = this.graph.get(0).getBoundingClientRect();
    bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
    bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
    bbox.origin = {x: this.x, y: this.y};
    this.bbox = bbox;
      this.realBbox = [{x: -this.size/2, y: -this.thick/2}, {x: this.size/2, y: -this.thick/2},{x: this.size/2, y: this.thick/2},{x: -this.size/2, y: this.thick/2}];
      if (family == "byObject") this.family = cc.family;
      this.params = cc.params; // (bindBox, move, resize, rotate)
      cc.params.width ? this.size = cc.params.width : this.size = size;
      cc.params.height ? this.thick = cc.params.height : this.thick = thick;


      this.update = function() {
        console.log("update")
        this.width = (this.size / meter).toFixed(2);
        this.height= (this.thick / meter).toFixed(2);
        cc = carpentryCalc(this.class, this.type, this.size, this.thick, this.value);
        for (var tt = 0; tt < cc.length; tt++) {
            if (cc[tt].path)  {
              this.graph.find('path')[tt].setAttribute("d", cc[tt].path);
            }
            else {
              // this.graph.find('text').context.textContent = cc[tt].text;
            }
          }
          var hingeStatus = this.hinge; // normal - reverse
          var hingeUpdate;
          if (hingeStatus == 'normal') hingeUpdate = 1;
          else hingeUpdate = -1;
          this.graph.attr({"transform": "translate(" + (this.x) + "," + (this.y) + ") rotate(" +this.angle+ ",0,0) scale("+hingeUpdate+", 1)"});
          var bbox = this.graph.get(0).getBoundingClientRect();
          bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
          bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
          bbox.origin = {x: this.x, y: this.y};
          this.bbox = bbox;

          if (this.class == "text" && this.angle == 0){ this.realBbox = [
            {x: this.bbox.x, y: this.bbox.y}, {x: this.bbox.x+this.bbox.width, y: this.bbox.y},{x: this.bbox.x+this.bbox.width, y: this.bbox.y+this.bbox.height}, {x: this.bbox.x, y: this.bbox.y+this.bbox.height}];
            this.size = this.bbox.width;
            this.thick = this.bbox.height;
          }

            var angleRadian = -(this.angle) * (Math.PI / 180);
            this.realBbox = [{x: -this.size/2, y: -this.thick/2}, {x: this.size/2, y: -this.thick/2},{x: this.size/2, y: this.thick/2},{x: -this.size/2, y: this.thick/2}];
            var newRealBbox = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
              newRealBbox[0].x = (this.realBbox[0].y*Math.sin(angleRadian) + this.realBbox[0].x*Math.cos(angleRadian))+this.x;
              newRealBbox[1].x = (this.realBbox[1].y*Math.sin(angleRadian) + this.realBbox[1].x*Math.cos(angleRadian))+this.x;
              newRealBbox[2].x = (this.realBbox[2].y*Math.sin(angleRadian) + this.realBbox[2].x*Math.cos(angleRadian))+this.x;
              newRealBbox[3].x = (this.realBbox[3].y*Math.sin(angleRadian) + this.realBbox[3].x*Math.cos(angleRadian))+this.x;
              newRealBbox[0].y = (this.realBbox[0].y*Math.cos(angleRadian) - this.realBbox[0].x*Math.sin(angleRadian))+this.y;
              newRealBbox[1].y = (this.realBbox[1].y*Math.cos(angleRadian) - this.realBbox[1].x*Math.sin(angleRadian))+this.y;
              newRealBbox[2].y = (this.realBbox[2].y*Math.cos(angleRadian) - this.realBbox[2].x*Math.sin(angleRadian))+this.y;
              newRealBbox[3].y = (this.realBbox[3].y*Math.cos(angleRadian) - this.realBbox[3].x*Math.sin(angleRadian))+this.y;
            this.realBbox = newRealBbox;
          return true;
      }
  },

  roomMaker:  function(Rooms) {
    globalArea = 0;
    var oldVertexNumber = [];
    if (Rooms.polygons.length == 0) ROOM = [];
    for (var pp = 0; pp < Rooms.polygons.length; pp++) {
      var foundRoom = false;
      var roomId;
      for (var rr = 0; rr < ROOM.length; rr++) {
        roomId = rr;
        var countCoords = Rooms.polygons[pp].coords.length;
        var diffCoords = qSVG.diffObjIntoArray(Rooms.polygons[pp].coords, ROOM[rr].coords);
        if (Rooms.polygons[pp].way.length == ROOM[rr].way.length) {
            if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 0 || diffCoords == 0)
              {
                countCoords =  0;
              }
        }
        if (Rooms.polygons[pp].way.length == ROOM[rr].way.length + 1) {
          if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1 || diffCoords == 2) {
            countCoords = 0;
          }
        }
        if (Rooms.polygons[pp].way.length == ROOM[rr].way.length-1) {
          if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1) {
            countCoords = 0;
          }
        }
        if (countCoords == 0) {
          foundRoom = true;
          ROOM[rr].area = Rooms.polygons[pp].area;
          ROOM[rr].inside = Rooms.polygons[pp].inside;
          ROOM[rr].coords = Rooms.polygons[pp].coords;
          ROOM[rr].coordsOutside = Rooms.polygons[pp].coordsOutside;
          ROOM[rr].way = Rooms.polygons[pp].way;
          ROOM[rr].coordsInside = Rooms.polygons[pp].coordsInside;
          break;
        }
      }
      if (!foundRoom) {
          ROOM.push({coords: Rooms.polygons[pp].coords, coordsOutside : Rooms.polygons[pp].coordsOutside, coordsInside : Rooms.polygons[pp].coordsInside, inside: Rooms.polygons[pp].inside, way: Rooms.polygons[pp].way, area: Rooms.polygons[pp].area, surface: '', name: '', color: 'gradientWhite', showSurface: true, action: 'add'});
      }
    }

    var toSplice = [];
    for (var rr = 0; rr < ROOM.length; rr++) {
      var found = true;
      for (var pp = 0; pp < Rooms.polygons.length; pp++) {
        var countRoom = ROOM[rr].coords.length;
        var diffCoords = qSVG.diffObjIntoArray(Rooms.polygons[pp].coords, ROOM[rr].coords);
        if (Rooms.polygons[pp].way.length == ROOM[rr].way.length) {
            if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 0 || diffCoords == 0)
              {
                countRoom =  0;
              }
        }
        if (Rooms.polygons[pp].way.length == ROOM[rr].way.length + 1) {
          if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1 || diffCoords == 2) {
            countRoom = 0;
          }
        }
        if (Rooms.polygons[pp].way.length == ROOM[rr].way.length - 1) {
          if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1) {
            countRoom = 0;
          }
        }
        if (countRoom == 0) {found = true;break;}
        else found = false;
      }
      if (!found) toSplice.push(rr);
    }

    toSplice.sort(function(a, b) {
        return b-a;
      });
    for (var ss = 0; ss < toSplice.length; ss++) {
     ROOM.splice(toSplice[ss], 1);
    }
    $('#boxRoom').empty();
    $('#boxSurface').empty();
    $('#boxArea').empty();
    for (var rr = 0; rr < ROOM.length; rr++) {

        if (ROOM[rr].action == 'add') globalArea = globalArea + ROOM[rr].area;

        var pathSurface = ROOM[rr].coords;
        var pathCreate = "M"+pathSurface[0].x+","+pathSurface[0].y;
        for (var p = 1; p < pathSurface.length; p++) {
          pathCreate = pathCreate + " "+"L"+pathSurface[p].x+","+pathSurface[p].y;
          }
        if (ROOM[rr].inside.length > 0) {
          for (var ins = 0; ins < ROOM[rr].inside.length; ins++) {
            pathCreate = pathCreate+" M"+Rooms.polygons[ROOM[rr].inside[ins]].coords[Rooms.polygons[ROOM[rr].inside[ins]].coords.length-1].x+","+Rooms.polygons[ROOM[rr].inside[ins]].coords[Rooms.polygons[ROOM[rr].inside[ins]].coords.length-1].y;
            for (var free = Rooms.polygons[ROOM[rr].inside[ins]].coords.length-2; free > -1; free--) {
              pathCreate = pathCreate+" L"+Rooms.polygons[ROOM[rr].inside[ins]].coords[free].x+","+Rooms.polygons[ROOM[rr].inside[ins]].coords[free].y;
            }
          }
        }
        qSVG.create('boxRoom', 'path', {
              d: pathCreate,
              fill: 'url(#'+ROOM[rr].color+')',
              'fill-opacity': 1, stroke: 'none', 'fill-rule': 'evenodd', class: 'room'});

        qSVG.create('boxSurface', 'path', {
              d: pathCreate,
              fill: '#fff', 'fill-opacity': 1, stroke: 'none', 'fill-rule': 'evenodd', class: 'room'});

        var centroid = qSVG.polygonVisualCenter(ROOM[rr]);

        if (ROOM[rr].name != '') {
          var styled = {color:'#343938'};
          if (ROOM[rr].color == 'gradientBlack' || ROOM[rr].color == 'gradientBlue') styled.color = 'white';
          qSVG.textOnDiv(ROOM[rr].name, centroid, styled, 'boxArea');
        }

        if (ROOM[rr].name != '') centroid.y = centroid.y + 20;
        var area = ((ROOM[rr].area)/(meter*meter)).toFixed(2)+' m²';
        var styled = {color:'#343938', fontSize:'12.5px', fontWeight:'normal'};
        if (ROOM[rr].surface != '') {
          styled.fontWeight = 'bold';
          area = ROOM[rr].surface+' m²';
        }
        if (ROOM[rr].color == 'gradientBlack' || ROOM[rr].color == 'gradientBlue') styled.color = 'white';
        if (ROOM[rr].showSurface) qSVG.textOnDiv(area, centroid, styled, 'boxArea');
    }
    if (globalArea <= 0) {
      globalArea = 0;
      $('#areaValue').html('');
    }
    else {
      $('#areaValue').html('<i class="fa fa-map-o" aria-hidden="true"></i> '+(globalArea/3600).toFixed(1)+ ' m²');
    }
  },

  rayCastingRoom: function(point) {
    var x = point.x, y = point.y;
    var roomGroup = [];
    for (var polygon = 0; polygon < ROOM.length; polygon++) {
      var inside = qSVG.rayCasting(point, ROOM[polygon].coords);

      if (inside) {
        roomGroup.push(polygon);
      }
    }
    if (roomGroup.length > 0) {
      var bestArea = ROOM[roomGroup[0]].area;
      var roomTarget;
      for (var siz = 0; siz < roomGroup.length; siz++) {
        if (ROOM[roomGroup[siz]].area <= bestArea) {
          bestArea = ROOM[roomGroup[siz]].area;
          roomTarget = ROOM[roomGroup[siz]];
        }
      }
      return roomTarget;
    }
    else {
      return false;
    }
  },

  nearVertice:  function(snap, range = 10000) {
    var bestDistance = Infinity;
    var bestVertice;
    for (var i = 0; i < WALLS.length; i++) {
      var distance1 = qSVG.gap(snap, {x: WALLS[i].start.x, y: WALLS[i].start.y});
      var distance2 = qSVG.gap(snap, {x: WALLS[i].end.x, y: WALLS[i].end.y});
      if (distance1 < distance2 && distance1 < bestDistance) {
        bestDistance = distance1;
        bestVertice = {number: WALLS[i], x: WALLS[i].start.x, y: WALLS[i].start.y, distance: Math.sqrt(bestDistance)};
      }
      if (distance2 < distance1 && distance2 < bestDistance) {
        bestDistance = distance2;
        bestVertice = {number: WALLS[i], x: WALLS[i].end.x, y: WALLS[i].end.y, distance: Math.sqrt(bestDistance)};
      }
    }
    if (bestDistance < range*range) return bestVertice;
    else return false;
  },

  nearWall: function(snap, range = Infinity) {
    var wallDistance = Infinity;
    var wallSelected = {};
    var result;
    if (WALLS.length == 0) return false;
    for (var e = 0; e < WALLS.length; e++) {
      var eq = qSVG.createEquation(WALLS[e].start.x, WALLS[e].start.y, WALLS[e].end.x, WALLS[e].end.y);
      result = qSVG.nearPointOnEquation(eq, snap);
      if (result.distance < wallDistance && qSVG.btwn(result.x, WALLS[e].start.x, WALLS[e].end.x) && qSVG.btwn(result.y, WALLS[e].start.y, WALLS[e].end.y)) {
          wallDistance = result.distance;
          wallSelected = {wall: WALLS[e], x: result.x, y: result.y, distance: result.distance};
      }
    }
    var vv = editor.nearVertice(snap);
    if (vv.distance < wallDistance) {
        wallDistance = vv.distance;
        wallSelected = {wall: vv.number, x: vv.x, y: vv.y, distance: vv.distance};
    }
    if (wallDistance <= range) return wallSelected;
    else return false;
  },

  showScaleBox: function() {
    if (ROOM.length > 0) {
      var minX, minY, maxX, maxY;
      for (var i = 0; i < WALLS.length; i++) {
        var px = WALLS[i].start.x;
        var py = WALLS[i].start.y;
        if (!i || px < minX) minX = px;
        if (!i || py < minY) minY = py;
        if (!i || px > maxX) maxX = px;
        if (!i || py > maxY) maxY = py;
        var px = WALLS[i].end.x;
        var py = WALLS[i].end.y;
        if (!i || px < minX) minX = px;
        if (!i || py < minY) minY = py;
        if (!i || px > maxX) maxX = px;
        if (!i || py > maxY) maxY = py;
      }
      var width = maxX - minX;
      var height = maxY - minY;

      var labelWidth = ((maxX - minX) / meter).toFixed(2);
      var labelHeight = ((maxY - minY) / meter).toFixed(2);

      var sideRight = 'm'+(maxX+40)+','+minY;
      sideRight = sideRight + ' l60,0 m-40,10 l10,-10 l10,10 m-10,-10';
      sideRight = sideRight + ' l0,'+height;
      sideRight = sideRight + ' m-30,0 l60,0 m-40,-10 l10,10 l10,-10';

      sideRight = sideRight + 'M'+(minX)+','+(minY-40);
      sideRight = sideRight + ' l0,-60 m10,40 l-10,-10 l10,-10 m-10,10';
      sideRight = sideRight + ' l'+width+',0';
      sideRight = sideRight + ' m0,30 l0,-60 m-10,40 l10,-10 l-10,-10';

      $('#boxScale').empty();

      qSVG.create('boxScale', 'path', {
          d: sideRight,
          stroke: "#555",
          fill: "none",
          "stroke-width": 0.3,
          "stroke-linecap": "butt",
          "stroke-linejoin": "miter",
          "stroke-miterlimit": 4,
          "fill-rule": "nonzero"
      });

      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttributeNS(null, 'x', (maxX+70));
      text.setAttributeNS(null, 'y', ((maxY + minY) /2) + 35);
      text.setAttributeNS(null, 'fill', '#555');
      text.setAttributeNS(null, 'text-anchor', 'middle');
      text.textContent = labelHeight + ' m';
      text.setAttribute("transform", "rotate(270 " + (maxX+70) + "," + (maxY + minY) /2 + ")");
      $('#boxScale').append(text);

      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttributeNS(null, 'x', (maxX + minX) /2);
      text.setAttributeNS(null, 'y', (minY-95));
      text.setAttributeNS(null, 'fill', '#555');
      text.setAttributeNS(null, 'text-anchor', 'middle');
      text.textContent = labelWidth + ' m';
      $('#boxScale').append(text);

    }
  }

// END EDITOR
}

document.querySelector('#lin').addEventListener("mouseup", _MOUSEUP);
document.querySelector('#lin').addEventListener("mousemove", throttle(function(event){ _MOUSEMOVE(event);},30));
document.querySelector('#lin').addEventListener("mousedown", _MOUSEDOWN, true);

$(document).on('click', '#lin', function(event) {
  event.preventDefault();
});

document.querySelector('#panel').addEventListener('mousemove', function(event) {
  if ((mode == 'line_mode' || mode == 'partition_mode') && action == 1) {
    action = 0;
    if (typeof(binder) != 'undefined') {
      binder.remove();
      delete binder;
    }
    $('#linetemp').remove();
    $('#line_construc').remove();
    lengthTemp.remove();
    delete lengthTemp;
  }
});

window.addEventListener('resize', function(event){
  width_viewbox = $('#lin').width();
  height_viewbox = $('#lin').height();
  document.querySelector('#lin').setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox)
});

// *****************************************************************************************************
// ******************************        KEYPRESS on KEYBOARD          *********************************
// *****************************************************************************************************
document.addEventListener("keydown", function(event) {
  if (mode != "text_mode") {
    if (event.keyCode == '37') {
      //LEFT
      zoom_maker('zoomleft', 100, 30);
    }
    if (event.keyCode == '38') {
      //UP
      zoom_maker('zoomtop', 100, 30);
    }
    if (event.keyCode == '39') {
      //RIGHT
      zoom_maker('zoomright', 100, 30);
    }
    if (event.keyCode == '40') {
      //DOWN
      zoom_maker('zoombottom', 100, 30);
    }
    if (event.keyCode == '107') {
      //+
      zoom_maker('zoomin', 20, 50);
    }
    if (event.keyCode == '109') {
      //-
      zoom_maker('zoomout', 20, 50);
    }
  }
  // else {
  //   if (action == 1) {
  //     binder.textContent = binder.textContent + event.key;
  //     console.log(field.value);
  //   }
  // }
});

// *****************************************************************************************************
// ******************************        MOUSE MOVE          *******************************************
// *****************************************************************************************************

function _MOUSEMOVE(event) {
  event.preventDefault();
  $('.sub').hide(100);

  //**************************************************************************
  //********************   TEXTE   MODE **************************************
  //**************************************************************************
  if (mode == 'text_mode') {
    snap = calcul_snap(event, grid_snap);
    if (action == 0) cursor('text');
    else {
      cursor('none');
    }
  }

  //**************************************************************************
  //**************        OBJECT   MODE **************************************
  //**************************************************************************
  if (mode == 'object_mode') {
    snap = calcul_snap(event, grid_snap);
    if (typeof(binder) == 'undefined') {
      $('#object_list').hide(200);
      if (modeOption == 'simpleStair') binder = new editor.obj2D("free", "stair", "simpleStair", snap, 0, 0, 0, "normal", 0, 15);
      else {
        var typeObj = modeOption;
        binder = new editor.obj2D("free", "energy", typeObj, snap, 0, 0, 0, "normal", 0);
      }

      $('#boxbind').append(binder.graph);
    }
    else {

      if ((binder.family != 'stick' && binder.family != 'collision') || WALLS.length == 0) {
        binder.x = snap.x;
        binder.y = snap.y;
        binder.oldX = binder.x;
        binder.oldY = binder.y;
        binder.update();
      }
      if (binder.family == 'collision') {
        var found = false;

        if (editor.rayCastingWalls({x: binder.bbox.left, y:binder.bbox.top})) found = true;
        if (!found && editor.rayCastingWalls({x: binder.bbox.left, y:binder.bbox.bottom})) found = true;
        if (!found && editor.rayCastingWalls({x: binder.bbox.right, y:binder.bbox.top})) found = true;
        if (!found && editor.rayCastingWalls({x: binder.bbox.right, y:binder.bbox.bottom})) found = true;

        if (!found) {
          binder.x = snap.x;
          binder.y = snap.y;
          binder.oldX = binder.x;
          binder.oldY = binder.y;
          binder.update();
        }
        else {
          binder.x = binder.oldX;
          binder.y = binder.oldY;
          binder.update();
        }
      }
      if (binder.family == 'stick') {
        pos = editor.stickOnWall(snap);
        binder.oldX = pos.x;
        binder.oldY = pos.y;
        var angleWall = qSVG.angleDeg(pos.wall.start.x, pos.wall.start.y, pos.wall.end.x, pos.wall.end.y);
        var v1 = qSVG.vectorXY({x:pos.wall.start.x, y:pos.wall.start.y}, {x:pos.wall.end.x, y:pos.wall.end.y});
        var v2 = qSVG.vectorXY({x:pos.wall.end.x, y:pos.wall.end.y}, snap);
        binder.x = pos.x - Math.sin(pos.wall.angle*(360/2*Math.PI))*binder.thick/2;
        binder.y = pos.y - Math.cos(pos.wall.angle*(360/2*Math.PI))*binder.thick/2;
        var newAngle = qSVG.vectorDeter(v1, v2);
        if (Math.sign(newAngle) == 1) {
          angleWall+=180;
          binder.x = pos.x + Math.sin(pos.wall.angle*(360/2*Math.PI))*binder.thick/2;
          binder.y = pos.y + Math.cos(pos.wall.angle*(360/2*Math.PI))*binder.thick/2;
        }
        binder.angle = angleWall;
        binder.update();
      }
    }
  }

  //**************************************************************************
  //**************        DISTANCE MODE **************************************
  //**************************************************************************
  if (mode == 'distance_mode') {
    snap = calcul_snap(event, grid_snap);
    if (typeof(binder) == 'undefined') {
      cross = qSVG.create("boxbind", "path", {
        d: "M-3000,0 L3000,0 M0,-3000 L0,3000",
        "stroke-width": 0.5,
        "stroke-opacity": "0.8",
        stroke: "#e2b653",
        fill : "#e2b653"
      });
      binder = new editor.obj2D("free", "measure", "", {x:0,y:0}, 0, 0, 0, "normal", 0, "");
      labelMeasure = qSVG.create("none", "text", {
        x: 0,
        y: - 10,
        'font-size': '1.2em',
        stroke: "#ffffff",
        "stroke-width": "0.4px",
        'font-family': 'roboto',
        'text-anchor': 'middle',
        fill : "#3672d9"
      });
      binder.graph.append(labelMeasure);
      $('#boxbind').append(binder.graph);
    }
    else {
      x = snap.x;
      y = snap.y;
      cross.attr({
        "transform": "translate(" + (snap.x) + "," + (snap.y) + ")"
      });
      if (action == 1) {
        var startText = qSVG.middle(pox, poy, x, y);
        var angleText = qSVG.angle(pox, poy, x, y);
        var valueText = qSVG.measure({
          x: pox,
          y: poy
        }, {
          x: x,
          y: y
        });
        binder.size = valueText;
        binder.x = startText.x;
        binder.y = startText.y;
        binder.angle = angleText.deg;
        valueText = (valueText / meter).toFixed(2) + ' m';
        labelMeasure.context.textContent = valueText;
        binder.update();
      }
    }
  }

  //**************************************************************************
  //**************        ROOM MODE *****************************************
  //**************************************************************************

  if (mode == 'room_mode') {
    snap = calcul_snap(event, grid_snap);
    var roomTarget;
    if (roomTarget = editor.rayCastingRoom(snap)) {
      if (typeof(binder) != 'undefined') {
        binder.remove();
        delete binder;
      }

      var pathSurface = roomTarget.coords;
      var pathCreate = "M"+pathSurface[0].x+","+pathSurface[0].y;
      for (var p = 1; p < pathSurface.length-1; p++) {
        pathCreate = pathCreate + " "+"L"+pathSurface[p].x+","+pathSurface[p].y;
      }
      pathCreate = pathCreate + "Z";

      if (roomTarget.inside.length > 0) {
        for (var ins = 0; ins < roomTarget.inside.length; ins++) {
          pathCreate = pathCreate+" M"+Rooms.polygons[roomTarget.inside[ins]].coords[Rooms.polygons[roomTarget.inside[ins]].coords.length-1].x+","+Rooms.polygons[roomTarget.inside[ins]].coords[Rooms.polygons[roomTarget.inside[ins]].coords.length-1].y;
          for (var free = Rooms.polygons[roomTarget.inside[ins]].coords.length-2; free > -1; free--) {
            pathCreate = pathCreate+" L"+Rooms.polygons[roomTarget.inside[ins]].coords[free].x+","+Rooms.polygons[roomTarget.inside[ins]].coords[free].y;
          }
        }
      }

      binder = qSVG.create('boxbind', 'path', {
        id: 'roomSelected',
        d: pathCreate,
        fill: '#c9c14c',
        'fill-opacity': 0.5,
        stroke: '#c9c14c',
        'fill-rule': 'evenodd',
        'stroke-width': 3
      });
      binder.type = 'room';
      binder.area = roomTarget.area;
      binder.id = ROOM.indexOf(roomTarget);
    }
    else {
      if (typeof(binder) != 'undefined') {
        binder.remove();
        delete binder;
      }
    }
  }

  //**************************************************************************
  //**************        DOOR/WINDOW MODE   *********************************
  //**************************************************************************

  if (mode == 'door_mode') {

    snap = calcul_snap(event, grid_snap);
    if (wallSelect = editor.nearWall(snap)) {
      var wall = wallSelect.wall;
      if (wall.type != 'separate') {
        if (typeof(binder) == 'undefined') {
          // family, classe, type, pos, angle, angleSign, size, hinge, thick
          binder = new editor.obj2D("inWall", "doorWindow", modeOption, wallSelect, 0, 0, 60, "normal", wall.thick);
          var angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
          var v1 = qSVG.vectorXY({x:wall.start.x, y:wall.start.y}, {x:wall.end.x, y:wall.end.y});
          var v2 = qSVG.vectorXY({x:wall.end.x, y:wall.end.y}, snap);
          var newAngle = qSVG.vectorDeter(v1, v2);
          if (Math.sign(newAngle) == 1)  {
            angleWall+=180;
            binder.angleSign = 1;
          }
          var startCoords = qSVG.middle(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
          binder.x = startCoords.x;
          binder.y = startCoords.y;
          binder.angle = angleWall;
          binder.update();
          $('#boxbind').append(binder.graph);
        }
        else
        {
          var angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
          var v1 = qSVG.vectorXY({x:wall.start.x, y:wall.start.y}, {x:wall.end.x, y:wall.end.y});
          var v2 = qSVG.vectorXY({x:wall.end.x, y:wall.end.y}, snap);
          var newAngle = qSVG.vectorDeter(v1, v2);
          binder.angleSign = 0;
          if (Math.sign(newAngle) == 1) {
            binder.angleSign = 1;
            angleWall+=180;
          }

          var limits = limitObj(wall.equations.base, binder.size, wallSelect);
          if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
            binder.x = wallSelect.x;
            binder.y = wallSelect.y;
            binder.angle = angleWall;
            binder.thick = wall.thick;
            binder.limit = limits;
            binder.update();
          }

          if ((wallSelect.x == wall.start.x && wallSelect.y == wall.start.y) || (wallSelect.x == wall.end.x && wallSelect.y == wall.end.y)) {
            if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y)) {
              binder.x = limits[0].x;
              binder.y = limits[0].y;                  }
            if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
              binder.x = limits[1].x;
              binder.y = limits[1].y;
            }
            binder.limit = limits;
            binder.angle = angleWall;
            binder.thick = wall.thick;
            binder.update();
          }
        }
      }
    }
    else {
      if (typeof(binder) != 'undefined') {
        binder.graph.remove();
        delete binder;
      }
    }
  } // END DOOR MODE

  //**************************************************************************
  //**************        NODE MODE *****************************************
  //**************************************************************************

  if (mode == 'node_mode') {

    snap = calcul_snap(event, grid_snap);

    if (typeof(binder) == 'undefined') {
      if (addNode = editor.nearWall(snap, 30)) {
        var x2 = addNode.wall.end.x;
        var y2 = addNode.wall.end.y;
        var x1 = addNode.wall.start.x;
        var y1 = addNode.wall.start.y;
        angleWall = qSVG.angle(x1, y1, x2, y2);
        binder = qSVG.create('boxbind', 'path', {
          id: "circlebinder",
          d: "M-20,-10 L-13,0 L-20,10 Z M-13,0 L13,0 M13,0 L20,-10 L20,10 Z",
          stroke: "#5cba79",
          fill : "#5cba79",
          "stroke-width": "1.5px"
        });
        binder.attr({
          "transform": "translate(" + (addNode.x) + "," + (addNode.y) + ") rotate(" + (angleWall.deg+90) + ",0,0)"
        });
        binder.data = addNode;
        binder.x1 = x1;
        binder.x2 = x2;
        binder.y1 = y1;
        binder.y2 = y2;
      }
    } else {
      if (addNode = editor.nearWall(snap, 30)) {
        if (addNode) {
          var x2 = addNode.wall.end.x;
          var y2 = addNode.wall.end.y;
          var x1 = addNode.wall.start.x;
          var y1 = addNode.wall.start.y;
          angleWall = qSVG.angle(x1, y1, x2, y2);
          binder.attr({
            "transform": "translate(" + (addNode.x) + "," + (addNode.y) + ") rotate(" + (angleWall.deg+90) + ",0,0)"
          });
          binder.data = addNode;
        }
        else {
          binder.remove();
          delete binder;
        }
      } else {
        binder.remove();
        delete binder;
      }
    }
  } // END NODE MODE

  //**********************************  SELECT MODE ***************************************************************
  if (mode == 'select_mode' && drag == 'off') { // FIRST TEST ON SELECT MODE (and drag OFF) to detect MOUSEOVER DOOR

    snap = calcul_snap(event, 'off');

    var objTarget = false;
    for (var i = 0; i < OBJDATA.length; i++) {
      var objX1 = OBJDATA[i].bbox.left;
      var objX2 = OBJDATA[i].bbox.right;
      var objY1 = OBJDATA[i].bbox.top;
      var objY2 = OBJDATA[i].bbox.bottom;
      var realBboxCoords = OBJDATA[i].realBbox;
      if (qSVG.rayCasting(snap, realBboxCoords)) {
        objTarget = OBJDATA[i];
      }
    }
    if (objTarget !== false) {
      if (typeof(binder) != 'undefined' && (binder.type == 'segment')) {
        binder.graph.remove();
        delete binder;
        cursor('default');
      }
      if (objTarget.params.bindBox) { // OBJ -> BOUNDINGBOX TOOL
        if (typeof(binder) == 'undefined') {
          binder = new editor.obj2D("free", "boundingBox", "", objTarget.bbox.origin, objTarget.angle, 0, objTarget.size, "normal", objTarget.thick, objTarget.realBbox);
          binder.update();
          binder.obj = objTarget;
          binder.type = 'boundingBox';
          binder.oldX = binder.x;
          binder.oldY = binder.y;
          $('#boxbind').append(binder.graph);
          if (!objTarget.params.move) cursor('trash'); // LIKE MEASURE ON PLAN
          if (objTarget.params.move) cursor('move');
        }
      }
      else {  // DOOR, WINDOW, APERTURE.. -- OBJ WITHOUT BINDBOX (params.bindBox = False) -- !!!!
        if (typeof(binder) == 'undefined') {
          var wallList = editor.rayCastingWall(objTarget);
          if (wallList.length > 1) wallList = wallList[0];
          inWallRib(wallList);
          var thickObj = wallList.thick;
          var sizeObj = objTarget.size;

          binder = new editor.obj2D("inWall", "socle", "", objTarget, objTarget.angle, 0, sizeObj, "normal", thickObj);
          binder.update();

          binder.oldXY = {x: objTarget.x, y: objTarget.y}; // FOR OBJECT MENU
          $('#boxbind').append(binder.graph);
        }
        else {
          if (event.target == binder.graph.get(0).firstChild) {
            cursor('move');
            binder.graph.get(0).firstChild.setAttribute("class","circle_css_2");
            binder.type = "obj";
            binder.obj = objTarget;
          }
          else {
            cursor('default');
            binder.graph.get(0).firstChild.setAttribute("class","circle_css_1");
            binder.type = false;
          }
        }
      }
    }
    else {
      if (typeof(binder) != 'undefined') {
        if (typeof(binder.graph) != 'undefined') binder.graph.remove();
        else binder.remove();
        delete binder;
        cursor('default');
        rib();

      }
    }

    // BIND CIRCLE IF nearNode and GROUP ALL SAME XY SEG POINTS
    if (wallNode = editor.nearWallNode(snap, 20)) {
      if (typeof(binder) == 'undefined' || binder.type == 'segment') {
        binder = qSVG.create('boxbind', 'circle', {
          id: "circlebinder",
          class: "circle_css_2",
          cx: wallNode.x,
          cy: wallNode.y,
          r: Rcirclebinder
        });
        binder.data = wallNode;
        binder.type = "node";
        if ($('#linebinder').length) $('#linebinder').remove();
      } else {
        // REMAKE CIRCLE_CSS ON BINDER AND TAKE DATA SEG GROUP
        // if (typeof(binder) != 'undefined') {
        //     binder.attr({
        //         class: "circle_css_2"
        //     });
        // }
      }
      cursor('move');
    } else {
      if (typeof(binder) != "undefined" && binder.type == 'node') {
        binder.remove();
        delete binder;
        hideAllSize();
        cursor('default');
        rib();
      }
    }


    // BIND WALL WITH NEARPOINT function ---> WALL BINDER CREATION
    if (wallBind = editor.rayCastingWalls(snap, WALLS)) {
      if (wallBind.length > 1) wallBind = wallBind[wallBind.length-1];
      if (wallBind && typeof(binder) == 'undefined') {
        var objWall = editor.objFromWall(wallBind);
        if (objWall.length > 0) editor.inWallRib2(wallBind);
        binder = {};
        binder.wall = wallBind;
        inWallRib(binder.wall);
        var line = qSVG.create('none', 'line', {
          x1: binder.wall.start.x, y1: binder.wall.start.y, x2: binder.wall.end.x, y2: binder.wall.end.y,
          "stroke-width": 5,
          stroke: "#5cba79"
        });
        var ball1 = qSVG.create('none', 'circle', {
          class: "circle_css",
          cx: binder.wall.start.x, cy: binder.wall.start.y,
          r: Rcirclebinder/1.8
        });
        var ball2 = qSVG.create('none', 'circle', {
          class: "circle_css",
          cx: binder.wall.end.x, cy: binder.wall.end.y,
          r: Rcirclebinder/1.8
        });
        binder.graph = qSVG.create('none', 'g');
        binder.graph.append(line);
        binder.graph.append(ball1);
        binder.graph.append(ball2);
        $('#boxbind').append(binder.graph);
        binder.type = "segment";
        cursor('pointer');
      }
    } else {
      if (wallBind = editor.nearWall(snap, 6)) {
        if (wallBind && typeof(binder) == 'undefined') {
          wallBind = wallBind.wall;
          var objWall = editor.objFromWall(wallBind);
          if (objWall.length > 0) editor.inWallRib2(wallBind);
          binder = {};
          binder.wall = wallBind;
          inWallRib(binder.wall);
          var line = qSVG.create('none', 'line', {
            x1: binder.wall.start.x, y1: binder.wall.start.y, x2: binder.wall.end.x, y2: binder.wall.end.y,
            "stroke-width": 5,
            stroke: "#5cba79"
          });
          var ball1 = qSVG.create('none', 'circle', {
            class: "circle_css",
            cx: binder.wall.start.x, cy: binder.wall.start.y,
            r: Rcirclebinder/1.8
          });
          var ball2 = qSVG.create('none', 'circle', {
            class: "circle_css",
            cx: binder.wall.end.x, cy: binder.wall.end.y,
            r: Rcirclebinder/1.8
          });
          binder.graph = qSVG.create('none', 'g');
          binder.graph.append(line);
          binder.graph.append(ball1);
          binder.graph.append(ball2);
          $('#boxbind').append(binder.graph);
          binder.type = "segment";
          cursor('pointer');
        }
      }
      else {
        if (typeof(binder) != "undefined" && binder.type == 'segment') {
          binder.graph.remove();
          delete binder;
          hideAllSize();
          cursor('default');
          rib();
        }
      }
    }
  } // END mode == 'select_mode' && drag == 'off'

  // ------------------------------  LINE MODE ------------------------------------------------------

  if ((mode == 'line_mode' || mode == 'partition_mode') && action == 0) {
    snap = calcul_snap(event, 'off');
    cursor('grab');
    pox = snap.x;
    poy = snap.y;
    if (helpConstruc = intersection(snap, 25)) {
      if (helpConstruc.distance < 10) {
        pox = helpConstruc.x;
        poy = helpConstruc.y;
        cursor('grab');
      } else {
        cursor('crosshair');
      }
    }
    if (wallNode = editor.nearWallNode(snap, 20)) {
      pox = wallNode.x;
      poy = wallNode.y;
      cursor('grab');
      if (typeof(binder) == 'undefined') {
        binder = qSVG.create('boxbind', 'circle', {
          id: "circlebinder",
          class: "circle_css_2",
          cx: wallNode.x,
          cy: wallNode.y,
          r: Rcirclebinder / 1.5
        });
      }
      intersectionOff();
    } else {
      if (!helpConstruc) cursor('crosshair');
      if (typeof(binder) != "undefined") {
        if (binder.graph) binder.graph.remove();
        else binder.remove();
        delete binder;
      }
    }
  }

  // ******************************************************************************************************
  // ************************** ACTION = 1   LINE MODE => WALL CREATE                 *********************
  // ******************************************************************************************************

  if (action == 1 && (mode == 'line_mode' || mode == 'partition_mode')) {

    snap = calcul_snap(event, grid_snap);
    x = snap.x;
    y = snap.y;
    starter = minMoveGrid(snap);

    if (!$('#line_construc').length) {
      if (wallNode = editor.nearWallNode(snap, 20)) {
        pox = wallNode.x;
        poy = wallNode.y;

        wallStartConstruc = false;
        if (wallNode.bestWall == WALLS.length-1) {
          cursor('validation');
        }
        else {
          cursor('grab');
        }
      } else {
        cursor('crosshair');
      }
    }

    if (starter > grid) {
      if (!$('#line_construc').length) {
        var ws = 20;
        if (mode == 'partition_mode') ws = 10;
        lineconstruc = qSVG.create("boxbind", "line", {
          id: "line_construc",
          x1: pox,
          y1: poy,
          x2: x,
          y2: y,
          "stroke-width": ws,
          "stroke-linecap": "butt",
          "stroke-opacity": 0.7,
          stroke: "#9fb2e2"
        });

        svgadd = qSVG.create("boxbind", "line", { // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
          id: "linetemp",
          x1: pox,
          y1: poy,
          x2: x,
          y2: y,
          "stroke": "transparent",
          "stroke-width": 0.5,
          "stroke-opacity": "0.9"
        });
      } else { // THE LINES AND BINDER ARE CREATED

        $('#linetemp').attr({
          x2: x,
          y2: y
        });

        if (helpConstrucEnd = intersection(snap, 10)) {
          x = helpConstrucEnd.x;
          y = helpConstrucEnd.y;
        }
        if (wallEndConstruc = editor.nearWall(snap, 12)) { // TO SNAP SEGMENT TO FINALIZE X2Y2
          x = wallEndConstruc.x;
          y = wallEndConstruc.y;
          cursor('grab');
        } else {
          cursor('crosshair');
        }

        // nearNode helped to attach the end of the construc line
        if (wallNode = editor.nearWallNode(snap, 20)) {
          if (typeof(binder) == 'undefined') {
            binder = qSVG.create('boxbind', 'circle', {
              id: "circlebinder",
              class: "circle_css_2",
              cx: wallNode.x,
              cy: wallNode.y,
              r: Rcirclebinder / 1.5
            });
          }
          $('#line_construc').attr({
            x2: wallNode.x,
            y2: wallNode.y
          });
          x = wallNode.x;
          y = wallNode.y;
          wallEndConstruc = true;
          intersectionOff();
          if (wallNode.bestWall == WALLS.length-1 && document.getElementById("multi").checked) {
            cursor('validation');
          }
          else {
            cursor('grab');
          }
        } else {
          if (typeof(binder) != "undefined") {
            binder.remove();
            delete binder;
          }
          if (wallEndConstruc === false) cursor('crosshair');
        }
        // LINETEMP AND LITLLE SNAPPING FOR HELP TO CONSTRUC ANGLE 0 90 45 *****************************************
        var fltt = qSVG.angle(pox, poy, x, y);
        var flt = Math.abs(fltt.deg);
        var coeff = fltt.deg / flt; // -45 -> -1     45 -> 1
        var phi = poy - (coeff * pox);
        var Xdiag = (y - phi) / coeff;
        if (typeof(binder) == 'undefined') {
          // HELP FOR H LINE
          var found = false;
          if (flt < 15 && Math.abs(poy - y) < 25) {
            y = poy;
            found = true;
          } // HELP FOR V LINE
          if (flt > 75 && Math.abs(pox - x) < 25) {
            x = pox;
            found = true;
          } // HELP FOR DIAG LINE
          if (flt < 55 && flt > 35 && Math.abs(Xdiag - x) < 20) {
            x = Xdiag;
            found = true;
          }
          if (found) $('#line_construc').attr({"stroke-opacity": 1});
          else $('#line_construc').attr({"stroke-opacity": 0.7});
        }
        $('#line_construc').attr({
          x2: x,
          y2: y
        });

        // SHOW WALL SIZE -------------------------------------------------------------------------
        var startText = qSVG.middle(pox, poy, x, y);
        var angleText = qSVG.angle(pox, poy, x, y);
        var valueText = ((qSVG.measure({
          x: pox,
          y: poy
        },{
          x: x,
          y: y
        })) / 60).toFixed(2);
        if (typeof(lengthTemp) == 'undefined') {
          lengthTemp = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          lengthTemp.setAttributeNS(null, 'x', startText.x);
          lengthTemp.setAttributeNS(null, 'y', (startText.y) - 15);
          lengthTemp.setAttributeNS(null, 'text-anchor', 'middle');
          lengthTemp.setAttributeNS(null, 'stroke', 'none');
          lengthTemp.setAttributeNS(null, 'stroke-width', '0.6px');
          lengthTemp.setAttributeNS(null, 'fill', '#777777');
          lengthTemp.textContent = valueText + 'm';
          $('#boxbind').append(lengthTemp);
        }
        if (typeof(lengthTemp) != 'undefined' && valueText > 0.1)
        {
          lengthTemp.setAttributeNS(null, 'x', startText.x);
          lengthTemp.setAttributeNS(null, 'y', (startText.y) - 15);
          lengthTemp.setAttribute("transform", "rotate(" + angleText.deg + " " + startText.x + "," + startText.y + ")");
          lengthTemp.textContent = valueText + ' m';
        }
        if (typeof(lengthTemp) != 'undefined' && valueText < 0.1)
        {
          lengthTemp.textContent = "";
        }
      }
    }
  } // END LINE MODE DETECT && ACTION = 1

  //ONMOVE
  // **************************************************************************************************
  //        ____ ___ _   _ ____  _____ ____
  //        | __ )_ _| \ | |  _ \| ____|  _ \
  //        |  _ \| ||  \| | | | |  _| | |_) |
  //        | |_) | || |\  | |_| | |___|  _ <
  //        |____/___|_| \_|____/|_____|_| \_\
  //
  // **************************************************************************************************

  if (mode == 'bind_mode') {

    snap = calcul_snap(event, grid_snap);

    if (binder.type == 'node') {
      var coords = snap;
      var magnetic = false;
      for (var k in wallListRun) {
        if (isObjectsEquals(wallListRun[k].end, binder.data)) {
          if (Math.abs(wallListRun[k].start.x - snap.x) < 20) {coords.x = wallListRun[k].start.x;magnetic="H";}
          if (Math.abs(wallListRun[k].start.y - snap.y) < 20) {coords.y = wallListRun[k].start.y;magnetic="V";}
        }
        if (isObjectsEquals(wallListRun[k].start, binder.data)) {
          if (Math.abs(wallListRun[k].end.x - snap.x) < 20) {coords.x = wallListRun[k].end.x;magnetic="H";}
          if (Math.abs(wallListRun[k].end.y - snap.y) < 20) {coords.y = wallListRun[k].end.y;magnetic="V";}
        }
      }

      if (nodeMove = editor.nearWallNode(snap, 15, wallListRun)) {
        coords.x = nodeMove.x;
        coords.y = nodeMove.y;
        $('#circlebinder').attr({"class": "circleGum", cx: coords.x, cy: coords.y});
        cursor('grab');
      } else {
        if (magnetic != false) {
          if (magnetic == "H") snap.x = coords.x;
          else snap.y = coords.y;
        }
        if (helpConstruc = intersection(snap, 10, wallListRun)) {
          coords.x = helpConstruc.x;
          coords.y = helpConstruc.y;
          snap.x = helpConstruc.x;
          snap.y = helpConstruc.y;
          if (magnetic != false) {
            if (magnetic == "H") snap.x = coords.x;
            else snap.y = coords.y;
          }
          cursor('grab');
        } else {
          cursor('move');
        }
        $('#circlebinder').attr({"class": "circle_css", cx: coords.x, cy: coords.y});
      }
      for (var k in wallListRun) {
        if (isObjectsEquals(wallListRun[k].start, binder.data)) {
          wallListRun[k].start.x = coords.x;
          wallListRun[k].start.y = coords.y;
        }
        if (isObjectsEquals(wallListRun[k].end, binder.data)) {
          wallListRun[k].end.x = coords.x;
          wallListRun[k].end.y = coords.y;
        }
      }
      binder.data = coords;
      editor.wallsComputing(WALLS, false); // UPDATE FALSE

      for (var k in wallListObj) {
        var wall = wallListObj[k].wall;
        var objTarget = wallListObj[k].obj;
        var angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
        var limits = limitObj(wall.equations.base, 2*wallListObj[k].distance, wallListObj[k].from); // COORDS OBJ AFTER ROTATION
        var indexLimits = 0;
        if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) indexLimits = 1;
        // NEW COORDS OBJDATA[obj]
        objTarget.x = limits[indexLimits].x;
        objTarget.y = limits[indexLimits].y;
        objTarget.angle = angleWall;
        if (objTarget.angleSign == 1) objTarget.angle = angleWall + 180;

        var limitBtwn = limitObj(wall.equations.base, objTarget.size, objTarget); // OBJ SIZE OK BTWN xy1/xy2

        if (qSVG.btwn(limitBtwn[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limitBtwn[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limitBtwn[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limitBtwn[1].y, wall.start.y, wall.end.y)) {
          objTarget.limit = limitBtwn;
          objTarget.update();
        }
        else {
          objTarget.graph.remove();
          delete objTarget;
          OBJDATA.splice(wall.indexObj, 1);
          wallListObj.splice(k, 1);
        }
      }
      // for (k in toClean)
      $('#boxRoom').empty();
      $('#boxSurface').empty();
      Rooms = qSVG.polygonize(WALLS);
      editor.roomMaker(Rooms);
    }

    // WALL MOVING ----BINDER TYPE SEGMENT-------- FUNCTION FOR H,V and Calculate Vectorial Translation

    if (binder.type == 'segment' && action == 1) {
      rib();

      if (equation2.A == 'v') { equation2.B = snap.x;}
      else if (equation2.A == 'h') { equation2.B = snap.y;}
      else { equation2.B = snap.y - (snap.x * equation2.A);}

      var intersection1 = qSVG.intersectionOfEquations(equation1, equation2, "obj");
      var intersection2 = qSVG.intersectionOfEquations(equation2, equation3, "obj");
      var intersection3 = qSVG.intersectionOfEquations(equation1, equation3, "obj");

      if (binder.wall.parent != null) {
        if (isObjectsEquals(binder.wall.parent.end, binder.wall.start)) binder.wall.parent.end = intersection1;
        else if (isObjectsEquals(binder.wall.parent.start, binder.wall.start)) binder.wall.parent.start = intersection1;
        else binder.wall.parent.end = intersection1;
      }

      if (binder.wall.child != null) {
        if (isObjectsEquals(binder.wall.child.start, binder.wall.end)) binder.wall.child.start = intersection2;
        else if (isObjectsEquals(binder.wall.child.end, binder.wall.end)) binder.wall.child.end = intersection2;
        else binder.wall.child.start = intersection2;
      }

      binder.wall.start = intersection1;
      binder.wall.end = intersection2;

      binder.graph[0].children[0].setAttribute("x1",intersection1.x);
      binder.graph[0].children[0].setAttribute("x2",intersection2.x);
      binder.graph[0].children[0].setAttribute("y1",intersection1.y);
      binder.graph[0].children[0].setAttribute("y2",intersection2.y);
      binder.graph[0].children[1].setAttribute("cx",intersection1.x);
      binder.graph[0].children[1].setAttribute("cy",intersection1.y);
      binder.graph[0].children[2].setAttribute("cx",intersection2.x);
      binder.graph[0].children[2].setAttribute("cy",intersection2.y);

      // THE EQ FOLLOWED BY eq (PARENT EQ1 --- CHILD EQ3)
      if (equation1.follow != undefined) {
        if (!qSVG.rayCasting(intersection1, equation1.backUp.coords)) { // IF OUT OF WALL FOLLOWED
          var distanceFromStart = qSVG.gap(equation1.backUp.start, intersection1);
          var distanceFromEnd = qSVG.gap(equation1.backUp.end, intersection1);
          if (distanceFromStart > distanceFromEnd) { // NEAR FROM End
            equation1.follow.end = intersection1;
          }
          else {
            equation1.follow.start = intersection1;
          }
        }
        else {
          equation1.follow.end = equation1.backUp.end;
          equation1.follow.start = equation1.backUp.start;
        }
      }
      if (equation3.follow != undefined) {
        if (!qSVG.rayCasting(intersection2, equation3.backUp.coords)) { // IF OUT OF WALL FOLLOWED
          var distanceFromStart = qSVG.gap(equation3.backUp.start, intersection2);
          var distanceFromEnd = qSVG.gap(equation3.backUp.end, intersection2);
          if (distanceFromStart > distanceFromEnd) { // NEAR FROM End
            equation3.follow.end = intersection2;
          }
          else {
            equation3.follow.start = intersection2;
          }
        }
        else {
          equation3.follow.end = equation3.backUp.end;
          equation3.follow.start = equation3.backUp.start;
        }
      }

      // EQ FOLLOWERS WALL MOVING
      for (var i = 0; i < equationFollowers.length; i++) {
        var intersectionFollowers = qSVG.intersectionOfEquations(equationFollowers[i].eq, equation2, "obj");
        if (qSVG.btwn(intersectionFollowers.x, binder.wall.start.x, binder.wall.end.x, 'round') && qSVG.btwn(intersectionFollowers.y, binder.wall.start.y, binder.wall.end.y, 'round')) {
          var size = qSVG.measure(equationFollowers[i].wall.start, equationFollowers[i].wall.end);
          if (equationFollowers[i].type == "start") {
            equationFollowers[i].wall.start = intersectionFollowers;
            if (size < 5) {
              if (equationFollowers[i].wall.child == null) {
                WALLS.splice(WALLS.indexOf(equationFollowers[i].wall), 1);
                equationFollowers.splice(i,1);
              }
            }
          }
          if (equationFollowers[i].type == "end") {
            equationFollowers[i].wall.end = intersectionFollowers;
            if (size < 5) {
              if (equationFollowers[i].wall.parent == null) {
                WALLS.splice(WALLS.indexOf(equationFollowers[i].wall), 1);
                equationFollowers.splice(i,1);
              }
            }
          }
        }
      }
      // WALL COMPUTING, BLOCK FAMILY OF BINDERWALL IF NULL (START OR END) !!!!!
      editor.wallsComputing(WALLS, "move");
      Rooms = qSVG.polygonize(WALLS);

      // OBJDATA(s) FOLLOW 90° EDGE SELECTED
      for (var rp= 0; rp < equationsObj.length; rp++) {
        var objTarget = equationsObj[rp].obj;
        var intersectionObj = qSVG.intersectionOfEquations(equationsObj[rp].eq, equation2);
        // NEW COORDS OBJDATA[o]
        objTarget.x = intersectionObj[0];
        objTarget.y = intersectionObj[1];
        var limits = limitObj(equation2, objTarget.size, objTarget);
        if (qSVG.btwn(limits[0].x, binder.wall.start.x, binder.wall.end.x) && qSVG.btwn(limits[0].y, binder.wall.start.y, binder.wall.end.y) && qSVG.btwn(limits[1].x, binder.wall.start.x, binder.wall.end.x) && qSVG.btwn(limits[1].y, binder.wall.start.y, binder.wall.end.y)) {
          objTarget.limit = limits;
          objTarget.update();
        }
      }
      // DELETING ALL OBJECT "INWALL" OVERSIZED INTO ITS EDGE (EDGE BY EDGE CONTROL)
      for (var k in WALLS) {
        var objWall = editor.objFromWall(WALLS[k]); // LIST OBJ ON EDGE
        for (var ob in objWall) {
          var objTarget = objWall[ob];
          var eq = editor.createEquationFromWall(WALLS[k]);
          var limits = limitObj(eq, objTarget.size, objTarget);
          if (!qSVG.btwn(limits[0].x, WALLS[k].start.x, WALLS[k].end.x) || !qSVG.btwn(limits[0].y, WALLS[k].start.y, WALLS[k].end.y) || !qSVG.btwn(limits[1].x, WALLS[k].start.x, WALLS[k].end.x) || !qSVG.btwn(limits[1].y, WALLS[k].start.y, WALLS[k].end.y)) {
            objTarget.graph.remove();
            delete objTarget;
            var indexObj = OBJDATA.indexOf(objTarget);
            OBJDATA.splice(indexObj, 1);
          }
        }
      }

      equationsObj = []; // REINIT eqObj -> MAYBE ONE OR PLUS OF OBJDATA REMOVED !!!!
      var objWall = editor.objFromWall(binder.wall); // LIST OBJ ON EDGE
      for (var ob = 0; ob < objWall.length; ob++) {
        var objTarget = objWall[ob];
        equationsObj.push({obj: objTarget, wall: binder.wall,  eq: qSVG.perpendicularEquation(equation2, objTarget.x, objTarget.y)});
      }

      $('#boxRoom').empty();
      $('#boxSurface').empty();
      editor.roomMaker(Rooms);
      $('#lin').css('cursor', 'pointer');
    }

    // **********************************************************************
    // ----------------------  BOUNDING BOX ------------------------------
    // **********************************************************************
    // binder.obj.params.move ---> FOR MEASURE DONT MOVE
    if (binder.type == 'boundingBox' && action == 1 && binder.obj.params.move) {
      binder.x = snap.x;
      binder.y = snap.y;
      binder.obj.x = snap.x;
      binder.obj.y = snap.y;
      binder.obj.update();
      binder.update();
    }

    // **********************************************************************
    // OBJ MOVING
    // **********************************************************************
    if (binder.type == 'obj' && action == 1) {
      if (wallSelect = editor.nearWall(snap)) {
        if (wallSelect.wall.type != 'separate') {
          inWallRib(wallSelect.wall);

          var objTarget = binder.obj;
          var wall = wallSelect.wall;
          var angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
          var v1 = qSVG.vectorXY({x:wall.start.x, y:wall.start.y}, {x:wall.end.x, y:wall.end.y});
          var v2 = qSVG.vectorXY({x:wall.end.x, y:wall.end.y}, snap);
          var newAngle = qSVG.vectorDeter(v1, v2);
          binder.angleSign = 0;
          objTarget.angleSign = 0;
          if (Math.sign(newAngle) == 1) {
            angleWall+=180;
            binder.angleSign = 1;
            objTarget.angleSign = 1;
          }
          var limits = limitObj(wall.equations.base, binder.size, wallSelect);
          if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
            binder.x = wallSelect.x;
            binder.y = wallSelect.y;
            binder.angle = angleWall;
            binder.thick = wall.thick;
            objTarget.x = wallSelect.x;
            objTarget.y = wallSelect.y;
            objTarget.angle = angleWall;
            objTarget.thick = wall.thick;
            objTarget.limit = limits;
            binder.update();
            objTarget.update();
          }

          if ((wallSelect.x == wall.start.x && wallSelect.y == wall.start.y) || (wallSelect.x == wall.end.x && wallSelect.y == wall.end.y)) {
            if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y)) {
              binder.x = limits[0].x;
              binder.y = limits[0].y;
              objTarget.x = limits[0].x;
              objTarget.y = limits[0].y;
              objTarget.limit = limits;
            }
            if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
              binder.x = limits[1].x;
              binder.y = limits[1].y;
              objTarget.x = limits[1].x;
              objTarget.y = limits[1].y;
              objTarget.limit = limits;
            }
            binder.angle = angleWall;
            binder.thick = wall.thick;
            objTarget.angle = angleWall;
            objTarget.thick = wall.thick;
            binder.update();
            objTarget.update();
          }
        }
      }
    } // END OBJ MOVE
    if (binder.type != 'obj' && binder.type != 'segment') rib();
  }
  // ENDBIND ACTION MOVE **************************************************************************

  // ---DRAG VIEWBOX PANNING -------------------------------------------------------

  if (mode == 'select_mode' && drag == 'on') {
    snap = calcul_snap(event, grid_snap);
    $('#lin').css('cursor', 'move');
    distX = (snap.xMouse - pox) * factor;
    distY = (snap.yMouse - poy) * factor;
    // pox = event.pageX;
    // poy = event.pageY;
    zoom_maker('zoomdrag', distX, distY);
  }
} // END MOUSEMOVE

// *****************************************************************************************************
// *****************************************************************************************************
// *****************************************************************************************************
// ******************************        MOUSE DOWN            *****************************************
// *****************************************************************************************************
// *****************************************************************************************************
// *****************************************************************************************************

function _MOUSEDOWN(event) {

  event.preventDefault();
  // *******************************************************************
  // **************************   DISTANCE MODE   **********************
  // *******************************************************************
  if (mode == 'distance_mode') {
    if (action == 0) {
      action = 1;
      snap = calcul_snap(event, grid_snap);
      pox = snap.x;
      poy = snap.y;
    }
  }

  // *******************************************************************
  // *************************   LINE/WALL MODE   **********************
  // *******************************************************************
  if (mode == 'line_mode'  || mode == 'partition_mode') {
    if (action == 0) {
      snap = calcul_snap(event, grid_snap);
      pox = snap.x;
      poy = snap.y;
      if (wallStartConstruc = editor.nearWall(snap, 12)) { // TO SNAP SEGMENT TO FINALIZE X2Y2
        pox = wallStartConstruc.x;
        poy = wallStartConstruc.y;
      }
    }
    else {
      // FINALIZE LINE_++
      construc = 1;
    }
    action = 1;
  }
  if (mode == 'edit_door_mode') { // ACTION 1 ACTIVATE EDITION OF THE DOOR
    action = 1;
    $('#lin').css('cursor', 'pointer');
  }

  // *******************************************************************
  // **********************   SELECT MODE + BIND   *********************
  // *******************************************************************
  if (mode == 'select_mode') {
    if (typeof(binder) != 'undefined' && (binder.type == 'segment' || binder.type == 'node' || binder.type == 'obj' || binder.type == 'boundingBox')) {
      mode = 'bind_mode';

      if (binder.type == 'obj') {
        action = 1;
      }

      if (binder.type == 'boundingBox') {
        action = 1;
      }

      // INIT FOR HELP BINDER NODE MOVING H V (MOUSE DOWN)
      if (binder.type == 'node') {
        $('#boxScale').hide(100);
        var node = binder.data;
        pox = node.x;
        poy = node.y;
        var nodeControl = {x: pox, y: poy};

        // DETERMINATE DISTANCE OF OPPOSED NODE ON EDGE(s) PARENT(s) OF THIS NODE !!!! NODE 1 -- NODE 2 SYSTE% :-(
        wallListObj = []; // SUPER VAR -- WARNING
        var objWall;
        wallListRun = [];
        for (var ee = WALLS.length-1; ee > -1; ee--) { // SEARCH MOST YOUNG WALL COORDS IN NODE BINDER
          if (isObjectsEquals(WALLS[ee].start, nodeControl) || isObjectsEquals(WALLS[ee].end, nodeControl)) {
            wallListRun.push(WALLS[ee]);
            break;
          }
        }
        if (wallListRun[0].child != null) {
          if (isObjectsEquals(wallListRun[0].child.start, nodeControl) || isObjectsEquals(wallListRun[0].child.end, nodeControl)) wallListRun.push(wallListRun[0].child);
        }
        if (wallListRun[0].parent != null) {
          if (isObjectsEquals(wallListRun[0].parent.start, nodeControl) || isObjectsEquals(wallListRun[0].parent.end, nodeControl)) wallListRun.push(wallListRun[0].parent);
        }

        for (var k in wallListRun) {
          if (isObjectsEquals(wallListRun[k].start, nodeControl) || isObjectsEquals(wallListRun[k].end, nodeControl)) {
            var nodeTarget = wallListRun[k].start;
            if (isObjectsEquals(wallListRun[k].start, nodeControl)) {
              nodeTarget = wallListRun[k].end;
            }
            objWall = editor.objFromWall(wallListRun[k]); // LIST OBJ ON EDGE -- NOT INDEX !!!
            wall = wallListRun[k];
            for (var ob = 0; ob < objWall.length; ob++) {
              var objTarget = objWall[ob];
              var distance = qSVG.measure(objTarget, nodeTarget);
              wallListObj.push({wall: wall, from: nodeTarget, distance: distance, obj: objTarget, indexObj:ob});
            }
          }
        }
        magnetic = 0;
        action = 1;
      }
      if (binder.type == 'segment') {

        $('#boxScale').hide(100);
        var wall = binder.wall;
        binder.before = binder.wall.start;
        equation2 = editor.createEquationFromWall(wall);
        if (wall.parent != null) {
          equation1 = editor.createEquationFromWall(wall.parent);
          var angle12 = qSVG.angleBetweenEquations(equation1.A, equation2.A);
          if (angle12 < 20 || angle12 > 160) {
            var found = true;
            for (var k in WALLS) {
              if (qSVG.rayCasting(wall.start, WALLS[k].coords) && !isObjectsEquals(WALLS[k], wall.parent) && !isObjectsEquals(WALLS[k], wall)) {
                if (wall.parent.parent != null && isObjectsEquals(wall, wall.parent.parent)) wall.parent.parent = null;
                if (wall.parent.child != null && isObjectsEquals(wall, wall.parent.child)) wall.parent.child = null;
                wall.parent = null;
                found = false;
                break;
              }
            }
            if (found) {
              var newWall;
              if (isObjectsEquals(wall.parent.end, wall.start, "1")) {
                newWall = new editor.wall(wall.parent.end, wall.start, "normal", wall.thick);
                WALLS.push(newWall);
                newWall.parent = wall.parent;
                newWall.child = wall;
                wall.parent.child = newWall;
                wall.parent = newWall;
                equation1 = qSVG.perpendicularEquation(equation2, wall.start.x, wall.start.y);
              }
              else if (isObjectsEquals(wall.parent.start, wall.start, "2")) {
                newWall = new editor.wall(wall.parent.start, wall.start, "normal", wall.thick);
                WALLS.push(newWall);
                newWall.parent = wall.parent;
                newWall.child = wall;
                wall.parent.parent = newWall;
                wall.parent = newWall;
                equation1 = qSVG.perpendicularEquation(equation2, wall.start.x, wall.start.y);
              }
              // CREATE NEW WALL
            }
          }
        }
        if (wall.parent == null) {
          var foundEq = false;
          for (var k in WALLS) {
            if (qSVG.rayCasting(wall.start, WALLS[k].coords) && !isObjectsEquals(WALLS[k].coords, wall.coords)) {
              var angleFollow = qSVG.angleBetweenEquations(WALLS[k].equations.base.A, equation2.A);
              if (angleFollow < 20 || angleFollow > 160) break;
              equation1 = editor.createEquationFromWall(WALLS[k]);
              equation1.follow = WALLS[k];
              equation1.backUp = {
                coords : WALLS[k].coords,
                start : WALLS[k].start,
                end : WALLS[k].end,
                child: WALLS[k].child,
                parent: WALLS[k].parent
              };
              foundEq = true;
              break;
            }
          }
          if (!foundEq) equation1 = qSVG.perpendicularEquation(equation2, wall.start.x, wall.start.y);
        }

        if (wall.child != null) {
          equation3 = editor.createEquationFromWall(wall.child);
          var angle23 = qSVG.angleBetweenEquations(equation3.A, equation2.A);
          if (angle23 < 20 || angle23 > 160) {
            var found = true;
            for (var k in WALLS) {
              if (qSVG.rayCasting(wall.end, WALLS[k].coords) && !isObjectsEquals(WALLS[k], wall.child) && !isObjectsEquals(WALLS[k], wall)) {
                if (wall.child.parent != null && isObjectsEquals(wall, wall.child.parent)) wall.child.parent = null;
                if (wall.child.child != null && isObjectsEquals(wall, wall.child.child)) wall.child.child = null;
                wall.child = null;
                found = false;
                break;
              }
            }
            if (found) {
              if (isObjectsEquals(wall.child.start, wall.end)) {
                var newWall = new editor.wall(wall.end, wall.child.start, "new", wall.thick);
                WALLS.push(newWall);
                newWall.parent = wall;
                newWall.child = wall.child;
                wall.child.parent = newWall;
                wall.child = newWall;
                equation3 = qSVG.perpendicularEquation(equation2, wall.end.x, wall.end.y);
              }
              else if (isObjectsEquals(wall.child.end, wall.end)) {
                var newWall = new editor.wall(wall.end, wall.child.end, "normal", wall.thick);
                WALLS.push(newWall);
                newWall.parent = wall;
                newWall.child = wall.child;
                wall.child.child = newWall;
                wall.child = newWall;
                equation3 = qSVG.perpendicularEquation(equation2, wall.end.x, wall.end.y);
              }
              // CREATE NEW WALL
            }
          }
        }
        if (wall.child == null) {
          var foundEq = false;
          for (var k in WALLS) {
            if (qSVG.rayCasting(wall.end, WALLS[k].coords) && !isObjectsEquals(WALLS[k].coords, wall.coords, "4")) {
              var angleFollow = qSVG.angleBetweenEquations(WALLS[k].equations.base.A, equation2.A);
              if (angleFollow < 20 || angleFollow > 160) break;
              equation3 = editor.createEquationFromWall(WALLS[k]);
              equation3.follow = WALLS[k];
              equation3.backUp = {
                coords : WALLS[k].coords,
                start : WALLS[k].start,
                end : WALLS[k].end,
                child: WALLS[k].child,
                parent: WALLS[k].parent
              };
              foundEq = true;
              break;
            }
          }
          if (!foundEq) equation3 = qSVG.perpendicularEquation(equation2, wall.end.x, wall.end.y);
        }

        equationFollowers = [];
        for (var k in WALLS) {
          if (WALLS[k].child == null && qSVG.rayCasting(WALLS[k].end, wall.coords) && !isObjectsEquals(wall, WALLS[k])) {
            equationFollowers.push({
              wall: WALLS[k],
              eq: editor.createEquationFromWall(WALLS[k]),
              type: "end"
            });
          }
          if (WALLS[k].parent == null && qSVG.rayCasting(WALLS[k].start, wall.coords) && !isObjectsEquals(wall, WALLS[k])) {
            equationFollowers.push({
              wall: WALLS[k],
              eq: editor.createEquationFromWall(WALLS[k]),
              type: "start"
            });
          }
        }

        equationsObj = [];
        var objWall = editor.objFromWall(wall); // LIST OBJ ON EDGE
        for (var ob = 0; ob < objWall.length; ob++) {
          var objTarget = objWall[ob];
          equationsObj.push({obj: objTarget, wall: wall,  eq: qSVG.perpendicularEquation(equation2, objTarget.x, objTarget.y)});
        }
        action = 1;
      }
    }

    else {
      action = 0;
      drag = 'on';
      snap = calcul_snap(event, grid_snap);
      pox = snap.xMouse;
      poy = snap.yMouse;
    }
  }
}

//******************************************************************************************************
//*******************  *****  ******        ************************************************************
//*******************  *****  ******  ****  ************************************************************
//*******************  *****  ******  ****  ************************************************************
//*******************  *****  ******        ************************************************************
//*******************         ******  ******************************************************************
//**********************************  ******************************************************************

function _MOUSEUP(event) {
  if (showRib) $('#boxScale').show(200);
  drag = 'off';
  cursor('default');
  if (mode == 'select_mode') {
    if (typeof(binder) != 'undefined') {
      binder.remove();
      delete binder;
      save();
    }
  }

  //**************************************************************************
  //********************   TEXTE   MODE **************************************
  //**************************************************************************
  if (mode == 'text_mode') {
    if (action == 0) {
      action = 1;
      $('#textToLayer').modal();
      mode == 'edit_text_mode';
    }
  }

  //**************************************************************************
  //**************        OBJECT   MODE **************************************
  //**************************************************************************
  if (mode == 'object_mode') {
    OBJDATA.push(binder);
    binder.graph.remove();
    var targetBox = 'boxcarpentry';
    if (OBJDATA[OBJDATA.length-1].class == 'energy') targetBox = 'boxEnergy';
    if (OBJDATA[OBJDATA.length-1].class == 'furniture') targetBox = 'boxFurniture';
    $('#'+targetBox).append(OBJDATA[OBJDATA.length-1].graph);
    delete binder;
    $('#boxinfo').html('Object added');
    fonc_button('select_mode');
    save();
  }

  // *******************************************************************
  // **************************   DISTANCE MODE   **********************
  // *******************************************************************
  if (mode == 'distance_mode') {

    if (action == 1) {
      action = 0;
      // MODIFY BBOX FOR BINDER ZONE (TXT)
      var bbox = labelMeasure.get(0).getBoundingClientRect();
      bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
      bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
      bbox.origin = {x: bbox.x + (bbox.width/2), y: bbox.y + (bbox.height/2)};
      binder.bbox = bbox;
      binder.realBbox = [
        {x: binder.bbox.x, y: binder.bbox.y}, {x: binder.bbox.x+binder.bbox.width, y: binder.bbox.y},{x: binder.bbox.x+binder.bbox.width, y: binder.bbox.y+binder.bbox.height}, {x: binder.bbox.x, y: binder.bbox.y+binder.bbox.height}];
      binder.size = binder.bbox.width;
      binder.thick = binder.bbox.height;
      binder.graph.append(labelMeasure);
      OBJDATA.push(binder);
      binder.graph.remove();
      $('#boxcarpentry').append(OBJDATA[OBJDATA.length-1].graph);
      delete binder;
      delete labelMeasure;
      cross.remove();
      delete cross;
      $('#boxinfo').html('Measure added');
      fonc_button('select_mode');
      save();
    }
  }

  // *******************************************************************
  // **************************   ROOM MODE   **************************
  // *******************************************************************

  if (mode == 'room_mode') {

    if (typeof(binder) == "undefined") {
      return false;
    }

    var area = binder.area / 3600;
    binder.attr({'fill': 'none', 'stroke':'#ddf00a', 'stroke-width' : 7});
    $('.size').html(area.toFixed(2)+" m²");
    $('#roomIndex').val(binder.id);
    if (ROOM[binder.id].surface != '') $('#roomSurface').val(ROOM[binder.id].surface);
    else $('#roomSurface').val('');
    document.querySelector('#seeArea').checked = ROOM[binder.id].showSurface;
    document.querySelector('#roomBackground').value = ROOM[binder.id].color;
    var roomName = ROOM[binder.id].name;
    document.querySelector('#roomName').value = roomName;
    if (ROOM[binder.id].name != '') {
      document.querySelector('#roomLabel').innerHTML = roomName+' <span class="caret"></span>';}
    else {
      document.querySelector('#roomLabel').innerHTML = 'None <span class="caret"></span>';}

    var actionToDo = ROOM[binder.id].action;
    document.querySelector('#'+actionToDo+'Action').checked = true;
    $('#panel').hide(100);
    $('#roomTools').show('300', function() {
      $('#lin').css('cursor', 'default');
      $('#boxinfo').html('Config. the room');
    });
    mode = 'edit_room_mode';
    save();
  }

  // *******************************************************************
  // **************************   NODE MODE   **************************
  // *******************************************************************

  if (mode == 'node_mode') {
    if (typeof(binder) != 'undefined') { // ALSO ON MOUSEUP WITH HAVE CIRCLEBINDER ON ADDPOINT
      var newWall = new editor.wall({x: binder.data.x, y: binder.data.y}, binder.data.wall.end, "normal", binder.data.wall.thick);
      WALLS.push(newWall);
      binder.data.wall.end = {x: binder.data.x, y: binder.data.y};
      binder.remove();
      delete binder;
      editor.architect(WALLS);
      save();
    }
    fonc_button('select_mode');
  }

  // *******************************************************************  ***** ****      *******  ******  ******  *****
  // **************************   OBJ MODE   ***************************  *   * *******     *****  ******  ******   **
  // *******************************************************************  ***** ****       ******  ******  ******  ***

  if (mode == 'door_mode') {
    if (typeof(binder) == "undefined") {
      $('#boxinfo').html('The plan currently contains no wall.');
      fonc_button('select_mode');
      return false;
    }
    OBJDATA.push(binder);
    binder.graph.remove();
    $('#boxcarpentry').append(OBJDATA[OBJDATA.length-1].graph);
    delete binder;
    $('#boxinfo').html('Element added');
    fonc_button('select_mode');
    save();
  }

  // *******************************************************************
  // ********************   LINE MODE MOUSE UP   ***********************
  // *******************************************************************

  if (mode == 'line_mode' || mode == 'partition_mode') {
    $('#linetemp').remove(); // DEL LINE HELP CONSTRUC 0 45 90
    intersectionOff();

    var sizeWall = qSVG.measure({x:x,y:y},{x:pox,y:poy});
    sizeWall = sizeWall / meter;
    if ($('#line_construc').length && sizeWall > 0.3) {
      var sizeWall = wallSize;
      if (mode == 'partition_mode') sizeWall = partitionSize;
      var wall = new editor.wall({x:pox,y:poy}, {x:x,y:y}, "normal", sizeWall);
      WALLS.push(wall);
      editor.architect(WALLS);

      if (document.getElementById("multi").checked && !wallEndConstruc) {
        cursor('validation');
        action = 1;
      }
      else action = 0;
      $('#boxinfo').html('Wall added <span style=\'font-size:0.6em\'>Moy. ' + (qSVG.measure(
        {x: pox, y: poy}, {x: x, y: y}) / 60).toFixed(2) + ' m</span>');
      $('#line_construc').remove(); // DEL LINE CONSTRUC HELP TO VIEW NEW SEG PATH
      lengthTemp.remove();
      delete lengthTemp;
      construc = 0;
      if (wallEndConstruc) action = 0;
      delete wallEndConstruc;
      pox = x;
      poy = y;
      save();
    }
    else {
      action = 0;
      construc = 0;
      $('#boxinfo').html('Select mode');
      fonc_button('select_mode');
      if (typeof(binder) != 'undefined') {
        binder.remove();
        delete binder;
      }
      snap = calcul_snap(event, grid_snap);
      pox = snap.x;
      poy = snap.y;
    }
  }
  // **************************** END LINE MODE MOUSE UP **************************

  //**************************************************************************************
  //**********************      BIND MODE MOUSE UP    ************************************
  //**************************************************************************************

  if (mode == 'bind_mode') {
    action = 0;
    construc = 0; // CONSTRUC 0 TO FREE BINDER GROUP NODE WALL MOVING
    if (typeof(binder) != 'undefined') {
      fonc_button('select_mode');
      if (binder.type == 'node') {

      } // END BINDER NODE

      if (binder.type == 'segment') {

        var found = false;
        if (binder.wall.start == binder.before) {
          found = true;
        }

        if (found) {
          $('#panel').hide(100);
          var objWall = editor.objFromWall(wallBind);
          $('#boxinfo').html('Modify a wall<br/><span style="font-size:0.7em;color:#de9b43">This wall can\'t become a separation (contains doors or windows) !</span>');
          if (objWall.length > 0) $('#separate').hide();
          else if (binder.wall.type == 'separate') {
            $('#separate').hide();
            $('#rangeThick').hide();
            $('#recombine').show();
            $('#cutWall').hide();
            document.getElementById('titleWallTools').textContent = "Modify the separation";
          }
          else {
            $('#cutWall').show();
            $('#separate').show();
            $('#rangeThick').show();
            $('#recombine').hide();
            document.getElementById('titleWallTools').textContent = "Modify the wall";
            $('#boxinfo').html('Modify the wall');
          }
          $('#wallTools').show(200);
          document.getElementById('wallWidth').setAttribute('min', 7);
          document.getElementById('wallWidth').setAttribute('max', 50);
          document.getElementById('wallWidthScale').textContent = "7-50";
          document.getElementById("wallWidth").value = binder.wall.thick;
          document.getElementById("wallWidthVal").textContent = binder.wall.thick;
          mode = 'edit_wall_mode';
        }
        delete equation1;
        delete equation2;
        delete equation3;
        delete intersectionFollowers;
      }

      if (binder.type == 'obj') {
        var moveObj = Math.abs(binder.oldXY.x - binder.x)+Math.abs(binder.oldXY.y - binder.y);
        if (moveObj < 1) {
          $('#panel').hide(100);
          $('#objTools').show('200', function() {
            $('#lin').css('cursor', 'default');
            $('#boxinfo').html('Config. the door/window');
            document.getElementById('doorWindowWidth').setAttribute('min', binder.obj.params.resizeLimit.width.min);
            document.getElementById('doorWindowWidth').setAttribute('max', binder.obj.params.resizeLimit.width.max);
            document.getElementById('doorWindowWidthScale').textContent = binder.obj.params.resizeLimit.width.min+"-"+binder.obj.params.resizeLimit.width.max;
            document.getElementById("doorWindowWidth").value = binder.obj.size;
            document.getElementById("doorWindowWidthVal").textContent = binder.obj.size;
          });
          mode = 'edit_door_mode';

        }
        else {
          mode = "select_mode";
          action = 0;
          binder.graph.remove();
          delete binder;
        }
      }

      if (typeof(binder) != 'undefined' && binder.type == 'boundingBox') {
        var moveObj = Math.abs(binder.oldX - binder.x)+Math.abs(binder.oldY - binder.y);
        var objTarget = binder.obj;
        if (!objTarget.params.move) {
          // TO REMOVE MEASURE ON PLAN
          objTarget.graph.remove();
          OBJDATA.splice(OBJDATA.indexOf(objTarget), 1);
          $('#boxinfo').html('Measure deleted !');
        }
        if (moveObj < 1 && objTarget.params.move) {
          if (!objTarget.params.resize) $('#objBoundingBoxScale').hide();
          else $('#objBoundingBoxScale').show();
          if (!objTarget.params.rotate) $('#objBoundingBoxRotation').hide();
          else $('#objBoundingBoxRotation').show();
          $('#panel').hide(100);
          $('#objBoundingBox').show('200', function() {
            $('#lin').css('cursor', 'default');
            $('#boxinfo').html('Modify the object');
            document.getElementById('bboxWidth').setAttribute('min', objTarget.params.resizeLimit.width.min);
            document.getElementById('bboxWidth').setAttribute('max', objTarget.params.resizeLimit.width.max);
            document.getElementById('bboxWidthScale').textContent = objTarget.params.resizeLimit.width.min+"-"+objTarget.params.resizeLimit.height.max;
            document.getElementById('bboxHeight').setAttribute('min', objTarget.params.resizeLimit.height.min);
            document.getElementById('bboxHeight').setAttribute('max', objTarget.params.resizeLimit.height.max);
            document.getElementById('bboxHeightScale').textContent = objTarget.params.resizeLimit.height.min+"-"+objTarget.params.resizeLimit.height.max;
            $('#stepsCounter').hide();
            if (objTarget.class == 'stair') {
              document.getElementById("bboxStepsVal").textContent = objTarget.value;
              $('#stepsCounter').show();
            }
            document.getElementById("bboxWidth").value = objTarget.width * 100;
            document.getElementById("bboxWidthVal").textContent = objTarget.width * 100;
            document.getElementById("bboxHeight").value = objTarget.height * 100;
            document.getElementById("bboxHeightVal").textContent = objTarget.height * 100;
            document.getElementById("bboxRotation").value = objTarget.angle;
            document.getElementById("bboxRotationVal").textContent = objTarget.angle;
          });
          mode = 'edit_boundingBox_mode';
        }
        else {
          mode = "select_mode";
          action = 0;
          binder.graph.remove();
          delete binder;
        }
      }

      if (mode == 'bind_mode') {
        binder.remove();
        delete binder;
      }
    } // END BIND IS DEFINED
    save();
  } // END BIND MODE

  if (mode != 'edit_room_mode') {
    editor.showScaleBox();
    rib();
  }
}
