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

  function _MOUSEMOVE(event) {
    event.preventDefault();
    $('.sub').hide(100);

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
                        if (wallNode.bestWall == WALLS.length-1) {
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
    }
    if (mode == 'select_mode' && drag == 'on') {
        snap = calcul_snap(event, grid_snap);
        $('#lin').css('cursor', 'move');
        distX = (snap.xMouse - pox) * factor;
        distY = (snap.yMouse - poy) * factor;
        // pox = event.pageX;
        // poy = event.pageY;
        zoom_maker('zoomdrag', distX, distY);
    }
}
function _MOUSEDOWN(event) {

event.preventDefault();
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

  function _MOUSEUP(event) {
    drag = 'off';
    cursor('default');
    if (mode == 'select_mode') {
        if (typeof(binder) != 'undefined') {
            binder.remove();
            delete binder;
            save();
        }
    }
    if (mode == 'room_mode') {

      if (typeof(binder) == "undefined") {
        return false;
      }

      var area = binder.area / 3600;
      binder.attr({'fill': 'none', 'stroke':'#ddf00a', 'stroke-width' : 7});
      $('.size').html(area.toFixed(2)+" m²");
      $('#roomIndex').val(binder.id);
      document.querySelector('#roomBackground').value = ROOM[binder.id].color;
      $('#panel').hide(100);
      $('#roomTools').show('300', function() {
        $('#lin').css('cursor', 'default');
      });
      mode = 'edit_room_mode';
      save();
    }

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

          if (!wallEndConstruc) {
            cursor('validation');
            action = 1;
          }
          else action = 0;
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
                $('#wallTools').show(200);
                mode = 'edit_wall_mode';
              }
                delete equation1;
                delete equation2;
                delete equation3;
                delete intersectionFollowers;
            }


          if (typeof(binder) != 'undefined' && binder.type == 'boundingBox') {
            var moveObj = Math.abs(binder.oldX - binder.x)+Math.abs(binder.oldY - binder.y);
            var objTarget = binder.obj;
            if (!objTarget.params.move) {
              // TO REMOVE MEASURE ON PLAN
              objTarget.graph.remove();
              OBJDATA.splice(OBJDATA.indexOf(objTarget), 1);
            }
            if (moveObj < 1 && objTarget.params.move) {
              if (!objTarget.params.resize) $('#objBoundingBoxScale').hide();
              else $('#objBoundingBoxScale').show();
              if (!objTarget.params.rotate) $('#objBoundingBoxRotation').hide();
              else $('#objBoundingBoxRotation').show();
              $('#panel').hide(100);
              $('#objBoundingBox').show('200', function() {
                $('#lin').css('cursor', 'default');
                document.getElementById('bboxWidth').setAttribute('min', objTarget.params.resizeLimit.width.min);
                document.getElementById('bboxWidth').setAttribute('max', objTarget.params.resizeLimit.width.max);
                document.getElementById('bboxWidthScale').textContent = objTarget.params.resizeLimit.width.min+"-"+objTarget.params.resizeLimit.height.max;
                document.getElementById('bboxHeight').setAttribute('min', objTarget.params.resizeLimit.height.min);
                document.getElementById('bboxHeight').setAttribute('max', objTarget.params.resizeLimit.height.max);
                document.getElementById('bboxHeightScale').textContent = objTarget.params.resizeLimit.height.min+"-"+objTarget.params.resizeLimit.height.max;
                $('#stepsCounter').hide();
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
