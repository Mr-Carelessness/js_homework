var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];

//向量x 和 向量y
class Vector{
  constructor(x,y){
    this.x = x;
    this.y = y;    
  }
  //向量之间的加法
  plus(other){
    return new Vector(this.x + other.x, this.y + other.y);
  }

}

//【Grid】【构造函数】，有高度和宽度，还有以数组形式存放的网格
class Grid{
  constructor(width, height) {
    //1*(width*height)
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
  }
  //Grid内，判断一个向量（点）是否在grid自身范围以内
  isInside(vector) {
    return vector.x >= 0 && vector.x < this.width &&
          vector.y >= 0 && vector.y < this.height;
  };
  //获取Grid指定坐标的网格
  get(vector) {
    return this.space[vector.x + this.width * vector.y];
  };
  //设置指定坐标内的网格为特定值
  set(vector, value) {
    this.space[vector.x + this.width * vector.y] = value;
  };
  //网格内所有的格子都调用f函数，传入value（格子值）和它自己的向量
  forEach(f, context) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var value = this.space[x + y * this.width];
        if (value != null)
          f.call(context, value, new Vector(x, y));
      }
    }
  };

}


//8个不同的方向
var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};
//获取数组内部任意一个元素 
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
//方向坐标名称，split是将字符串拆分成数组
var directionNames = "n ne e se s sw w nw".split(" ");

//【BouncingCritter】{跳跃的小动物}是一个【构造函数】
class BouncingCritter{
  constructor(){
    //direction：获取随机的一个方向
    this.direction = randomElement(directionNames);
  }
  //在prototype中的act方法
  act(view) {
    //假如view往它要移动的坐标方向上看，不为" "，找到周围附近为" "的坐标，再没有直接往s方向走
    if (view.look(this.direction) != " ")
      this.direction = view.find(" ") || "s";
    return {type: "move", direction: this.direction};
  };
}

//元素转成字符
function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch](); /* ？legend申明中的一个元素 */
  //console.log(element);//
  element.originChar = ch;
  return element;
}
//根据element获取字符#/o
function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}

//【World】{世界}【构造函数】
class World{
  //构造函数
  constructor(map, legend) {
    //世界网格
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    //legend表示一个对象格式的标记，{#表示墙，o表示小动物}
    this.legend = legend;
    
    //grid的每一个坐标[x,y]，设置坐标是#还是o
    //外层循环针对于y，内存循环针对于x（一行字符串）
    map.forEach(function(line, y) {
      for (var x = 0; x < line.length; x++)
        grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
    });
    //console.log(world的Call方法)
  }

  //重写World的toString()方法，将对象Wold转化成字符串版地图输出
  toString() {
    var output = "<div><table>";
    var a=0,b=0,c=0,d=0,e=0,f=0;
    for (var y = 0; y < this.grid.height; y++) {
      output += "<tr>"
      for (var x = 0; x < this.grid.width; x++) {
        var element = this.grid.get(new Vector(x, y));
        //console.log(charFromElement(element));
        if(charFromElement(element) == " "){
          output += "<td>&nbsp;</td>";a++;
        }else if(charFromElement(element) == "*"){
          output += "<td class='green'>"+charFromElement(element)+"</td>";b++;
        }else if(charFromElement(element) == "O"){
          output += "<td class='blue'>"+charFromElement(element)+"</td>";c++;
        }else if(charFromElement(element) == "X"){
          output += "<td class='red'>"+charFromElement(element)+"</td>";d++;
        }else if(charFromElement(element) == "#"){
          output += "<td class='grey'>"+charFromElement(element)+"</td>";e++;
        }else{
          output += "<td>"+charFromElement(element)+"</td>";f++;
        }
      }
      output += "</tr>";
    }
    var s = a+b+c+d+e+f;
    var ans = 0;
    if(a>0){a=a/s; ans+=(a*Math.log(a));}
    if(b>0){b=b/s; ans+=(b*Math.log(b));}
    if(c>0){c=c/s; ans+=(c*Math.log(c));}
    if(d>0){d=d/s; ans+=(d*Math.log(d));}
    if(e>0){e=e/s; ans+=(e*Math.log(e));}
    if(f>0){f=f/s; ans+=(f*Math.log(f));}
    output += "</table>";
    output += "<p>该生态系统(大小28*20)的信息熵为："+ (-ans).toFixed(2).toString() +"nat</p>";
    output += "</div>";
    return output;
  };

  // /* ？ */有疑问
  turn() {
    var acted = [];
    //遍历所有网格，
    this.grid.forEach(function(critter, vector) {
      //小动物有了行动，并且acted坐标没有出现小动物
      if (critter.act && acted.indexOf(critter) == -1) {
        //把小动物推进acted数组里面
        acted.push(critter);
        //调用小动物移动的函数
        this.letAct(critter, vector);
      }
    }, this);
  };

  //小动物移动的发生函数
  letAct(critter, vector) {
    //获取小动物下一步移动的方向
    var action = critter.act(new View(this, vector));
    //可以移动的话
    if (action && action.type == "move") {
      //检查移动后坐标是否在网格范围内
      var dest = this.checkDestination(action, vector);
      if (dest && this.grid.get(dest) == null) {
        //将移动起始坐标点设置成null（" "）
        this.grid.set(vector, null);
        //将目标坐标点设置成critter（o）
        this.grid.set(dest, critter);
      }
    }
  };

  //检查目标坐标是否在网格内
  checkDestination(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
      //根据当前位置以及移动方向确定目标坐标
      var dest = vector.plus(directions[action.direction]);
      //如果目标坐标在网格范围内，返回坐标值
      if (this.grid.isInside(dest))
        return dest;
    }
  };
}

//【Wall】{墙}【构造函数】
class Wall{
}

//构造一个世界函数，存放在world变量里面
var world = new World(plan, {"#": Wall,"o": BouncingCritter});
//plan在第一行，或下图，#表示墙，o表示食草动物
//   ############################
//   #      #    #      o      ##
//   #                          #
//   #          #####           #
//   ##         #   #    ##     #
//   ###           ##     #     #
//   #           ###      #     #
//   #   ####                   #
//   #   ##       o             #
//   # o  #         o       ### #
//   #    #                     #
//   ############################


//【View】{}【构造函数】
class View{
  constructor(world, vector) {
    this.world = world;
    this.vector = vector;
  }

  //根据dir找到方向坐标，和自身的vector相加，假如在网格坐标内，返回坐标格#/o，否则返回#
  look(dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target))
      return charFromElement(this.world.grid.get(target));
    else
      return "#";
  };

  //找到周围八个方向内的网格，假如跟ch相等，则push进去
  findAll(ch) {
    var found = [];
    for (var dir in directions)
      if (this.look(dir) == ch)
        found.push(dir);
    return found;
  };

  //在可以行走的路径中，随机选择一个dir方向
  find(ch) {
    var found = this.findAll(ch);
    if (found.length == 0) return null;
    return randomElement(found);
  };

}

// (生物)朝向相加函数，比如朝向为3(s)，-3的结果为0(n)
function dirPlus(dir, n) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

//【WallFollower】【构造函数】
class WallFollower{
  constructor(){
    this.dir = "s";
  }
  //通过act函数，决定wallfollwer接下来的走向（空白区域优先）
  act(view) {
    var start = this.dir;
    //假如view走向一个方向之后它碰到的不是" "
    if (view.look(dirPlus(this.dir, -3)) != " ")
      start = this.dir = dirPlus(this.dir, -2);
    //通过循环决定下一步的走向" "
    while (view.look(this.dir) != " ") {
      this.dir = dirPlus(this.dir, 1);
      if (this.dir == start) break;
    }
    return {type: "move", direction: this.dir};
  };  

}


/*
*   【LifelikeWorld】真正起到作用
*/
//【LifelikeWorld】【构造函数】（继承自World）
class LifelikeWorld extends World{
  //letAct是一个函数，表示
  letAct(critter, vector) {
    //critter获取行动方向
    var action = critter.act(new View(this, vector));
    //console.log(critter); /* ★ */
    //action.type不在actionType对象里面，/* ？ */有疑问
    var handled = action && action.type in actionTypes && actionTypes[action.type].call(this, critter, vector, action);
    //没有被处理？，小动物的能量-0.2，小动物的能量<0，小动物消失
    if (!handled) {
      critter.energy -= 0.2;
      if (critter.energy <= 0)
        this.grid.set(vector, null);
    }
  };
}

//构造一个新的动作类型
var actionTypes = Object.create(null);
//打架（减少能量）
actionTypes.fight = function(critter){
  critter.energy -= 2;
  return true;
}
//增加能量
actionTypes.grow = function(critter) {
  critter.energy += 0.5;
  return true;
};
//移动，可以移动返回true，不能返回false
actionTypes.move = function(critter, vector, action) {
  //检查向量移动了之后是否在网格内，并返回结果
  var dest = this.checkDestination(action, vector);
  //目标为空，或者生物的能量小于1或者，或者目标内已经有其它的东西了，则返回空
  if (dest == null || critter.energy <= 1 || this.grid.get(dest) != null)
    return false;
  //移动了之后，小动物的能量减1
  critter.energy -= 1;
  //移动了之后，将原来的坐标设置Null
  this.grid.set(vector, null);
  //将目标坐标设置成critter
  this.grid.set(dest, critter);
  return true;
};
//吃
actionTypes.eat = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  critter.energy += atDest.energy*(0.8+Math.random()*0.2); //获得食物的的0.8-1倍能量
  this.grid.set(dest, null);
  return true;
};
//生产一个子对象
actionTypes.reproduce = function(critter, vector, action) {
  var baby = elementFromChar(this.legend, critter.originChar);
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};

//【植物】【构造函数】
class Plant{
  //随机生成能量
  constructor(){
    this.energy = 3 + Math.random() * 4;
  }
  //plant生长或产生子plant
  act(view) {
    //植物的能量大于12，再生产一个
    if (this.energy > 12) {
      var space = view.find(" ");
      if (space)
        return {type: "reproduce", direction: space};
    }
    //植物的能量小于20，则继续生长
    if (this.energy < 20)
      return {type: "grow"};
  };
}

//【食草者】【构造函数】
class PlantEater{
  constructor(){
    this.energy = 20;
  }
  //行动，吃或生产孩子
  act = function(view) {
    var space = view.find(" ");
    //console.log(this.energy);
    //能量大于60，朝space方向再生产Eater
    if (this.energy > 60 && space)
      return {type: "reproduce", direction: space};
    var plant = view.find("*");
    //周围有植物，吃掉植物
    if (plant)
      return {type: "eat", direction: plant};
    //周围有空格，朝空格移动
    if (space)
      return {type: "move", direction: space};
  };
}

//【食肉者】【构造函数】
class Tiger{
  constructor(){
    this.energy = 40;
  }
  //移动，吃或生产子孩子
  act(view) {
    var space = view.find(" ");
    //能量大于70，朝space方向再生产Tiger
    if (this.energy > 70 && space)
      return {type: "reproduce", direction: space};
    var planteater = view.find("O");
    var tiger = view.find("X");
    //周围有植物，吃掉植物
    if (planteater)
      return {type: "eat", direction: planteater};
    //周围有老虎
    if(tiger){
      if(Math.random()*10 < 3){
        return {type: "fight"};
      }
    }
    //周围有空格，朝空格移动
    if (space)
      return {type: "move", direction: space};
  };
}

//随机生成一行地图
function randomLine(size){
  var line = "";
  var p;
  for(var i=0;i<size;i++){
    if(i==0 || i==size-1){
      line+="#";
    }else{
      p = Math.random()*100;
      if(p<3){line+="X";}
      else if(p<10){line+="O";}
      else if(p<20){line+="*"}
      else if(p<90){line+=" ";}
      else{line+="#";}
    }
  }
  return line;
}

var valley = new LifelikeWorld(
  ["############################",
   "#####                 ######",
   "##   ***                **##",
   "#   *##**         **  O  *##",
   "#    ***     O    ##**    *#",
   "#       O         ##***    #",
   "#                 ##**     #",
   randomLine(28),
   randomLine(28),
   randomLine(28),
   randomLine(28),
   randomLine(28),
   randomLine(28),
   randomLine(28),
   randomLine(28),
   randomLine(28),
   "#   O       #*             #",
   "#*          #**       O    #",
   "#***        ##**    O    **#",
   "##****     ###***       *###",
   "############################"],
  {"#": Wall,
   "O": PlantEater,
   "*": Plant,
   "X": Tiger
  }
);
//

/*
参考资料：
【1】信息熵的计算：https://www.cnblogs.com/ShaneZhang/p/3970176.html  2019/04/11
【2】es6 Class：http://10.66.27.234/054.es6.class/ 2019/04/14
【3】再次理解js的Call函数：https://www.cnblogs.com/-ding/p/5632331.html 2019/04/14
*/