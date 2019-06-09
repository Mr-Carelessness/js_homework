//【代码片段1】：
var foo = {
  [Symbol.iterator]: () => ({
    items: ['p', 'o', 'n', 'y', 'f', 'o', 'o'],
    next: function next () {
      return {
        done: this.items.length === 0,
        value: this.items.shift()
      }
    }
  })
}
//=> 结果：
for (let pony of foo) {
  console.log(pony)
  // <- 'p'
  // <- 'o'
  // <- 'n'
  // <- 'y'
  // <- 'f'
  // <- 'o'
  // <- 'o'
}

//【代码片段2】：
console.log([...foo])
// <- ['p', 'o', 'n', 'y', 'f', 'o', 'o']
console.log(Array.from(foo))
// <- ['p', 'o', 'n', 'y', 'f', 'o', 'o']

//【代码片段3】：
for (let item of $('li')) {
  console.log(item)
  // <- the <li> wrapped in a jQuery object
}

//【代码片段4】：
for (let list of $('ul')) {
  for (let item of list.find('li')) {
    console.log(item)
    // <- <li> 会包装在JQuert对象中
  }
}

//【代码片段5】：
var foo = {
  [Symbol.iterator]: () => {
    var i = 0
    return { next: () => ({ value: ++i }) }
  }
}

//【代码片段6】：
for (let pony of foo) {
  if (pony > 10) {
    break
  }
  console.log(pony)
}
