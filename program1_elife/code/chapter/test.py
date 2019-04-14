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
            "############################"]
def Vector(x, y):
  this.x = x
  this.y = y

Vector.prototype.plus = def(other):
  return new Vector(this.x + other.x, this.y + other.y)


def Grid(width, height):
  //1*(width*height)
  this.space = new Array(width * height)
  this.width = width
  this.height = height


Grid.prototype.isInside = def(vector):
  return vector.x >= 0 and vector.x < this.width &&
         vector.y >= 0 and vector.y < this.height


Grid.prototype.get = def(vector):
  return this.space[vector.x + this.width * vector.y]


Grid.prototype.set = def(vector, value):
  this.space[vector.x + this.width * vector.y] = value


var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
}

def randomElement(array):
  return array[Math.floor(Math.random() * array.length)]


var directionNames = "n ne e se s sw w nw".split(" ")

def BouncingCritter():
  this.direction = randomElement(directionNames)


BouncingCritter.prototype.act = def(view):
  if view.look(this.direction) not = " ")
    this.direction = view.find(" ")or "s"
  return {type: "move", direction: this.direction}
}

def elementFromChar(legend, ch:
  if ch == " ")
    return None
  var element = new legend[ch]()
  element.originChar = ch
  return element
}

def World(map, legend:
  var grid = new Grid(map[0].length, map.length)
  this.grid = grid
  this.legend = legend

  map.forEach(def(line, y):
    for var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y),
               elementFromChar(legend, line[x]))
  )


def charFromElement(element):
  if element == None)
    return " "
  else
    return element.originChar
}

World.prototype.toString = def(:
  var output = ""
  for var y = 0; y < this.grid.height; y++:
    for var x = 0; x < this.grid.width; x++:
      var element = this.grid.get(new Vector(x, y))
      output += charFromElement(element)

    output += "\n"

  return output


def Wall(): pass


var world = new World(plan, {"#": Wall,"o": BouncingCritter})
#   #      #    #      o      ##
#   #                          #
#   #          #####           #
#   ##         #   #    ##     #
#   ###           ##     #     #
#   #           ###      #     #
#   #   ####                   #
#   #   ##       o             #
#   # o  #         o       ### #
#   #    #                     #
#   ############################

Grid.prototype.forEach = def(f, context):
  for var y = 0; y < this.height; y++:
    for var x = 0; x < this.width; x++:
      var value = this.space[x + y * this.width]
      if value not = None)
        f.call(context, value, new Vector(x, y))
    }
  }
}

World.prototype.turn = def(:
  var acted = []
  this.grid.forEach(def(critter, vector):
    if critter.act and acted.indexOf(critter) == -1:
      acted.append(critter)
      this.letAct(critter, vector)

  , this)


World.prototype.letAct = def(critter, vector):
  var action = critter.act(new View(this, vector))
  if action and action.type == "move":
    var dest = this.checkDestination(action, vector)
    if dest and this.grid.get(dest) == None:
      this.grid.set(vector, None)
      this.grid.set(dest, critter)




World.prototype.checkDestination = def(action, vector):
  if directions.hasOwnProperty(action.direction):
    var dest = vector.plus(directions[action.direction])
    if this.grid.isInside(dest))
      return dest
  }
}

def View(world, vector:
  this.world = world
  this.vector = vector

View.prototype.look = def(dir):
  var target = this.vector.plus(directions[dir])
  if this.world.grid.isInside(target))
    return charFromElement(this.world.grid.get(target))
  else
    return "#"
}
View.prototype.findAll = def(ch:
  var found = []
  for var dir in directions)
    if this.look(dir) == ch)
      found.append(dir)
  return found
}
View.prototype.find = def(ch:
  var found = this.findAll(ch)
  if found.length == 0) return None
  return randomElement(found)
}

def dirPlus(dir, n:
  var index = directionNames.indexOf(dir)
  return directionNames[(index + n + 8) % 8]


def WallFollower():
  this.dir = "s"


WallFollower.prototype.act = def(view):
  var start = this.dir
  if view.look(dirPlus(this.dir, -3)) not = " ")
    start = this.dir = dirPlus(this.dir, -2)
  while view.look(this.dir) not = " ":
    this.dir = dirPlus(this.dir, 1)
    if this.dir == start) break
  }
  return {type: "move", direction: this.dir}
}

def LifelikeWorld(map, legend:
  World.call(this, map, legend)

LifelikeWorld.prototype = Object.create(World.prototype)

var actionTypes = Object.create(None)

LifelikeWorld.prototype.letAct = def(critter, vector):
  var action = critter.act(new View(this, vector))
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter,
                                  vector, action)
  if not handled:
    critter.energy -= 0.2
    if critter.energy <= 0)
      this.grid.set(vector, None)
  }
}

actionTypes.grow = def(critter:
  critter.energy += 0.5
  return True


actionTypes.move = def(critter, vector, action):
  var dest = this.checkDestination(action, vector)
  if dest == None ||
      critter.energy <= 1 ||
      this.grid.get(dest) not = None)
    return False
  critter.energy -= 1
  this.grid.set(vector, None)
  this.grid.set(dest, critter)
  return True
}

actionTypes.eat = def(critter, vector, action:
  var dest = this.checkDestination(action, vector)
  var atDest = dest not = None and this.grid.get(dest)
  if not atDestor atDest.energy == None)
    return False
  critter.energy += atDest.energy
  this.grid.set(dest, None)
  return True
}

actionTypes.reproduce = def(critter, vector, action:
  var baby = elementFromChar(this.legend,
                             critter.originChar)
  var dest = this.checkDestination(action, vector)
  if dest == None ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest) not = None)
    return False
  critter.energy -= 2 * baby.energy
  this.grid.set(dest, baby)
  return True
}

def Plant(:
  this.energy = 3 + Math.random() * 4

Plant.prototype.act = def(view):
  if this.energy > 15:
    var space = view.find(" ")
    if space)
      return {type: "reproduce", direction: space}
  }
  if this.energy < 20)
    return {type: "grow"}
}

def PlantEater(:
  this.energy = 20

PlantEater.prototype.act = def(view):
  var space = view.find(" ")
  if this.energy > 60 and space)
    return {type: "reproduce", direction: space}
  var plant = view.find("*")
  if plant)
    return {type: "eat", direction: plant}
  if space)
    return {type: "move", direction: space}
}

var valley = new LifelikeWorld(
  ["############################",
   "#####                 ######",
   "##   ***                **##",
   "#   *##**         **  O  *##",
   "#    ***     O    ##**    *#",
   "#       O         ##***    #",
   "#                 ##**     #",
   "#   O       #*             #",
   "#*          #**       O    #",
   "#***        ##**    O    **#",
   "##****     ###***       *###",
   "############################"],
  {"#": Wall,
   "O": PlantEater,
   "*": Plant}
)

)

)

)
