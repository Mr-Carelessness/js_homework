// test: no

(function() {
  "use strict";

  var active = null;

  function Animated(world) {
    this.world = world;
    var outer = (window.__sandbox ? window.__sandbox.output.div : document.body), doc = outer.ownerDocument;
    var node = outer.appendChild(doc.createElement("div"));
    node.style.cssText = "position: relative; width: intrinsic; width: fit-content;";

    this.idiv = node.appendChild(doc.createElement("div"));
    this.idiv.innerHTML = world.toString();
    //this.pre = node.appendChild(doc.createElement("pre"));
    ////this.pre.innerHTML = doc.createTextNode(world.toString());
    //this.pre.appendChild(doc.createTextNode(world.toString()));//world转化成string，呈现在html出来

    this.button = node.appendChild(doc.createElement("div"));
    this.button.style.cssText = "position: absolute; bottom: 8px; right: -4.5em; color: white; font-family: tahoma, arial; " +
      "background: #4ab; cursor: pointer; border-radius: 18px; font-size: 70%; width: 3.5em; text-align: center;";
    this.button.innerHTML = "stop";
    var self = this;
    this.button.addEventListener("click", function() { self.clicked(); });
    this.disabled = false;
    if (active) active.disable();
    active = this;
    this.interval = setInterval(function() { self.tick(); }, 333);
  }

  Animated.prototype.clicked = function() {
    if (this.disabled) return;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.button.innerHTML = "start";
    } else {
      var self = this;
      this.interval = setInterval(function() { self.tick(); }, 333);
      this.button.innerHTML = "stop";
    }
  };

  Animated.prototype.tick = function() {
    this.world.turn();
    //console.log(this.idiv.firstChild);
    //this.idiv.removeChild(this.idiv.firstChild);
    this.idiv.firstChild.innerHTML = "";
    //this.idiv.appendChild(this.idiv.ownerDocument.createTextNode(this.world.toString()));
    //this.idiv = node.appendChild(doc.createElement("div"));
    this.idiv.firstChild.innerHTML = this.world.toString();
  };

  Animated.prototype.disable = function() {
    this.disabled = true;
    clearInterval(this.interval);
    this.button.innerHTML = "Disabled";
    this.button.style.color = "red";
  };

  window.animateWorld = function(world) { new Animated(world); };
})();
