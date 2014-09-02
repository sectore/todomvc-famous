var View = require('famous/core/View'),
  SequentialLayout = require('famous/views/SequentialLayout'),
  Utility = require('famous/utilities/Utility'),
  TodoItemView = require('./TodoItemView'),
  Surface = require('famous/core/Surface'),
  RenderNode = require('famous/core/RenderNode'),
  Todos = require('../model/Todos'),

// private
// ------------------------------------------------------------

  initListener = function () {
    Todos.on(Todos.UPDATED, todosUpdated.bind(this));
  },

  todosUpdated = function (event) {
    var todos = event.items;
    if (event.kind) {
      switch (event.kind) {
        case Todos.TODO_REMOVED:
          removeTodosAsync.call(this, todos);
          break;
        case Todos.TODO_ADDED:
          // do not add a new todo (which is uncompleted)
          // to completed list
          if(Todos.getFilterState() !== Todos.FILTER_COMPLETED){
            addTodosAsync.call(this, todos);
          }
          break;
        case Todos.COMPLETE_TOGGLED:
          // check update of a single todo view
          if (todos.length === 1) {
            todoCompleteToggled.call(this, todos[0]);
          } else {
            todosCompleteToggled.call(this, todos);
          }
          break;
        default:
      }
    } else {
      updateTodoList.call(this, []);
      addTodosAsync.call(this, todos);
    }
  },

  todoCompleteToggled = function (todo) {
    var filterState = Todos.getFilterState();
    switch (filterState) {
      case Todos.FILTER_NONE:
      case Todos.FILTER_ALL:
        // nothing to do
        break;
      case Todos.FILTER_ACTIVE:
        if (!!todo.completed) {
          removeTodo.call(this, todo);
        } else {
          addTodo.call(this, todo);
        }
        break;
      case Todos.FILTER_COMPLETED:
        if (!todo.completed) {
          removeTodo.call(this, todo);
        } else {
          addTodo.call(this, todo);
        }
        break;
      default:

    }
  },

  todosCompleteToggled = function (todos) {
    var allCompleted = Todos.allCompleted();
    var filterState = Todos.getFilterState();
    switch (filterState) {
      case Todos.FILTER_NONE:
      case Todos.FILTER_ALL:
        // nothing to do
        break;
      case Todos.FILTER_ACTIVE:
        updateTodoList.call(this, []);
        if (!allCompleted) {
          addTodosAsync.call(this, todos);
        }
        break;
      case Todos.FILTER_COMPLETED:
        updateTodoList.call(this, []);
        if (!!allCompleted) {
          addTodosAsync.call(this, todos);
        }
        break;
      default:

    }
  },

  updateTodoList = function (todos) {
    var views = createTodoViewsFromTodos.call(this, todos);
    this.todoViews = views.reverse();
    this.todoList.sequenceFrom(this.todoViews);
  },

  createTodoViewsFromTodos = function (todos) {
    var views = [];
    var view;
    todos.forEach(function (todo) {
      view = new TodoItemView(todo);
      views.push(view);
    })
    return views;
  },

  addContent = function () {

    var bg = new Surface({
      size: [undefined, undefined],
      classes: ['todo-list-footer-bg']
    });
    var node = new RenderNode();

    this.todoList = createTodoList.call(this);
    node.add(this.todoList);
    updateTodoList.call(this, Todos.getTodos());
    this.add(node);
  },

  createTodoList = function () {
    var layout = new SequentialLayout({
      direction: Utility.Direction.Y
    });
    this.todoViews = [];
    layout.sequenceFrom(this.todoViews);
    return layout;
  },

  addTodo = function (todo) {
    var todoView = new TodoItemView(todo);
    this.todoViews.unshift(todoView);
  },

  addTodosAsync = function (todos) {
    todos.forEach(function (todo, index) {
      setTimeout(function () {
        addTodo.call(this, todo);
      }.bind(this), 200 * index);
    }.bind(this));
  },

  removeTodo = function (todo) {
    var view = getViewByTodoId.call(this, todo.id);
    if (view) {
      view.hide(removeTodoView.bind(this));
    }
  },

  removeTodosAsync = function (todos, cb) {
    todos.forEach(function (todo, index) {
      setTimeout(function () {
        removeTodo.call(this, todo);
      }.bind(this), 200 * index);
    }.bind(this));
  },

  removeTodoView = function (todo) {
    var index = getViewIndexByTodoId.call(this, todo.id);
    this.todoViews.splice(index, 1);
  },

  getViewTodos = function () {
    var todos = [];
    this.todoViews.forEach(function (todoView, todoIndex) {
      todos.push(todoView.todo)
    })
    return todos;
  },

  getViewByTodoId = function (id) {
    var view;
    this.todoViews.forEach(function (todoView, todoIndex) {
      if (todoView.getTodoId() === id) {
        view = todoView;
      }
    })
    return view
  },

  getViewIndexByTodoId = function (id) {
    var index = -1;
    this.todoViews.forEach(function (todoView, todoIndex) {
      if (todoView.getTodoId() === id) {
        index = todoIndex;
      }
    })
    return index
  };

// constructor
// ------------------------------------------------------------

function TodoListView() {
  View.apply(this, arguments);

  addContent.call(this);
  initListener.call(this);

// For debugging only
//  Todos.add('hello');
//  Todos.add('world');
}

// public
// ------------------------------------------------------------

TodoListView.prototype = Object.create(View.prototype);
TodoListView.prototype.constructor = TodoListView;

TodoListView.DEFAULT_OPTIONS = {};

module.exports = TodoListView;
