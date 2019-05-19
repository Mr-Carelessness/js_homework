var simpleLevelPlan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];

//关卡
function Level(plan) {
  this.width = plan[0].length;//长
  this.height = plan.length;//宽
  this.grid = [];
  this.actors = [];

  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];
    for (var x = 0; x < this.width; x++) {
      var ch = line[x], fieldType = null;
      var Actor = actorChars[ch];
      if (Actor)
        this.actors.push(new Actor(new Vector(x, y), ch));
      else if (ch == "x")
        fieldType = "wall";
      else if (ch == "!")
        fieldType = "lava";
      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }

  this.player = this.actors.filter(function(actor) {
    return actor.type == "player";
  })[0];
  this.status = this.finishDelay = null;
}
//是否完成关卡
Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};

//【构造函数】向量
function Vector(x, y) {
  this.x = x; this.y = y;
}
//向量累加
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
//向量数乘
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};

//【定义】@/o/=/|/v等符号的定义
var actorChars = {
  "@": Player,
  "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};

//【构造函数】玩家
function Player(pos) {
  //位置，大小与速度
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
}
//在原型当中定义类型
Player.prototype.type = "player";

//【构造函数】岩浆
function Lava(pos, ch) {
  //位置，大小与速度
  this.pos = pos;
  this.size = new Vector(1, 1);
  if (ch == "=") {
    this.speed = new Vector(2, 0); //向右速度为2
  } else if (ch == "|") {
    this.speed = new Vector(0, 2); //向下速度为2
  } else if (ch == "v") {
    this.speed = new Vector(0, 3); //向下速度为3
    this.repeatPos = pos;
  }
}
Lava.prototype.type = "lava";

//【构造函数】金币
function Coin(pos) {
  //位置，大小与与晃动情况
  this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
  this.size = new Vector(0.6, 0.6);
  this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

//根据simpleLevelPlan定义简单关卡
var simpleLevel = new Level(simpleLevelPlan);

//返回一个【DOM】对象，DOM的类名是className
function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

//【构造函数】展示DOM元素
function DOMDisplay(parent, level) {
  //设置wrap, 关卡
  //<div>
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null; //绘画层（就是说有了关卡之后actorLayer就是关卡的界面）
  this.drawFrame();
}

//显示每格大小是20
var scale = 20;
//绘画背景
DOMDisplay.prototype.drawBackground = function() {
  //<table>
  var table = elt("table", "background");
  //设定table的宽度
  table.style.width = this.level.width * scale + "px";
  
  this.level.grid.forEach(function(row) {
    //每行加上<tr>
    var rowElt = table.appendChild(elt("tr"));
    //每行的高度为scale-px
    rowElt.style.height = scale + "px";
    //每行添加<td>格子，td内容为type（row存的是['wall','...'等]）
    row.forEach(function(type) {
      rowElt.appendChild(elt("td", type));
    });
  });
  return table;
};
//画表演者
DOMDisplay.prototype.drawActors = function() {
  var wrap = elt("div");
  this.level.actors.forEach(function(actor) {
    //绘画win/lose player（actor 是绝对布局）
    var rect = wrap.appendChild(elt("div", "actor "+actor.type));
    //绘制player的长宽高
    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  });
  return wrap;
};
//画一帧
DOMDisplay.prototype.drawFrame = function() {
  if (this.actorLayer)
    this.wrap.removeChild(this.actorLayer);   //有了上一帧之后就移除
  this.actorLayer = this.wrap.appendChild(this.drawActors());   //生成下一帧
  this.wrap.className = "game " + (this.level.status || "");    //设定class，以及游戏状态class
  this.scrollPlayerIntoView();  //
};

DOMDisplay.prototype.scrollPlayerIntoView = function() {
  //定义长宽高
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;
  var margin = width / 3;

  // The viewport
  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5))
                 .times(scale);

  if (center.x < left + margin)
    this.wrap.scrollLeft = center.x - margin;
  else if (center.x > right - margin)
    this.wrap.scrollLeft = center.x + margin - width;
  if (center.y < top + margin)
    this.wrap.scrollTop = center.y - margin;
  else if (center.y > bottom - margin)
    this.wrap.scrollTop = center.y + margin - height;
};
//清屏
DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap);
};

//获取角色在某一处位置的障碍类型
Level.prototype.obstacleAt = function(pos, size) {
  //获取障碍的起始和结束方位
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  if (xStart < 0 || xEnd > this.width || yStart < 0)
    return "wall";
  if (yEnd > this.height)
    return "lava";
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};

//根据actor的位置范围otheractor对象
Level.prototype.actorAt = function(actor) {
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    if (other != actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
      return other;
  }
};

//★定义最大步幅
var maxStep = 0.05;
//控制角色的最大步幅
Level.prototype.animate = function(step, keys) {
  if (this.status != null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};

Lava.prototype.act = function(step, level) {
  var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
  else
    this.speed = this.speed.times(-1);
};

//定义金币的晃动速度与晃动高度
var wobbleSpeed = 8, wobbleDist = 0.07;

//★原型Coin的运动函数
Coin.prototype.act = function(step) {
  this.wobble += step * wobbleSpeed;
  var wobblePos = Math.sin(this.wobble) * wobbleDist;
  this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

//★定义x方向移动速度
var playerXSpeed = 10;

//x方向移动
Player.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if (keys.left) this.speed.x -= playerXSpeed;
  if (keys.right) this.speed.x += playerXSpeed;

  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched(obstacle);
  else
    this.pos = newPos;
};

//★定义重力和跳跃速度
var gravity = 30;
var jumpSpeed = 17;

//y方向移动
Player.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched(obstacle);
    if (keys.up && this.speed.y > 0)
      this.speed.y = -jumpSpeed;
    else
      this.speed.y = 0;
  } else {
    this.pos = newPos;
  }
};

//在player原型中定义移动函数
Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  //获取别的对象
  var otherActor = level.actorAt(this);
  //假如有别的对象了，触发playertouched事件
  if (otherActor)
    level.playerTouched(otherActor.type, otherActor);

  //执行触发函数之后，如果level的状态为lost之后
  if (level.status == "lost") {
    this.pos.y += step;
    this.size.y -= step;
  }
};

//在level原型中定义玩家触碰函数事件
Level.prototype.playerTouched = function(type, actor) {
  //岩浆，游戏结束
  //金币，吃掉金币
  if (type == "lava" && this.status == null) {
    this.status = "lost";
    this.finishDelay = 1;
  } else if (type == "coin") {
    this.actors = this.actors.filter(function(other) {
      return other != actor;
    });
    if (!this.actors.some(function(actor) {
      return actor.type == "coin";
    })) {
      this.status = "won";
      this.finishDelay = 1;
    }
  }
};

//定义“↑、↓、←”箭头的keycode
var arrowCodes = {37: "left", 38: "up", 39: "right"};
//监听键盘按下和按上事件
function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  //添加侦听事件
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc) {
  var lastTime = null;
  //帧函数
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

var arrows = trackKeys(arrowCodes);

//运行关卡（这里的Display对应的是这里的DOMDisplay构造函数）
function runLevel(level, Display, andThen) {
  //展示一个新的关卡（传入的是根结点以及数组中的其中一个level）
  var display = new Display(document.body, level);
  //运行关卡（传入的是一个函数参数）
  runAnimation(function(step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen)
        andThen(level.status);
      return false;
    }
  });
}

//运行游戏
function runGame(plans, Display) {
  //运行第n关
  function startLevel(n) {
    runLevel(new Level(plans[n]), Display, function(status) {
      //状态
      if (status == "lost")
        startLevel(n);       //n改0就重新开始
      else if (n < plans.length - 1)
        startLevel(n + 1);   //运行下一关
      else                   //输出成功的提示
        console.log("You win!");
    });
  }
  //运行第0关（最开始那关）
  startLevel(0);
}
