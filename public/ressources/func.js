//init
WALLS = [];
OBJDATA = [];
ROOM = [];
HISTORY = [];
wallSize = 20;
partitionSize = 8;
var drag = 'off';
var action = 0;
var magnetic = 0;
var construc = 0;
var Rcirclebinder = 8;
var mode = 'select_mode';
var modeOption;
taille_w = $('#lin').width();
taille_h = $('#lin').height();
var offset = $('#lin').offset();
grid = 20;
meter = 60;
grid_snap = 'off';
colorbackground = "#ffffff";
colorline = "#fff";
colorroom = "#f0daaf";
colorWall = "#666";
pox = 0;
poy = 0;
segment = 0;
xpath = 0;
ypath = 0;
var width_viewbox = taille_w;
var height_viewbox = taille_h;
var ratio_viewbox = height_viewbox / width_viewbox;
var originX_viewbox = 0;
var originY_viewbox = 0;
var zoom = 9;
var factor = 1;

// **************************************************************************
// *****************   LOAD / SAVE LOCALSTORAGE      ************************
// **************************************************************************

function initHistory(boot = false) {
  HISTORY.index = 0;
  if (!boot && localStorage.getItem('history')) localStorage.removeItem('history');
    if (localStorage.getItem('history') && boot == "recovery") {
      var historyTemp = JSON.parse(localStorage.getItem('history'));
      load(historyTemp.length-1, "boot");
      save("boot");
    }
}

function save(boot = false) {
  if (boot) localStorage.removeItem('history');
  // FOR CYCLIC OBJ INTO LOCALSTORAGE !!!
  for (var k in WALLS) {
    if (WALLS[k].child != null) WALLS[k].child = WALLS.indexOf(WALLS[k].child);
    if (WALLS[k].parent != null) WALLS[k].parent = WALLS.indexOf(WALLS[k].parent);
  }
  if (JSON.stringify({objData: OBJDATA, wallData: WALLS, roomData: ROOM}) == HISTORY[HISTORY.length-1]) {
    for (var k in WALLS) {
      if (WALLS[k].child != null) WALLS[k].child = WALLS[WALLS[k].child];
      if (WALLS[k].parent != null) WALLS[k].parent = WALLS[WALLS[k].parent];
    }
    return false;
  }

  if (HISTORY.index < HISTORY.length) {
    HISTORY.splice(HISTORY.index, (HISTORY.length - HISTORY.index));
  }
  HISTORY.push(JSON.stringify({objData: OBJDATA, wallData: WALLS, roomData: ROOM}));
  localStorage.setItem('history', JSON.stringify(HISTORY));
  HISTORY.index++;
  for (var k in WALLS) {
    if (WALLS[k].child != null) WALLS[k].child = WALLS[WALLS[k].child];
    if (WALLS[k].parent != null) WALLS[k].parent = WALLS[WALLS[k].parent];
  }
  return true;
}

function load(index = HISTORY.index, boot = false) {
  if (HISTORY.length == 0 && !boot) return false;
  for (var k in OBJDATA){
    OBJDATA[k].graph.remove();
  }
  OBJDATA = [];
  var historyTemp = [];
  historyTemp = JSON.parse(localStorage.getItem('history'));
  historyTemp = JSON.parse(historyTemp[index]);

  for (var k in historyTemp.objData) {
    var OO = historyTemp.objData[k];
    // if (OO.family == 'energy') OO.family = 'byObject';
    var obj = new editor.obj2D(OO.family, OO.class, OO.type, {x: OO.x, y: OO.y}, OO.angle, OO.angleSign, OO.size, OO.hinge = 'normal', OO.thick, OO.value);
    obj.limit = OO.limit;
    OBJDATA.push(obj);
    $('#boxcarpentry').append(OBJDATA[OBJDATA.length-1].graph);
    obj.update();
  }
  WALLS = historyTemp.wallData;
  for (var k in WALLS) {
    if (WALLS[k].child != null) WALLS[k].child = WALLS[WALLS[k].child];
    if (WALLS[k].parent != null) WALLS[k].parent = WALLS[WALLS[k].parent];
  }
  ROOM = historyTemp.roomData;
  editor.architect(WALLS);
  editor.showScaleBox();
  rib();
}

$('svg').each(function() {
    $(this)[0].setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox)
});

document.getElementById("bboxTrash").addEventListener("click", function () {
  binder.obj.graph.remove();
  binder.graph.remove();
  OBJDATA.splice(OBJDATA.indexOf(binder.obj), 1);
  $('#objBoundingBox').hide(100);
  $('#panel').show(200);
  fonc_button('select_mode');
  delete binder;
  rib();
});

document.getElementById("bboxStepsAdd").addEventListener("click", function () {
  var newValue = document.getElementById("bboxStepsVal").textContent;
  if (newValue < 15) {
    newValue++;
    binder.obj.value  = newValue;
    binder.obj.update();
    document.getElementById("bboxStepsVal").textContent = newValue;
  }
});

document.getElementById("bboxStepsMinus").addEventListener("click", function () {
  var newValue = document.getElementById("bboxStepsVal").textContent;
  if (newValue > 2) {
    newValue--;
    binder.obj.value  = newValue;
    binder.obj.update();
    document.getElementById("bboxStepsVal").textContent = newValue;
  }
});

document.getElementById('bboxWidth').addEventListener("input", function() {
  var sliderValue = this.value;
  var objTarget = binder.obj;
  objTarget.size  = (sliderValue / 100) * meter;
  objTarget.update();
  binder.size = (sliderValue / 100) * meter;
  binder.update();
  document.getElementById("bboxWidthVal").textContent = sliderValue;
});

document.getElementById('bboxHeight').addEventListener("input", function() {
  var sliderValue = this.value;
  var objTarget = binder.obj;
  objTarget.thick  = (sliderValue / 100) * meter;
  objTarget.update();
  binder.thick = (sliderValue / 100) * meter;
  binder.update();
  document.getElementById("bboxHeightVal").textContent = sliderValue;
});

document.getElementById('bboxRotation').addEventListener("input", function() {
    var sliderValue = this.value;
    var objTarget = binder.obj;
    objTarget.angle  = sliderValue;
    objTarget.update();
    binder.angle = sliderValue;
    binder.update();
    document.getElementById("bboxRotationVal").textContent = sliderValue;
  });

window.addEventListener("load", function(){
  document.getElementById('panel').style.transform = "translateX(200px)";
  document.getElementById('panel').addEventListener("transitionend", function() {
    document.getElementById('zoomBox').style.transform = "translateX(-165px)";
  });
  $('#myModal').modal();
});




if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      while (k < len) {
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

function isObjectsEquals(a, b, message = false) {
  if (message) console.log(message)
  var isOK = true;
  for (var prop in a) {
    if (a[prop] !== b[prop]) {
      isOK = false;
      break;
    }
  }
  return isOK;
};

function throttle(callback, delay) {
    var last;
    var timer;
    return function () {
        var context = this;
        var now = +new Date();
        var args = arguments;
        if (last && now < last + delay) {
            // le délai n'est pas écoulé on reset le timer
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                callback.apply(context, args);
            }, delay);
        } else {
            last = now;
            callback.apply(context, args);
        }
    };
}

$("#lin").mousewheel(throttle(function(event) {
    event.preventDefault();
    if (event.deltaY > 0) {
        zoom_maker('zoomin', 200);
    } else {
        zoom_maker('zoomout', 200);
    }
},100));

document.getElementById("applySurface").addEventListener("click", function () {
      $('#roomTools').hide(100);
      $('#panel').show(200);
      binder.remove();
      delete binder;
      var id = $('#roomIndex').val();
      //COLOR
      var data = $('#roomBackground').val();
      ROOM[id].color = data;
      $('#boxRoom').empty();
      $('#boxSurface').empty();
      editor.roomMaker(Rooms);
      fonc_button('select_mode');
});

document.getElementById("resetRoomTools").addEventListener("click", function () {
  $('#roomTools').hide(100);
  $('#panel').show(200);
  binder.remove();
  delete binder;
  fonc_button('select_mode');

});

document.getElementById("wallTrash").addEventListener("click", function () {
  var wall = binder.wall;
  for (var k in WALLS) {
      if (isObjectsEquals(WALLS[k].child, wall)) WALLS[k].child = null;
      if (isObjectsEquals(WALLS[k].parent, wall)) {WALLS[k].parent = null;}
  }
  WALLS.splice(WALLS.indexOf(wall),1);
  $('#wallTools').hide(100);
  wall.graph.remove();
  binder.graph.remove();
  editor.architect(WALLS);
  rib();
  mode = "select_mode";
  $('#panel').show(200);
});



var zoomBtn = document.querySelectorAll('.zoom');
  for (var k = 0; k < zoomBtn.length; k++) {
    zoomBtn[k].addEventListener("click", function () {
        lens = this.getAttribute('data-zoom');
        zoom_maker(lens, 200, 50);
    })
}

var roomColorBtn = document.querySelectorAll(".roomColor");
  for (var k = 0; k < roomColorBtn.length; k++) {
    roomColorBtn[k].addEventListener("click", function () {
      var data = this.getAttribute('data-type');
      $('#roomBackground').val(data);
      binder.attr({'fill':'url(#'+data+')'});
    });
  }

var objTrashBtn = document.querySelectorAll(".objTrash");
  for (var k = 0; k < objTrashBtn.length; k++) {
    objTrashBtn[k].addEventListener("click", function () {
      var obj = binder.obj;
      obj.graph.remove();
      OBJDATA.splice(OBJDATA.indexOf(obj), 1);
      fonc_button('select_mode');
      $('#panel').show('200');
      binder.graph.remove();
      delete binder;
      rib();
      $('#panel').show('300');
    });
}

var dropdownMenu = document.querySelectorAll(".dropdown-menu li a");
  for (var k = 0; k < dropdownMenu.length; k++) {
    dropdownMenu[k].addEventListener("click", function () {
      var selText = this.textContent;
      $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
    });
  }

// TRY MATRIX CALC FOR BBOX REAL COORDS WITH TRAS + ROT.
function matrixCalc(el, message = false) {
  if (message) console.log("matrixCalc called by -> "+message);
  var m = el.getCTM();
  var bb = el.getBBox();
  var tpts = [
    matrixXY(m,bb.x,bb.y),
    matrixXY(m,bb.x+bb.width,bb.y),
    matrixXY(m,bb.x+bb.width,bb.y+bb.height),
    matrixXY(m,bb.x,bb.y+bb.height)];
  return tpts;
}
function matrixXY(m,x,y) {
            return { x: x * m.a + y * m.c + m.e, y: x * m.b + y * m.d + m.f };
}
function realBboxShow(coords) {
  for (var k in coords) {
    debugPoint(coords[k]);
  }
}


function limitObj(equation, size, coords,message = false) {
  if (message) console.log(message)
  var Px = coords.x;
  var Py = coords.y;
  var Aq =  equation.A;
  var Bq =  equation.B;
  if (Aq == 'v') {
    var pos1 = {x: Px, y: Py - size/2};
    var pos2 = {x: Px, y: Py + size/2};
  }
  else if (Aq == 'h') {
    var pos1 = {x: Px - size/2, y: Py};
    var pos2 = {x: Px + size/2, y: Py};
  }
  else {
    var A = 1 + Aq*Aq;
    var B = (-2 * Px) + (2 * Aq * Bq) + (-2 * Py * Aq);
    var C = (Px*Px) + (Bq*Bq) - (2*Py*Bq) + (Py*Py) - (size*size)/4; // -N
    var Delta = (B*B) - (4*A*C);
    var posX1 = (-B-(Math.sqrt(Delta))) / (2*A);
    var posX2 = (-B+(Math.sqrt(Delta))) / (2*A);
    var pos1 = {x: posX1, y: (Aq * posX1) + Bq};
    var pos2 = {x: posX2, y: (Aq * posX2) + Bq};
  }
  return [pos1, pos2];
}

function zoom_maker(lens, xmove, xview) {

    if (lens == 'zoomout' && zoom > 1 && zoom < 17) {
        zoom--;
        width_viewbox += xmove;
        height_viewbox = width_viewbox * ratio_viewbox;
        originX_viewbox = originX_viewbox - (xmove/2);
        originY_viewbox = originY_viewbox - (xmove/2 * ratio_viewbox);
    }
    if (lens == 'zoomin' && zoom < 14 && zoom > 0) {
        zoom++;
        var oldWidth = width_viewbox;
        width_viewbox -= xmove;
        height_viewbox = width_viewbox * ratio_viewbox;

        originX_viewbox =  originX_viewbox + (xmove/2);
        originY_viewbox =  originY_viewbox + (xmove/2 * ratio_viewbox);
    }
    factor = width_viewbox / taille_w;
    if (lens == 'zoomreset') {
      originX_viewbox = 0;
      originY_viewbox = 0;
      width_viewbox = taille_w;
      height_viewbox = taille_h;
      factor = 1;
    }
    if (lens == 'zoomright') {
        originX_viewbox += xview;
    }
    if (lens == 'zoomleft') {
        originX_viewbox -= xview;
    }
    if (lens == 'zoomtop') {
        originY_viewbox -= xview;
    }
    if (lens == 'zoombottom') {
        originY_viewbox += xview;
    }
    if (lens == 'zoomdrag') {
        originX_viewbox -= xmove;
        originY_viewbox -= xview;
    }
    $('svg').each(function() {
        $(this)[0].setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox)
    });
}

tactile = false;
function calcul_snap(event, state) {
  if (event.touches) {
    var touches = event.changedTouches;
    console.log("toto")
    eX = touches[0].pageX;
    eY = touches[0].pageY;
    tactile = true;
  }
  else {
    eX = event.pageX;
    eY = event.pageY;
  }
    x_mouse = (eX * factor) - (offset.left * factor) + originX_viewbox;
    y_mouse = (eY * factor) - (offset.top * factor) + originY_viewbox;

    if (state == 'on') {
        x_grid = Math.round(x_mouse / grid) * grid;
        y_grid = Math.round(y_mouse / grid) * grid;
    }
    if (state == 'off') {
        x_grid = x_mouse;
        y_grid = y_mouse;
    }
    return {
        x: x_grid,
        y: y_grid,
        xMouse: x_mouse,
        yMouse: y_mouse
    };
}

minMoveGrid = function(mouse) {
    return Math.abs(Math.abs(pox - mouse.x) + Math.abs(poy - mouse.y));
}

function intersectionOff() {
  if (typeof(lineIntersectionP) != 'undefined') {
      lineIntersectionP.remove();
      delete lineIntersectionP;
  }
}

function intersection(snap, range = Infinity, except = ['']) {
  // ORANGE LINES 90° NEAR SEGMENT
  var bestEqPoint = {};
  var equation = {};

  bestEqPoint.distance = range;

  if (typeof(lineIntersectionP) != 'undefined') {
      lineIntersectionP.remove();
      delete lineIntersectionP;
  }

  lineIntersectionP = qSVG.create("boxbind", "path", { // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
      d: "",
      "stroke": "transparent",
      "stroke-width": 0.5,
      "stroke-opacity": "1",
      fill : "none"
    });

  for (index = 0; index < WALLS.length; index++) {
    if (except.indexOf(WALLS[index]) == -1) {
    var x1 = WALLS[index].start.x;
    var y1 = WALLS[index].start.y;
    var x2 = WALLS[index].end.x;
    var y2 = WALLS[index].end.y;

    // EQUATION 90° of segment nf/nf-1 at X2/Y2 Point
    if (Math.abs(y2 - y1) == 0) {
      equation.C = 'v'; // C/D equation 90° Coef = -1/E
      equation.D = x1;
      equation.E = 'h'; // E/F equation Segment
      equation.F = y1;
      equation.G = 'v'; // G/H equation 90° Coef = -1/E
      equation.H = x2;
      equation.I = 'h'; // I/J equation Segment
      equation.J = y2;
    }
    else if (Math.abs(x2 - x1) == 0) {
      equation.C = 'h'; // C/D equation 90° Coef = -1/E
      equation.D = y1;
      equation.E = 'v'; // E/F equation Segment
      equation.F = x1;
      equation.G = 'h'; // G/H equation 90° Coef = -1/E
      equation.H = y2;
      equation.I = 'v'; // I/J equation Segment
      equation.J = x2;
    }
    else {
      equation.C = (x1 - x2) / (y2 - y1);
      equation.D = y1 - (x1 * equation.C);
      equation.E = (y2 - y1) / (x2 - x1);
      equation.F = y1 - (x1 * equation.E);
      equation.G = (x1 - x2) / (y2 - y1);
      equation.H = y2 - (x2 * equation.C);
      equation.I = (y2 - y1) / (x2 - x1);
      equation.J = y2 - (x2 * equation.E);
      }
      equation.A = equation.C;
      equation.B = equation.D;
      eq = qSVG.nearPointOnEquation(equation, snap);
      if (eq.distance < bestEqPoint.distance) {
          bestEqPoint.distance = eq.distance;
          bestEqPoint.node = index;
          bestEqPoint.x = eq.x;
          bestEqPoint.y = eq.y;
          bestEqPoint.x1 = x1;
          bestEqPoint.y1 = y1;
          bestEqPoint.x2 = x2;
          bestEqPoint.y2 = y2;
          bestEqPoint.way = 1;
      }
      equation.A = equation.E;
      equation.B = equation.F;
      eq = qSVG.nearPointOnEquation(equation, snap);
      if (eq.distance < bestEqPoint.distance) {
          bestEqPoint.distance = eq.distance;
          bestEqPoint.node = index;
          bestEqPoint.x = eq.x;
          bestEqPoint.y = eq.y;
          bestEqPoint.x1 = x1;
          bestEqPoint.y1 = y1;
          bestEqPoint.x2 = x2;
          bestEqPoint.y2 = y2;
          bestEqPoint.way = 1;
      }
      equation.A = equation.G;
      equation.B = equation.H;
      eq = qSVG.nearPointOnEquation(equation, snap);
      if (eq.distance < bestEqPoint.distance) {
          bestEqPoint.distance = eq.distance;
          bestEqPoint.node = index;
          bestEqPoint.x = eq.x;
          bestEqPoint.y = eq.y;
          bestEqPoint.x1 = x1;
          bestEqPoint.y1 = y1;
          bestEqPoint.x2 = x2;
          bestEqPoint.y2 = y2;
          bestEqPoint.way = 2;
      }
      equation.A = equation.I;
      equation.B = equation.J;
      eq = qSVG.nearPointOnEquation(equation, snap);
      if (eq.distance < bestEqPoint.distance) {
          bestEqPoint.distance = eq.distance;
          bestEqPoint.node = index;
          bestEqPoint.x = eq.x;
          bestEqPoint.y = eq.y;
          bestEqPoint.x1 = x1;
          bestEqPoint.y1 = y1;
          bestEqPoint.x2 = x2;
          bestEqPoint.y2 = y2;
          bestEqPoint.way = 2;
      }
   } // END INDEXOF EXCEPT TEST
  } // END LOOP FOR

  if (bestEqPoint.distance < range) {
    if (bestEqPoint.way == 2) {
      lineIntersectionP.attr({ // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
          d: "M"+bestEqPoint.x1+","+bestEqPoint.y1+" L"+bestEqPoint.x2+","+bestEqPoint.y2+" L"+bestEqPoint.x+","+bestEqPoint.y,
          "stroke": "#d7ac57"
        });
    }
    else {
      lineIntersectionP.attr({ // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
          d: "M"+bestEqPoint.x2+","+bestEqPoint.y2+" L"+bestEqPoint.x1+","+bestEqPoint.y1+" L"+bestEqPoint.x+","+bestEqPoint.y,
          "stroke": "#d7ac57"
        });
    }
    return ({
    x: bestEqPoint.x,
    y: bestEqPoint.y,
    wall : WALLS[bestEqPoint.node],
    distance: bestEqPoint.distance
    });
  }
  else {
    return false;
  }
}

function debugPoint(point, name, color = "#00ff00") {
      qSVG.create('boxDebug', 'circle', {
      cx: point.x,
      cy: point.y,
      r: 7,
      fill: color,
      id: name,
      class: "visu"
  });
}

$('.visu').mouseover(function() {console.log(this.id)});

var sizeText = [];
var showAllSizeStatus = 0;
function hideAllSize() {
  $('#boxbind').empty();
  sizeText = [];
  showAllSizeStatus = 0;
}

function allRib() {
  $('#boxRib').empty();
  for (var i in WALLS) {
    inWallRib(WALLS[i], 'all');
  }
}

function inWallRib(wall, option = false) {
  if (!option) $('#boxRib').empty();
  ribMaster = [];
  ribMaster.push([]);
  ribMaster.push([]);
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
    ribMaster[0].push({wall: objTarget, crossObj: ob, side : 'up', coords: objTarget.up[0], distance: distance.toFixed(2)});
    distance = qSVG.measure(wall.coords[0], objTarget.up[1]) / meter;
    ribMaster[0].push({wall: objTarget, crossObj: ob, side : 'up', coords: objTarget.up[1], distance: distance.toFixed(2)});
    distance = qSVG.measure(wall.coords[1], objTarget.down[0]) / meter;
    ribMaster[1].push({wall: objTarget, crossObj: ob, side : 'down', coords: objTarget.down[0], distance: distance.toFixed(2)});
    distance = qSVG.measure(wall.coords[1], objTarget.down[1]) / meter;
    ribMaster[1].push({wall: objTarget, crossObj: ob, side : 'down', coords: objTarget.down[1], distance: distance.toFixed(2)});
  }
  distance = qSVG.measure(wall.coords[0], wall.coords[3]) / meter;
  ribMaster[0].push({wall: objTarget, crossObj: false, side : 'up', coords: wall.coords[3], distance: distance});
  distance = qSVG.measure(wall.coords[1], wall.coords[2]) / meter;
  ribMaster[1].push({wall: objTarget, crossObj: false, side : 'down', coords: wall.coords[2], distance: distance});
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
          sizeText[n].setAttributeNS(null, 'stroke-width', '0.27px');
          sizeText[n].setAttributeNS(null, 'fill', '#666666');
          sizeText[n].setAttribute("transform", "rotate("+angleText+" "+startText.x+","+(startText.y)+")");

          $('#boxRib').append(sizeText[n]);
      }
    }
  }
}

function rib(shift = 5) {
  // return false;
  var ribMaster = [];
  ribMaster.push([]);
  ribMaster.push([]);
  var inter;
  var distance;
  var cross;
  for (var i in WALLS) {
    if (WALLS[i].equations.base) {
      ribMaster[0].push([]);
      ribMaster[0][i].push({wallIndex: i, crossEdge: i, side : 'up', coords: WALLS[i].coords[0], distance: 0});
      ribMaster[1].push([]);
      ribMaster[1][i].push({wallIndex: i, crossEdge: i, side : 'down', coords: WALLS[i].coords[1], distance: 0});
      for (var p in WALLS) {
        if (i != p && WALLS[p].equations.base) {
          cross = qSVG.intersectionOfEquations(WALLS[i].equations.base, WALLS[p].equations.base, "object");
          if (qSVG.btwn(cross.x, WALLS[i].start.x, WALLS[i].end.x, 'round') && qSVG.btwn(cross.y, WALLS[i].start.y, WALLS[i].end.y, 'round')) {

            inter = qSVG.intersectionOfEquations(WALLS[i].equations.up, WALLS[p].equations.up, "object");
            if (qSVG.btwn(inter.x, WALLS[i].coords[0].x, WALLS[i].coords[3].x, 'round') && qSVG.btwn(inter.y, WALLS[i].coords[0].y, WALLS[i].coords[3].y, 'round') && qSVG.btwn(inter.x, WALLS[p].coords[0].x, WALLS[p].coords[3].x, 'round') && qSVG.btwn(inter.y, WALLS[p].coords[0].y, WALLS[p].coords[3].y, 'round')){
              distance = qSVG.measure(WALLS[i].coords[0], inter) / meter;
              ribMaster[0][i].push({wallIndex: i, crossEdge: p, side : 'up', coords: inter, distance: distance.toFixed(2)});
            }

            inter = qSVG.intersectionOfEquations(WALLS[i].equations.up, WALLS[p].equations.down, "object");
            if (qSVG.btwn(inter.x, WALLS[i].coords[0].x, WALLS[i].coords[3].x, 'round') && qSVG.btwn(inter.y, WALLS[i].coords[0].y, WALLS[i].coords[3].y, 'round') && qSVG.btwn(inter.x, WALLS[p].coords[1].x, WALLS[p].coords[2].x, 'round') && qSVG.btwn(inter.y, WALLS[p].coords[1].y, WALLS[p].coords[2].y, 'round')){
              distance = qSVG.measure(WALLS[i].coords[0], inter) / meter;
              ribMaster[0][i].push({wallIndex: i, crossEdge: p, side : 'up', coords: inter, distance: distance.toFixed(2)});
            }

            inter = qSVG.intersectionOfEquations(WALLS[i].equations.down, WALLS[p].equations.up, "object");
            if (qSVG.btwn(inter.x, WALLS[i].coords[1].x, WALLS[i].coords[2].x, 'round') && qSVG.btwn(inter.y, WALLS[i].coords[1].y, WALLS[i].coords[2].y, 'round') && qSVG.btwn(inter.x, WALLS[p].coords[0].x, WALLS[p].coords[3].x, 'round') && qSVG.btwn(inter.y, WALLS[p].coords[0].y, WALLS[p].coords[3].y, 'round')){
              distance = qSVG.measure(WALLS[i].coords[1], inter) / meter;
              ribMaster[1][i].push({wallIndex: i, crossEdge: p, side : 'down', coords: inter, distance: distance.toFixed(2)});
            }

            inter = qSVG.intersectionOfEquations(WALLS[i].equations.down, WALLS[p].equations.down, "object");
            if (qSVG.btwn(inter.x, WALLS[i].coords[1].x, WALLS[i].coords[2].x, 'round') && qSVG.btwn(inter.y, WALLS[i].coords[1].y, WALLS[i].coords[2].y, 'round') && qSVG.btwn(inter.x, WALLS[p].coords[1].x, WALLS[p].coords[2].x, 'round') && qSVG.btwn(inter.y, WALLS[p].coords[1].y, WALLS[p].coords[2].y, 'round')){
              distance = qSVG.measure(WALLS[i].coords[1], inter) / meter;
              ribMaster[1][i].push({wallIndex: i, crossEdge: p, side : 'down', coords: inter, distance: distance.toFixed(2)});
            }
          }
        }
      }
      distance = qSVG.measure(WALLS[i].coords[0], WALLS[i].coords[3]) / meter;
      ribMaster[0][i].push({wallIndex: i, crossEdge: i, side : 'up', coords: WALLS[i].coords[3], distance: distance.toFixed(2)});
      distance = qSVG.measure(WALLS[i].coords[1], WALLS[i].coords[2]) / meter;
      ribMaster[1][i].push({wallIndex: i, crossEdge: i, side : 'down', coords: WALLS[i].coords[2], distance: distance.toFixed(2)});
    }
  }

  for (var a in ribMaster[0]) {
    ribMaster[0][a].sort(function(a,b) {
      return (a.distance - b.distance).toFixed(2);
    });
  }
  for (var a in ribMaster[1]) {
    ribMaster[1][a].sort(function(a,b) {
      return (a.distance - b.distance).toFixed(2);
    });
  }

  var sizeText = [];
  if (shift == 5) $('#boxRib').empty();
  for (var t in ribMaster) {
    for (var a in ribMaster[t]) {
      for (var n = 1; n < ribMaster[t][a].length; n++) {
        if (ribMaster[t][a][n-1].wallIndex == ribMaster[t][a][n].wallIndex) {
          var edge = ribMaster[t][a][n].wallIndex;
          var found = true;
          var valueText = Math.abs(ribMaster[t][a][n-1].distance - ribMaster[t][a][n].distance);
          // CLEAR TOO LITTLE VALUE
          if (valueText < 0.15) {
            found = false;
          }
          // CLEAR (thick) BETWEEN CROSS EDGE
          if (found && ribMaster[t][a][n-1].crossEdge == ribMaster[t][a][n].crossEdge &&  ribMaster[t][a][n].crossEdge != ribMaster[t][a][n].wallIndex){
            found= false;
          }
          // CLEAR START INTO EDGE
          if (found && ribMaster[t][a].length > 2 && n==1) {
            var polygon = [];
            for (var pp = 0; pp < 4; pp++) {
              polygon.push({x: WALLS[ribMaster[t][a][n].crossEdge].coords[pp].x, y: WALLS[ribMaster[t][a][n].crossEdge].coords[pp].y}); // FOR Z
            }
            if (qSVG.rayCasting(ribMaster[t][a][0].coords, polygon)) {
              found = false;
            }
          }
          // CLEAR END INTO EDGE
          if (found && ribMaster[t][a].length > 2 && n == ribMaster[t][a].length-1){
            var polygon = [];
            for (var pp = 0; pp < 4; pp++) {
              polygon.push({x: WALLS[ribMaster[t][a][n-1].crossEdge].coords[pp].x, y: WALLS[ribMaster[t][a][n-1].crossEdge].coords[pp].y}); // FOR Z
            }
            if (qSVG.rayCasting(ribMaster[t][a][ribMaster[t][a].length-1].coords, polygon)) {
              found = false;
            }
          }

          if (found) {
              var angleText = WALLS[ribMaster[t][a][n].wallIndex].angle*(180/Math.PI);
              var shiftValue = -shift;
              if (ribMaster[t][a][n-1].side == 'down') {shiftValue = -shiftValue+10;}
              if (angleText > 90 || angleText < -89) {
                angleText-=180;
                if (ribMaster[t][a][n-1].side == 'down') {shiftValue = -shift;}
                else shiftValue = -shiftValue+10;
              }
              sizeText[n] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              var startText = qSVG.middle(ribMaster[t][a][n-1].coords.x, ribMaster[t][a][n-1].coords.y, ribMaster[t][a][n].coords.x, ribMaster[t][a][n].coords.y);
              sizeText[n].setAttributeNS(null, 'x', startText.x);
              sizeText[n].setAttributeNS(null, 'y', (startText.y)+(shiftValue));
              sizeText[n].setAttributeNS(null, 'text-anchor', 'middle');
              sizeText[n].setAttributeNS(null, 'font-family', 'roboto');
              sizeText[n].setAttributeNS(null, 'stroke', '#ffffff');
              sizeText[n].textContent = valueText.toFixed(2);
              if (sizeText[n].textContent < 1) {
                sizeText[n].setAttributeNS(null, 'font-size', '0.73em');
                sizeText[n].textContent = sizeText[n].textContent.substring(1, sizeText[n].textContent.length);
              }
              else sizeText[n].setAttributeNS(null, 'font-size', '0.9em');
              sizeText[n].setAttributeNS(null, 'stroke-width', '0.2px');
              sizeText[n].setAttributeNS(null, 'fill', '#555555');
              sizeText[n].setAttribute("transform", "rotate("+angleText+" "+startText.x+","+(startText.y)+")");

              $('#boxRib').append(sizeText[n]);
          }
        }
      }
    }
  }
}

function cursor(tool) {
  if (tool == 'grab') tool = "url('https://wiki.openmrs.org/s/en_GB/7502/b9217199c27dd617c8d51f6186067d7767c5001b/_/images/icons/emoticons/add.png') 8 8, auto";
  if (tool == 'scissor') tool = "url('https://maxcdn.icons8.com/windows10/PNG/64/Hands/hand_scissors-64.png'), auto";
  if (tool == 'trash') tool = "url('https://cdn4.iconfinder.com/data/icons/common-toolbar/36/Cancel-32.png'), auto";
  if (tool == 'validation') tool = "url('https://images.fatguymedia.com/wp-content/uploads/2015/09/check.png'), auto";
  $('#lin').css('cursor',tool);
}

function raz_button() {
    $('#rect_mode').removeClass('btn-success');
    $('#rect_mode').addClass('btn-default');
    $('#select_mode').removeClass('btn-success');
    $('#select_mode').addClass('btn-default');
    $('#line_mode').removeClass('btn-success');
    $('#line_mode').addClass('btn-default');
    $('#partition_mode').removeClass('btn-success');
    $('#partition_mode').addClass('btn-default');
    $('#room_mode').removeClass('btn-success');
    $('#room_mode').addClass('btn-default');
    $('#object_mode').removeClass('btn-success');
    $('#object_mode').addClass('btn-default');
}

function fonc_button(modesetting ,option) {
  save();

  $('.sub').hide();
    raz_button();
    if (option != 'simpleStair') {
      $('#' + modesetting).removeClass('btn-default');
      $('#' + modesetting).addClass('btn-success');

    }
    mode = modesetting;
    modeOption = option;

    if (typeof(lineIntersectionP) != 'undefined') {
        lineIntersectionP.remove();
        delete lineIntersectionP;
    }
}

$('#room_mode').click(function() {
    $('#lin').css('cursor', 'pointer');
    fonc_button('room_mode');
});

$('#select_mode').click(function() {
  if (typeof(binder) != 'undefined') {
      binder.remove();
      delete binder;
  }

    fonc_button('select_mode');
});

$('#line_mode').click(function() {
    $('#lin').css('cursor', 'crosshair');
    multi = 0;
    action = 0;
    // snap = calcul_snap(event, grid_snap);
    //
    // pox = snap.x;
    // poy = snap.y;
    fonc_button('line_mode');
});

$('#partition_mode').click(function() {
    $('#lin').css('cursor', 'crosshair');
    multi = 0;
    fonc_button('partition_mode');
});

$('#rect_mode').click(function() {
    $('#lin').css('cursor', 'crosshair');
    fonc_button('rect_mode');
});

$('.object').click(function() {
    cursor('move');
    fonc_button('object_mode', this.id);
});

$('#grid_mode').click(function() {
    if (grid_snap == 'on') {
        grid_snap = 'off';
        $('#grid_mode').removeClass('btn-success');
        $('#grid_mode').addClass('btn-warning');
        $('#grid_mode').html('GRID OFF');
        $('#boxgrid').css('opacity', '0.5');
    } else {
        grid_snap = 'on';
        $('#grid_mode').removeClass('btn-warning');
        $('#grid_mode').addClass('btn-success');
        $('#grid_mode').html('GRID ON <i class="fa fa-th" aria-hidden="true"></i>');
        $('#boxgrid').css('opacity', '1');
    }
});
