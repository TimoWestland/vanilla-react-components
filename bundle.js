(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Root = require('./components/Root')
var getInitialState = require('./getInitialState')
var reducer = require('./reducer')

/**
 * App loader.
 *
 * window.addEventListener('load', app(state))
 */

function app (initialState) {
  return function () {
    var currentState = initialState || getInitialState()

    var render = Function.prototype

    function dispatch (action) {
      currentState = reducer(currentState, action)
      render(currentState)
    }

    var root = new Root(document, dispatch) // or use any other DOM element

    render = root.render.bind(root)
    render(currentState)
  }
}

module.exports = app

},{"./components/Root":4,"./getInitialState":7,"./reducer":9}],2:[function(require,module,exports){
var Component = require('./Component')

class AddTodo extends Component {
  constructor (element, dispatch) {
    super(element)

    var input = element.querySelector('input')

    var button = element.querySelector('button')

    button.onclick = function () {
      if (input.value) {
        dispatch({
          type: 'ADD_TODO',
          what: input.value
        })

        input.value = ''
      } else {
        input.focus()
      }
    }
  }
}

module.exports = AddTodo

},{"./Component":3}],3:[function(require,module,exports){
class Component {
  constructor (element, dispatch) {
    this.element = element
    this.dispatch = dispatch

    this.component = {}
  }

  render (state) {
    var component = this.component

    Object.keys(component).forEach(function (key) {
      component[key].render(state)
    })
  }
}

module.exports = Component

},{}],4:[function(require,module,exports){
var Component = require('./Component')

var AddTodo = require('./AddTodo')
var TodoList = require('./TodoList')

class Root extends Component {
  constructor (element, dispatch) {
    super(element, dispatch)

    this.component.TodoList = new TodoList(element.querySelector('ul.todo-list'), dispatch)

    this.component.AddTodo = new AddTodo(element.querySelector('.add-todo'), dispatch)
  }
}

module.exports = Root

},{"./AddTodo":2,"./Component":3,"./TodoList":6}],5:[function(require,module,exports){
var Component = require('./Component')

class Todo extends Component {
  constructor (element, dispatch, index) {
    super(element, dispatch)

    this.index = index

    element.onclick = function () {
      dispatch({
        type: 'TOGGLE_TODO',
        index: index
      })
    }
  }

  render (state) {
    var element = this.element
    var index = this.index

    var todo = state.todos[index]

    var done = todo.done
    var what = todo.what

    if (element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(what))
    }

    if (element.classList.contains('completed')) {
      if (!done) element.classList.toggle('completed')
    } else {
      if (done) element.classList.add('completed')
    }
  }
}

module.exports = Todo

},{"./Component":3}],6:[function(require,module,exports){
var Component = require('./Component')
var Todo = require('./Todo')

class TodoList extends Component {
  constructor (element, dispatch) {
    super(element, dispatch)

    this.component = []
  }

  render (state) {
    var dispatch = this.dispatch

    for (var index = 0; index < state.todos.length; index++) {
      if (index < this.component.length) {
        this.component[index].render(state)
      } else {
        var element = document.createElement('li')

        this.element.appendChild(element)

        var todo = new Todo(element, dispatch, index)
        this.component.push(todo)
        todo.render(state)
      }
    }
  }
}

module.exports = TodoList

},{"./Component":3,"./Todo":5}],7:[function(require,module,exports){
function getInitialState () {
  return {
    todos: []
  }
}

module.exports = getInitialState

},{}],8:[function(require,module,exports){
var app = require('./app')

var initialState = { todos: [{what: 'remember the milk'}] }

window.addEventListener('load', app(initialState))

},{"./app":1}],9:[function(require,module,exports){
function reducer (currenState, action) {
  var state = Object.assign(currenState)

  switch (action.type) {
    case 'ADD_TODO':
      state.todos.push({
        done: false,
        what: action.what
      })

      break

    case 'TOGGLE_TODO':
      state.todos[action.index].done = !state.todos[action.index].done

      break
  }

  return state
}

module.exports = reducer

},{}]},{},[8]);